import OpenAI from 'openai';

interface OutputType {
  name: string;
  packages: string[];
}

export default async function getNameAndPackages(
  code: string
): Promise<OutputType> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not set. Please set the environment variable.'
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Find a good name for this function. Also, include the packages that will need to be installed in order for the function to run.

The name should reflect what the function does. The packages should be anything that would need to be installed in order for the code to work.`,
        },
        {
          role: 'system',
          content: `${fewShotExamples}`,
        },
        {
          role: 'system',
          content: `Now, here is the code that you will generate a correct response for. Code:
${code}
Respond with nothing but the name of the function followed by the packages needed to install in order to run this function from a blank repository in a json format. You must respond in the following json format - {
  "name": "function_name",
  "packages": ["package1", "package2"]
}`,
        },
      ],
      temperature: 0.3,
    });

    const jsonString = response.choices[0].message.content;

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    throw error;
  }
}

const fewShotExamples = `Here are some successful examples:
Code:
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://oai.hconeai.com/v1',
  defaultHeaders: {
    'Helicone-Auth': \`Bearer \${process.env.HELICONE_API_KEY}\`,
  },
});
export const runtime = 'edge';
export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [{ role: 'user', content: messages }],
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
Response:
{
  "name": "openai_chat_completion_with_helicone",
  "packages": ["openai", "ai"]
}


Code:
// app/api/ragPDFWithLangchain/route.ts
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { AIMessage, BaseMessage, HumanMessage } from 'langchain/schema';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export const runtime = 'nodejs';

const chatHistoryDelimiter = \`||~||\`;

// Function to create a HumanMessage or AIMessage based on the prefix
const createMessage = (text: string): BaseMessage => {
  if (text.startsWith('Q: ')) {
    return new HumanMessage({ content: text.slice(3) });
  } else if (text.startsWith('A: ')) {
    return new AIMessage({ content: text.slice(3) });
  } else {
    throw new Error('Unrecognized message type');
  }
};

// Function to transform the specially delimited string into ChatMessageHistory
const transformToChatMessageHistory = (
  chatString: string,
): ChatMessageHistory => {
  const messageHistory = new ChatMessageHistory();
  const messages = chatString.split(chatHistoryDelimiter);

  messages.forEach((messagePart) => {
    const trimmedMessage = messagePart.trim();
    if (trimmedMessage) {
      const message = createMessage(trimmedMessage);
      messageHistory.addMessage(message);
    }
  });

  return messageHistory;
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('pdf');
  const question = formData.get('question') as string;
  const chatHistoryValue = formData.get('chatHistory') as string;

  console.log('Received request:', { file, question });

  if (!file || !(file instanceof Blob)) {
    return new Response(
      JSON.stringify({ error: 'No PDF file provided or file is not a Blob' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!question || typeof question !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Question not provided or not a string' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  console.log('Processing PDF:', { file, question });

  try {
    const loader = new WebPDFLoader(file, { splitPages: true });
    const allDocs = await loader.load();
    const memoryVectorStore = await MemoryVectorStore.fromDocuments(
      allDocs,
      new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' }),
    );
    const llm = new ChatOpenAI({});
    const chatHistory = chatHistoryValue
      ? transformToChatMessageHistory(chatHistoryValue)
      : new ChatMessageHistory();

    const memory = new BufferMemory({
      chatHistory,
      memoryKey: 'chat_history', // Must be set to "chat_history"
    });

    const chain = ConversationalRetrievalQAChain.fromLLM(
      llm,
      memoryVectorStore.asRetriever(),
      {
        memory,
        qaChainOptions: {
          type: 'map_reduce',
        },
      },
    );

    const answer = (await chain.invoke({ question })).text;

    // Return the result as a JSON response
    return new Response(JSON.stringify({ answer }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Error processing PDF: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
Response:
{
  "name": "rag_pdf_with_langchain",
  "packages": ["langchain"]
}

Code: 
import * as fal from '@fal-ai/serverless-client';

fal.config({
  credentials: \`\${process.env.FAL_KEY_ID}:\${process.env.FAL_KEY_SECRET}\`,
});

export const maxDuration = 300;

export async function POST(request: Request) {
  let resp = null;

  const form = await request.formData();
  const imgFile = form.get('img') as Blob;
  const maskFile = form.get('mask') as Blob;
  const degreeOfMotion = form.get('degreeOfMotion') as string;

  const imgBuffer = Buffer.from(await imgFile.arrayBuffer());
  const maskBuffer = Buffer.from(await maskFile.arrayBuffer());

  const imgBase64 = imgBuffer.toString('base64');
  const maskBase64 = maskBuffer.toString('base64');

  // Generate a full URI
  const imgUri = \`data:\${imgFile.type};base64,\${imgBase64}\`;
  const maskUri = \`data:\${maskFile.type};base64,\${maskBase64}\`;

  const payload = {
    subscriptionId: '110602490-svd',
    input: {
      image_url: imgUri,
      mask_image_url: maskUri,
      motion_bucket_id: Number(degreeOfMotion),
      cond_aug: 0.02,
      steps: 100,
    },
    pollInterval: 500,
    logs: true,
  };

  try {
    const result: any = await fal.subscribe(payload.subscriptionId, payload);

    resp = result;
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(resp), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
Response:
{
  "name": "fal_image_and_mask_processing",
  "packages": ["@fal-ai/serverless-client"]
}`;
