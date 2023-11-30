import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Brief: Call gpt-4 using the streaming endpoint to answer my question and TTS the voice in real time
 */
export default async function streamingGpt4QuestionAnswerTTS(input: string): Promise<string> {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: input }],
        model: 'gpt-3.5-turbo',
    });

    return chatCompletion.choices[0].message.content;
}