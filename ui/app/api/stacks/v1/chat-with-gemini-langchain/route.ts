import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export async function POST(req: Request) {
  const llm = new ChatGoogleGenerativeAI();
  const { messages } = await req.json();

  try {
    const textResponse = await llm.invoke([['human', messages]]);
    const output = textResponse.content; // assuming the text you want is in `content`

    const responseJson = JSON.stringify({ output });

    return new Response(responseJson, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
