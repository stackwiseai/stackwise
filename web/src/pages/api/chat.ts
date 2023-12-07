import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
const openAIAPIKey = process.env.OPENAI_API_KEY;
const heliconeAPIKey = process.env.HELICONE_API_KEY;
const owner = 'stackwiseai';
const repo = 'stackwise';
const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF ?? '';
const openai = new OpenAI({
  apiKey: openAIAPIKey,
  baseURL: 'https://oai.hconeai.com/v1',
  defaultHeaders: {
    'Helicone-Auth': `Bearer ${heliconeAPIKey}`,
    'Helicone-Cache-Enabled': 'true',
  },
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const bodyText = await req.text();
  console.log('bodyText', bodyText);
  const body = JSON.parse(bodyText);

  console.log('brief', body.brief);

  console.log('test');

  const codeToChange = await getCurrentCode();

  console.log(codeToChange, bodyText);
  const systemInstructions = `You are a developer focused on writing on only one single file.
You always return a single snippet of typescript code and it's always the full code, even if it's repetitive and long. 

Please note that the code should be fully functional. No placeholders.
Always stay in the same page, you're not allowed to switch page.
please Note You are using nextjs 14.`;

  const content = `This is the app I am working with:
${codeToChange}
This is what I would like to change:
${body.brief}
Please could you rewrite entirely this file, following the system instructions ?
`;
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: systemInstructions,
      },
      { role: 'user', content: content },
    ],
    stream: true,
    temperature: 0,
  });
  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

async function getCurrentCode() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/web/src/app/Home.tsx?ref=${sourceBranch}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const fileContentBase64 = data.content;
    console.log(fileContentBase64);

    const fileContent = Buffer.from(fileContentBase64, 'base64').toString(
      'utf-8'
    );
    console.log(fileContent);

    return fileContent;
  } catch (error) {
    console.error(error);
  }
}

async function getChangedCode(codeToChange, brief) {}
