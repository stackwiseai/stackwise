import type { NextRequest } from 'next/server';
import chrome from 'chrome-aws-lambda';
import type {
  Browser,
  Page,
  PuppeteerEvaluate,
  PuppeteerGotoOptions,
} from 'langchain/document_loaders/web/puppeteer';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const htmlOrUrl = await req.json();
  const docs = await run(htmlOrUrl);
  return new Response(JSON.stringify(docs), {
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
  });
}

const run = async ({ html, url }: { html?: string; url?: string }) => {
  /**  Loader use evaluate function ` await page.evaluate(() => document.body.innerHTML);` as default evaluate */
  const gotoOptions: PuppeteerGotoOptions | undefined = url
    ? { waitUntil: 'domcontentloaded', timeout: 10_000 }
    : undefined;
  url = url ?? 'about://about';
  const evaluate: PuppeteerEvaluate | undefined = html
    ? async (page: Page, _browser: Browser) => {
        return await page.evaluate(() => html);
      }
    : undefined;
  const loaderWithOptions = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: 'new',
      timeout: 10_000,
      executablePath: await chrome.executablePath,
    },
    gotoOptions,
    /**  Pass custom evaluate , in this case you get page and browser instances */
    evaluate,
  });
  const docs = await loaderWithOptions.loadAndSplit();
  return docs;
};
