import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { Message, Message as VercelChatMessage } from 'ai';
import { LangChainStream, StreamingTextResponse } from 'ai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import {
  createRetrieverTool,
  OpenAIAgentTokenBufferMemory,
} from 'langchain/agents/toolkits';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Document } from 'langchain/document';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
import { DocumentCompressorPipeline } from 'langchain/retrievers/document_compressors';
import { EmbeddingsFilter } from 'langchain/retrievers/document_compressors/embeddings_filter';
import { AIMessage, ChatMessage, HumanMessage } from 'langchain/schema';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export const runtime = 'edge';

enum CrawlMethod {
  FETCH = 'FETCH',
  EDGE_BROWSER = 'EDGE_BROWSER',
  PUPPETEER = 'PUPPETEER',
  // APIFY = 'APIFY',
}

const TEMPLATE = `If you don't know how to answer a question, use the available tools to look up relevant information. You should particularly do this for questions about URLs.`;

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === 'user') {
    return new HumanMessage(message.content);
  } else if (message.role === 'assistant') {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const modelForName = (modelName: string) => {
  switch (modelName) {
    case 'gemini-pro':
      return new ChatGoogleGenerativeAI({
        modelName,
        temperature: 0,
      });
    case 'gpt-3.5-turbo':
    case 'gpt-3.5-turbo-16k':
    case 'gpt-4':
    case 'gpt-4-1106-preview':
    default:
      return new ChatOpenAI({
        modelName,
        temperature: 0,
        streaming: true,
      });
  }
};

const docsForCrawl = async ({
  origin,
  urls,
  crawlMethod,
}: {
  origin: string | null;
  urls: string[];
  crawlMethod: CrawlMethod | undefined;
}): Promise<Document[]> => {
  const headers = new Headers({
    'User-Agent': 'Stackwise/1.0 (https://stackwise.io)',
  });
  if (!crawlMethod) {
    throw new Error('crawlMethod is required');
  }
  switch (crawlMethod) {
    case CrawlMethod.EDGE_BROWSER:
      return (
        await (async () => {
          const loaders = urls
            .map(
              (url) =>
                new CheerioWebBaseLoader(url, {
                  selector: 'body',
                }),
            )
            .map((loader) => loader.load());

          return await Promise.all(loaders);
        })()
      ).flat();
    case CrawlMethod.FETCH:
      return (
        await Promise.all(
          urls.map(async (url: string) => {
            const fetched = await fetch(url, {
              headers,
            });
            const body = await fetched.text();
            const _contentType = fetched.headers.get('Content-Type');
            // TODO: handle content types differently
            return [new Document({ pageContent: body })];
          }),
        )
      ).flat();

    case CrawlMethod.PUPPETEER:
      return (
        await Promise.all(
          urls.map(async (url: string) => {
            const fetched = await fetch(
              `${origin}/api/rag-url-with-langchain/${crawlMethod.toLowerCase()}`,
              {
                method: 'POST',
                body: JSON.stringify({ url, html: undefined }),
              },
            );
            return (await fetched.json()) as Document[];
          }),
        )
      ).flat();
  }
};

function normalizeUrl(urlString: string): string {
  // Regex pattern to match URL-like strings (with optional protocol and path/query)
  const urlPattern = /(?:https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(\/\S*)?/gi;

  // Check if the string matches the URL pattern
  if (urlPattern.test(urlString)) {
    // Check if the protocol is already present
    if (!/^https?:\/\//i.test(urlString)) {
      // Prepend "https://" if the protocol is missing
      urlString = `https://${urlString}`;
    }
  }
  return urlString;
}

interface CrawlRequest {
  messages: Message[];
  returnIntermediateSteps: boolean;
  crawlMethod: CrawlMethod;
  urls: string[];
  modelName: string;
}

/**
 * This handler initializes and calls a retrieval chain. It composes the chain using
 * LangChain Expression Language. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#conversational-retrieval-chain
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<CrawlRequest>;
    const messages = body.messages ?? [];
    const urls: string[] = (body.urls ?? []).map(normalizeUrl);
    const crawlMethod: CrawlMethod | undefined = body.crawlMethod;
    const modelName = body.modelName ?? 'gpt-3.5-turbo';
    const returnIntermediateSteps: boolean =
      body.returnIntermediateSteps ?? true;

    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = modelForName(modelName);

    const origin = req.headers.get('origin');
    const docs = await docsForCrawl({
      origin,
      urls,
      crawlMethod,
    });

    const baseRetriever = await compressedRelevantDocsRetriever(docs);

    const chat_history = (previousMessages ?? []).map(
      convertVercelMessageToLangChainMessage,
    );
    const chatHistory = new ChatMessageHistory(chat_history);
    const memory =
      model instanceof ChatOpenAI
        ? new OpenAIAgentTokenBufferMemory({
            llm: model,
            memoryKey: 'chat_history',
            outputKey: 'output',
            chatHistory,
          })
        : new BufferMemory({
            chatHistory,
            memoryKey: 'chat_history',
            outputKey: 'output',
          });

    const { stream, handlers } = LangChainStream();

    let resolveWithDocuments: (value: Document[]) => void;
    const sourcesPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });
    /**
     * Wrap the retriever in a tool to present it to the agent in a
     * usable form.
     */
    const tool = createRetrieverTool(baseRetriever, {
      name: 'search_latest_knowledge',
      description: 'Searches and returns up-to-date general information.',
    });

    const executor = await initializeAgentExecutorWithOptions([tool], model, {
      agentType:
        model instanceof ChatOpenAI
          ? 'openai-functions'
          : 'structured-chat-zero-shot-react-description',
      memory,
      returnIntermediateSteps,
      agentArgs: {
        prefix: TEMPLATE,
      },
    });

    void executor.call(
      {
        input: currentMessageContent,
      },
      [
        handlers,
        {
          handleRetrieverEnd: (docs) => {
            resolveWithDocuments(docs);
          },
          handleChainEnd: () => {
            resolveWithDocuments([]);
          },
        },
      ],
    );

    const documents = await sourcesPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + '...',
            metadata: doc.metadata,
          };
        }),
      ),
    ).toString('base64');

    return new StreamingTextResponse(stream, {
      headers: {
        'x-message-index': (previousMessages.length + 1).toString(),
        'x-sources': serializedSources,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

const compressedRelevantDocsRetriever = async (docs: Document[]) => {
  const embeddings = new OpenAIEmbeddings();
  const embeddingsFilter = new EmbeddingsFilter({
    embeddings,
    similarityThreshold: 0.66,
    k: 10,
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

  const compressorPipeline = new DocumentCompressorPipeline({
    transformers: [textSplitter, embeddingsFilter],
  });

  const baseRetriever = (
    await MemoryVectorStore.fromDocuments(docs, embeddings, {})
  ).asRetriever();

  const retriever = new ContextualCompressionRetriever({
    baseCompressor: compressorPipeline,
    baseRetriever,
  });

  return retriever;
};
