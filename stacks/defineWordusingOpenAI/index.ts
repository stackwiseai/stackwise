import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Brief: Anwer my question using openai and give me consistent results
 */
export default async function defineWordUsingOpenAI(input: string): Promise<string> {
    const response = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'I am a helpful assistant.'}, { role: 'user', content: input }],
        model: 'gpt-3.5-turbo',
        temperature: 0
    });
    return response['choices'][0]['message']['content'];
}
