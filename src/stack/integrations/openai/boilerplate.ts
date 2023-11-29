import { openai } from './construct';

export async function openAIQueryBoilerplate(prompt: string): Promise<string> {
  // this function generates some text given a prompt and return the exact text
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // VARIABLE, 'gpt-4' is a stronger model
      messages: [{ role: 'user', content: prompt }], // VARIABLE, always an array of objects with role and content. But content is always a string, and role can be 'user', 'assistant', or 'system'
      temperature: 0.3, // VARIABLE, higher means more random and varied and creative, lower means more predictable and common
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    throw error;
  }
}
