import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Brief: Define the word using OpenAI
 */
export default async function defineWordUsingOpenAI(input: string): Promise<string> {
    const response = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'I am a helpful assistant.'}, { role: 'user', content: `What is the definition of ${input}?` }],
        model: 'gpt-3.5-turbo',
    });
    return response['choices'][0]['message']['content'];
}
