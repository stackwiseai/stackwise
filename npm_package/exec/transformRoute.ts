import OpenAI from 'openai';

export default async function transformRoute(originalContent: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is not set. Please set the environment variable.'
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert at converting an api route into code that complies with the Javascript lambda handler syntax. You will keep all of the contents and logic of the code the same, doing the minimal modifications possible in order for the route to work as a lambda function.',
      },
      {
        role: 'system',
        content:
          'Only respond with code, no words. An analogy would be that you are just a transpiler, turning the contents of a code file into another code file that works with lambda syntax.',
      },
      {
        role: 'system',
        content: `Here is the original code for the api route that you will be converting: \n${originalContent}\n`,
      },
      {
        role: 'system',
        content: `${fewShotExamples} \n Notice how nothing the code is returned.`,
      },
      {
        role: 'system',
        content:
          'Remember that you are just making syntax modifications so that the code works as a lambda function, while leaving the rest of the code the same. Responding with nothing but the converted code, meaning no words, no explanations, no code blocks, just pure code.',
      },
    ],
  });

  return response.choices[0].message.content;
}

const fewShotExamples = `Here is an example of a successful conversion. The original code that was passed in:
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: messages }],
  });
  const content = response.choices[0].message.content;
  return new Response(JSON.stringify({ content }));
}


A complete response:
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event, context) => {
  const { messages } = JSON.parse(event.body);
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: messages }],
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response.choices[0].message.content),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
`;
