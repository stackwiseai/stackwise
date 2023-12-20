import type { NextRequest } from 'next/server';
import type { Document } from 'langchain/document';
import type {
  Browser,
  Page,
  PuppeteerEvaluate,
  PuppeteerGotoOptions,
} from 'langchain/document_loaders/web/puppeteer';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
import { DocumentCompressorPipeline } from 'langchain/retrievers/document_compressors';
import { EmbeddingsFilter } from 'langchain/retrievers/document_compressors/embeddings_filter';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const htmlOrUrl = await req.json();
  console.debug('POST rag-url-with-langchain crawl', htmlOrUrl);
  const docs = await run(htmlOrUrl);
  return new Response(JSON.stringify(docs), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
  });
}

export const run = async ({ html, url }: { html?: string; url?: string }) => {
  /**  Loader use evaluate function ` await page.evaluate(() => document.body.innerHTML);` as default evaluate */
  url = url ?? 'about://about';
  const gotoOptions: PuppeteerGotoOptions | undefined = url
    ? { waitUntil: 'domcontentloaded' }
    : undefined;
  const evaluate: PuppeteerEvaluate | undefined = html
    ? async (page: Page, browser: Browser) => {
        return await page.evaluate(() => html);
      }
    : undefined;
  const loaderWithOptions = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: 'new',
    },
    gotoOptions,
    /**  Pass custom evaluate , in this case you get page and browser instances */
    evaluate,
  });
  const docs = await loaderWithOptions.loadAndSplit();
  return docs;
};

const compressedRelevantDocsRetriever = async (docs: Document[], callbacks) => {
  const embeddingsFilter = new EmbeddingsFilter({
    embeddings: new OpenAIEmbeddings(),
    similarityThreshold: 0.8,
    k: 5,
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
