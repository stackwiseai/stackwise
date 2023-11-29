import { Pinecone } from '@pinecone-database/pinecone';
import { BoilerplateMetadata } from '../../lib/types';
import { boilerplateExpert, furtherEngineering, userAsk } from './prompts';
import { openai } from '../../openai/construct';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

export async function constructReplicate(
  briefSkeleton: string,
  functionAndOutputSkeleton: string,
  brief: string,
  exampleBoilerplate: BoilerplateMetadata | null | BoilerplateMetadata[],
  startingBoilerplate: string
): Promise<string> {
  const index = pinecone.index('general');

  // get vector similar boilerplate
  // const stringParams = JSON.stringify(params);

  // const constructedArray: Message[] = [
  //   boilerplateExpert,
  //   furtherEngineering,
  //   userAsk(query),
  // ];

  // try {
  //   const response = await openai.chat.completions.create({
  //     model: 'gpt-4',
  //     messages: constructedArray,
  //     temperature: 0,
  //   });

  //   return response.data.choices[0].text;
  // } catch (error) {
  //   console.error('Error querying OpenAI:', error);
  //   throw error;
  // }

  // const generatedCode = await writeStringToFile(
  //   constructedReplicate,
  //   'execute.ts'
  // );

  // const constructedTests = await constructTests(model, query, stringParams);
  // const generatedTests = await writeStringToFile(
  //   constructedTests,
  //   'execute.tests.ts'
  // );

  // then run the tests

  // if any failed try to fix the code to match 3 times

  return startingBoilerplate;
}
