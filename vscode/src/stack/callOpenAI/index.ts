import { openai } from '../../../../npm_package/src/constants';

interface OutputType {
  methodName: string;
}
interface InputType {
  prompt: string;
}
/**
 * "Call OpenAI to get the function name of the stackwise, given its skeleton"
 */
export async function callOpenAI({ prompt }: InputType): Promise<OutputType> {
  try {
    // Create a chat completion request
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    // console.log('Response from OpenAI:', {
    //   "methodName": chatCompletion.choices[0].message.content
    // });

    return {
      methodName: chatCompletion.choices[0].message.content,
    };
  } catch (error) {
    console.error('Error during OpenAI API request:', error);
  }
}
