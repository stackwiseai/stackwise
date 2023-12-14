import { StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const { messages } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  try {
    const result = await model.generateContent(messages);
    const response = await result.response;
    const text = await response.text();
    return new StreamingTextResponse(text);
  } catch (error) {
    // Handle the error here
    console.error('Error occurred:', error);
    return new StreamingTextResponse(error);
  }
}
