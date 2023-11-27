import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface InputType {
  wholeSkeleton: string;
  brief: string;
}

export default async function getMethodName({
  wholeSkeleton,
  brief,
}: InputType): Promise<string> {
  if (brief === 'test') {
    return null;
  } else {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Find a good name for this function given the brief that generated it.
Brief: ${brief}
Function: ${wholeSkeleton}
Now, come up with a name for the function to replace the 'placeholderStackwiseFunction'. It should be a unique, descriptive name including verb that describes what the function does. Do not include the word 'function' or 'Stackwise' in the name unless it is in the brief.
Respond with nothing but the name of the function. Literally the only thing in your response should be the name of the function.`,
            // TODO: pass previous names and ask not the same unless it absolutely has to be
          },
        ],
        temperature: 0.3,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error querying OpenAI:', error);
      throw error;
    }
  }
}
