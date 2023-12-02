import OpenAI from 'openai';

/**
 * Brief: Define Social Trading Using OpenAI
 */
export default async function defineSocialTradingUsingOpenAI(input: string): Promise<string> {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: input }],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices[0].message.content;
}