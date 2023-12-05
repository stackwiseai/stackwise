import OpenAI from 'openai';
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3, // default is 2

});

/**
 * Brief: answer my  question using OpenAI and if it fails retry twice (3 times in total)
 */
export default async function answerQuestionWithRetry(input: string): Promise<string> {
  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: input }],
    model: 'gpt-3.5-turbo',
  });
  
  return response.choices[0].message.content;
}