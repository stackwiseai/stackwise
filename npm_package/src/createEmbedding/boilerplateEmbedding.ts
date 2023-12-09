import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { getEmbedding } from './getEmbedding';
import { BoilerplateMetadata } from '../integrations/utils/types';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

export default async function createBoilerplateEmbedding(
  brief: string,
  inputJSON: { [key: string]: any },
  outputJSON: { [key: string]: any },
  integration: string,
  functionId: string,
  functionString: string,
  methodName: string,
  skeleton: string,
  boilerplate: string
) {
  const index = pinecone.index('general');

  try {
    const embedding = await getEmbedding(skeleton);

    // Create a Pinecone record
    const metadata: BoilerplateMetadata = {
      inputJSON: JSON.stringify(inputJSON),
      outputJSON: JSON.stringify(outputJSON),
      brief,
      count: 1,
      type: boilerplate,
      integration,
      skeleton,
      skeletonType: 'inline-typed',
      functionString,
      methodName,
      id: functionId,
      createdAt: new Date().toISOString(),
      // retrievedAt: [],
      // retrievedFor: [],
    };

    const record: PineconeRecord[] = [
      {
        id: functionId, // using the URL as a unique ID for each model
        values: embedding, // the embedding vector
        metadata: metadata,
      },
    ];

    await index.upsert(record);

    // return response.choices[0].message.content;
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    throw error;
  }
}
