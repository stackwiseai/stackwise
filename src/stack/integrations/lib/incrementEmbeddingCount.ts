import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

export async function incrementEmbeddingCount(functionId: string) {
  const index = pinecone.index('general');

  try {
    // Fetch the existing record
    const fetchResult = await index.fetch([functionId]);

    // Check if the record exists
    if (!fetchResult.records || !fetchResult.records[functionId]) {
      console.error('Record not found for functionId:', functionId);
      return;
    }

    // Retrieve the current count and increment it
    const currentMetadata = fetchResult.records[functionId].metadata;
    let currentCount =
      typeof currentMetadata.count === 'number' ? currentMetadata.count : 0;
    currentCount += 1;

    // Update the record with the new count
    await index.update({
      id: functionId,
      metadata: {
        ...currentMetadata,
        count: currentCount,
      },
    });

    console.log('Count incremented successfully for functionId:', functionId);
  } catch (error) {
    console.error(
      'Error incrementing count for functionId:',
      functionId,
      error
    );
  }
}
