import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Brief: answer my  question using OpenAI and gpt-4
 */
export default async function answerQuestionUsingOpenAIAndGPT4(input: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: input
      }
    ]
  });

  const answer = response.choices[0].message.content;
  return answer;
}