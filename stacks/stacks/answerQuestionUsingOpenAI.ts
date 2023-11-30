import OpenAI from 'openai';
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Brief: answer my  question using OpenAI
 */
export default async function answerQuestionUsingOpenAI(input: string): Promise<string> {
  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: input }],
    model: 'gpt-3.5-turbo',
  });
  
  return response.choices[0].message.content;
}