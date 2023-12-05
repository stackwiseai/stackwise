import { Pinecone } from '@pinecone-database/pinecone';
import {
  BoilerplateMetadata,
  DocumentationMetadata,
} from '../integrations/lib/types';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

export default async function updateEmbedding(
  toUpdate: DocumentationMetadata | BoilerplateMetadata,
  newFunctionId: string
) {
  const index = pinecone.index('general');

  try {
    // Fetch the existing record
    const fetchResult = await index.fetch([toUpdate.id]);

    // Check if the record exists
    if (!fetchResult.records || !fetchResult.records[toUpdate.id]) {
      console.error('Record not found for documentId:', toUpdate.id);
      return;
    }

    // Retrieve the current count and increment it
    const currentMetadata = fetchResult.records[toUpdate.id].metadata;
    let currentCount =
      typeof currentMetadata.count === 'number' ? currentMetadata.count : 0;
    currentCount += 1;
    const new_metadata = {
      count: currentCount,
    };

    // Update the record with the new count
    await index.update({
      id: toUpdate.id,
      metadata: new_metadata
      // metadata: {
      //   ...currentMetadata,
        
      //   // retrievedAt: [...currentMetadata.retrievedAt, new Date().toISOString()],
      //   // retrievedFor: [...currentMetadata.retrievedFor, newFunctionId],
      // },
    });

    console.log('Count incremented successfully for documentId:', toUpdate.id);
  } catch (error) {
    console.error(
      'Error incrementing count for documentId:',
      toUpdate.id,
      error
    );
  }
}
