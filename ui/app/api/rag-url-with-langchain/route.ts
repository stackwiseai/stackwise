import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { Message as VercelChatMessage } from 'ai';
import { StreamingTextResponse } from 'ai';
import type { BaseCallbackConfig } from 'langchain/callbacks';
import {
  collapseDocs,
  splitListOfDocs,
} from 'langchain/chains/combine_documents/reduce';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Document } from 'langchain/document';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PromptTemplate } from 'langchain/prompts';
import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
import { DocumentCompressorPipeline } from 'langchain/retrievers/document_compressors';
import { EmbeddingsFilter } from 'langchain/retrievers/document_compressors/embeddings_filter';
import {
  BytesOutputParser,
  StringOutputParser,
} from 'langchain/schema/output_parser';
import { formatDocument } from 'langchain/schema/prompt_template';
import {
  RunnablePassthrough,
  RunnableSequence,
} from 'langchain/schema/runnable';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export const runtime = 'edge';

enum CrawlMethod {
  FETCH = 'FETCH',
  EDGE_BROWSER = 'EDGE_BROWSER',
  PUPPETEER = 'PUPPETEER',
  APIFY = 'APIFY',
}

const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join('\n\n');
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === 'user') {
      return `Human: ${message.content}`;
    } else if (message.role === 'assistant') {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join('\n');
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

const ANSWER_TEMPLATE = `Answer the question based only on the following context and chat history:
<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

const docsForCrawl = async ({
  origin,
  url,
  crawlMethod,
}: {
  origin: string | null;
  url: string;
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
      return await (async () => {
        // const browser = new WebBrowser({
        //   model,
        //   embeddings,
        //   headers,
        // });
        // const webBrowsePrompt = currentMessageContent;
        // const response = await browser.call(`"${url}","${webBrowsePrompt}"`);

        const loader = new CheerioWebBaseLoader(url, {
          selector: 'body',
        });
        const docs = await loader.load();
        return docs;
      })();
    case CrawlMethod.FETCH:
      return await (async () => {
        const fetched = await fetch(url, {
          headers,
        });
        const body = await fetched.text();
        const contentType = fetched.headers.get('Content-Type');
        // TODO: handle content types differently
        switch (
          contentType
          // case 'text/html':
          //   docs = await run({ html: body, url });
          //   break;
          // case 'application/json':
        ) {
        }
        return [new Document({ pageContent: body })];
      })();

    case CrawlMethod.PUPPETEER:
    case CrawlMethod.APIFY:
      return await (async () => {
        const fetched = await fetch(
          `${origin}/api/rag-url-with-langchain/${crawlMethod.toLowerCase()}`,
          {
            method: 'POST',
            body: JSON.stringify({ url, html: undefined }),
          },
        );
        const body = await fetched.json();
        return body as Document[];
      })();
  }
};
/**
 * This handler initializes and calls a retrieval chain. It composes the chain using
 * LangChain Expression Language. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#conversational-retrieval-chain
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const url = body.url;
    const crawlMethod: CrawlMethod | undefined = body.crawlMethod;
    console.debug('POST rag-url-with-langchain', { messages, url });
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const html: string | undefined = undefined;
    // const html = await (await fetch(url)).text();

    // console.debug('POST rag-url-with-langchain html', { html });

    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0,
      verbose: true,
    });
    // const embeddings = new OpenAIEmbeddings();

    const origin = req.headers.get('origin');
    const docs = await docsForCrawl({
      origin,
      url,
      crawlMethod,
    });

    /**
     * We use LangChain Expression Language to compose two chains.
     * To learn more, see the guide here:
     *
     * https://js.langchain.com/docs/guides/expression_language/cookbook
     */
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    const baseRetriever = await compressedRelevantDocsRetriever(docs, [
      {
        handleRetrieverEnd(documents) {
          resolveWithDocuments(documents);
        },
      },
    ]);

    // const baseRetriever = (
    //   await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {})
    // ).asRetriever({
    //   callbacks: [
    //     {
    //       handleRetrieverEnd(documents) {
    //         resolveWithDocuments(documents);
    //       },
    //     },
    //   ],
    // });

    const retrievalChain = baseRetriever.pipe(combineDocumentsFn);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    const documents = await documentPromise;
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
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

const compressedRelevantDocsRetriever = async (docs: Document[], callbacks) => {
  const embeddingsFilter = new EmbeddingsFilter({
    embeddings: new OpenAIEmbeddings(),
    similarityThreshold: 0.8,
    k: 20,
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 40,
  });

  const compressorPipeline = new DocumentCompressorPipeline({
    transformers: [textSplitter, embeddingsFilter],
  });

  // const baseRetriever = new TavilySearchAPIRetriever({
  //   includeRawContent: true,
  // });
  const baseRetriever = (
    await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings(), {})
  ).asRetriever({ callbacks });

  const retriever = new ContextualCompressionRetriever({
    baseCompressor: compressorPipeline,
    baseRetriever,
  });

  // const retrievedDocs = await retriever.getRelevantDocuments(
  //   "What did the speaker say about Justice Breyer in the 2022 State of the Union?"
  // );
  // console.log({ retrievedDocs });
  return retriever;
};

const mapReduceDocumentsChain = (() => {
  // Initialize the OpenAI model
  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0,
    verbose: true,
  });

  // Define prompt templates for document formatting, summarizing, collapsing, and combining
  const documentPrompt = PromptTemplate.fromTemplate('{pageContent}');
  const summarizePrompt = PromptTemplate.fromTemplate(
    'Summarize this content:\n\n{context}',
  );
  const collapsePrompt = PromptTemplate.fromTemplate(
    'Collapse this content:\n\n{context}',
  );
  const combinePrompt = PromptTemplate.fromTemplate(
    'Combine these summaries:\n\n{context}',
  );

  // Wrap the `formatDocument` util so it can format a list of documents
  const formatDocs = async (documents: Document[]): Promise<string> => {
    const formattedDocs = await Promise.all(
      documents.map((doc) => formatDocument(doc, documentPrompt)),
    );
    return formattedDocs.join('\n\n');
  };

  // Define a function to get the number of tokens in a list of documents
  const getNumTokens = async (documents: Document[]): Promise<number> =>
    model.getNumTokens(await formatDocs(documents));

  // Initialize the output parser
  const outputParser = new StringOutputParser();

  // Define the map chain to format, summarize, and parse the document
  const mapChain = RunnableSequence.from([
    { context: async (i: Document) => formatDocument(i, documentPrompt) },
    summarizePrompt,
    model,
    outputParser,
  ]);

  // Define the collapse chain to format, collapse, and parse a list of documents
  const collapseChain = RunnableSequence.from([
    { context: async (documents: Document[]) => formatDocs(documents) },
    collapsePrompt,
    model,
    outputParser,
  ]);

  // Define a function to collapse a list of documents until the total number of tokens is within the limit
  const collapse = async (
    documents: Document[],
    options?: {
      config?: BaseCallbackConfig;
    },
    tokenMax = 4000,
  ) => {
    const editableConfig = options?.config;
    let docs = documents;
    let collapseCount = 1;
    while ((await getNumTokens(docs)) > tokenMax) {
      if (editableConfig) {
        editableConfig.runName = `Collapse ${collapseCount}`;
      }
      const splitDocs = splitListOfDocs(docs, getNumTokens, tokenMax);
      docs = await Promise.all(
        splitDocs.map((doc) => collapseDocs(doc, collapseChain.invoke)),
      );
      collapseCount += 1;
    }
    return docs;
  };

  // Define the reduce chain to format, combine, and parse a list of documents
  const reduceChain = RunnableSequence.from([
    { context: formatDocs },
    combinePrompt,
    model,
    outputParser,
  ]).withConfig({ runName: 'Reduce' });

  // Define the final map-reduce chain
  const mapReduceChain = RunnableSequence.from([
    RunnableSequence.from([
      { doc: new RunnablePassthrough(), content: mapChain },
      (input) =>
        new Document({
          pageContent: input.content,
          metadata: input.doc.metadata,
        }),
    ])
      .withConfig({ runName: 'Summarize (return doc)' })
      .map(),
    collapse,
    reduceChain,
  ]).withConfig({ runName: 'Map reduce' });

  return mapReduceChain;
})();
