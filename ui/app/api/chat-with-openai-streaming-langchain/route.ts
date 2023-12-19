import { ChatOpenAI } from 'langchain/chat_models/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 1.0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const message = await model.invoke(messages);
    const fullmsg = message.content; // Assuming message.content is a string
    const responseJson = JSON.stringify({ fullmsg });

    return new Response(responseJson, {
        headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
    console.error('Error during chat request handling:', error);
    
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
  }
}