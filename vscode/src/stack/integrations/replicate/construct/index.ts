import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { BoilerplateMetadata } from '../../lib/types';
import { processBoilerplate, readFunctionToString } from '../../lib/utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APY_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

export default async function constructReplicate(
  briefSkeleton: string,
  functionAndOutputSkeleton: string,
  brief: string,
  exampleBoilerplate: BoilerplateMetadata | null | BoilerplateMetadata[],
  embedding: number[]
): Promise<string> {
  let existingBoilerplateString: string;

  if (!exampleBoilerplate) {
    existingBoilerplateString = await readFunctionToString(
      `src/stack/integrations/replicate/boilerplate.ts`
    );
  } else {
    existingBoilerplateString = processBoilerplate(exampleBoilerplate);
  }

  // decide if model decision is needed here

  const index = pinecone.index('general');

  // Query the index with the embedding to find the closest match
  const queryResponse = await index.query({
    vector: embedding,
    filter: { type: 'replicate-documentation' },
    topK: 3,
    includeMetadata: true,
  });

  // Extract matches from the query response
  const matches = queryResponse.matches;

  const relevantDocumentation = matches
    .map((match) => match.metadata.content)
    .join('\n');

  console.log(
    'relevantDocumentation in constructReplicate:',
    relevantDocumentation
  );

  const messages = [];

  messages.push({
    role: 'system',
    content: `You are an expert at writing functions that match the brief that the user provides. You can change the body of the function to whatever you want as long as you ensure that you keep the return type, function name, and parameters the same as the skeleton. 
Feel free to make assumptions about what the user wants based on their input and output types and brief. If the user brief does not make sense or is not possible given the input and return types, just do your best and leave comments where the user would need to fill in the gaps. The user has precised that they want a function that does: ${brief}`,
  });

  messages.push({
    role: 'system',
    content: `Here is the skeleton of the code that you need to fill in. In order to complete this task, you need to fill in the function body. You can change the function name, parameters, and return type as long as you keep the function body the same:
${functionAndOutputSkeleton}`,
  });

  messages.push({
    role: 'system',
    content: `Below is the provided an example of what your code may look like:\n${existingBoilerplateString}\n
Use context clues to only make necessary modifications.`,
  });

  messages.push({
    role: 'system',
    content: `Finally, here is some relevant documentation information about how to use replicate: 
To use the sdk: 

Create the client:
'''js
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});
'''

Extra docs information to help you build your function: 
${relevantDocumentation}.`,
  });

  console.log(
    'Messages in constructReplicate:',
    messages.map((message) => message.content).join('')
  );

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    throw error;
  }
}
