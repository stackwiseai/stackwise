import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Brief: Define Copy Trading Using OpenAI
 */
export default async function defineCopyTradingUsingOpenAI(input: string): Promise<string> {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: input }],
    model: 'gpt-4',
  });

  return chatCompletion.choices[0].message.content;
}