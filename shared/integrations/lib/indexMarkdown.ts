import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';

import { getEmbedding } from '../../../../../shared/createEmbedding/getEmbedding';
import { models } from '../replicate/documentation/shortenedModels';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

export async function indexModels() {
  const index = pinecone.index('replicate-models');

  const records: PineconeRecord[] = [];

  for (const model of models) {
    if (model) {
      // Generate the embedding for the model description
      const stringifiedExampleInput = JSON.stringify(
        model.default_example,
        null,
        2
      );
      const stringToEmbed = `${model.description}
      
${stringifiedExampleInput}`;
      const embedding = await getEmbedding(stringToEmbed);

      // Create a Pinecone record
      const record: PineconeRecord = {
        id: model.url, // using the URL as a unique ID for each model
        values: embedding, // the embedding vector
        metadata: {
          model: model.name,
          version: model.version,
          run_count: model.run_count.toString(),
          description: model.description ? model.description : '',
          default_example: model.default_example ? stringifiedExampleInput : '',
          created_at: model.time_created,
          type: 'replicate-models',
        },
      };

      records.push(record);
    }
  }

  await index.upsert(records);
}
