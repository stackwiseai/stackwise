import OpenAI from 'openai';
import { BoilerplateMetadata, Message } from '../lib/types';
import { processBoilerplate } from '../lib/utils';
import { openai } from '../openai/construct';

export default async function generateFunction(
  briefSkeleton: string,
  functionAndOutputSkeleton: string,
  brief: string,
  exampleBoilerplate: null | BoilerplateMetadata | BoilerplateMetadata[],
  integration: string,
  embedding?: number[]
): Promise<string> {
  if (integration === 'generic') {
    // it's either null, meaning no example boilerplate was found or a string
    const messages: Message[] = [];
    messages.push({
      role: 'system',
      content: `You are an expert at writing functions that match the brief that the user provides. You can change the body of the function to whatever you want as long as you ensure that you keep the return type, function name, and parameters the same as the skeleton. 
Feel free to make assumptions about what the user wants based on their input and output types and brief. If the user brief does not make sense or is not possible given the input and return types, just do your best and leave comments where the user would need to fill in the gaps.`,
    });

    // if example boilerplate not found, that means we just have a generic skeleton to build up on
    if (exampleBoilerplate) {
      const startingBoilerplate = processBoilerplate(exampleBoilerplate);
      messages.push({
        role: 'system',
        content: `Here is an example function that you can learn from:
${startingBoilerplate}`,
      });
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Here is the boilerplate that you are working with: 
${functionAndOutputSkeleton}

Ensure that you keep the return type, function name, and parameters the same. You can change the body of the function to whatever you want.`,
          },
          {
            role: 'user',
            content: `Here is the user brief: ${brief}. 
Respond with just what would go in the function file and nothing else. No explanation or words, just the contents of the file. Make sure that the code is runnable if I were to execute it directly.`,
          },
        ],
        temperature: 0.3,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error querying OpenAI:', error);
      throw error;
    }
  } else {
    // if non generic it means we have an integration
    try {
      return functionAndOutputSkeleton;
      // Dynamically import the module based on the integration variable
      const integrationModule = await import(`../${integration}/construct`);
      // Assuming the imported module has a default function that you need to call
      const result = await integrationModule.default(
        briefSkeleton,
        functionAndOutputSkeleton,
        brief,
        exampleBoilerplate,
        embedding
      );

      return result;
    } catch (error) {
      console.error(
        `Error importing module for integration "${integration}":`,
        error
      );
      throw error;
    }
  }
}
