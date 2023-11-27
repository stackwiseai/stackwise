import { Pinecone, RecordMetadata } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
  environment: process.env.PINECONE_ENVIRONMENT as string,
});

export default async function pineconeQueryBoilerplate(
  toEmbed: string
): Promise<RecordMetadata> {
  const index = pinecone.index('general');

  const requestBody = {
    input: toEmbed,
    model: 'text-embedding-ada-002',
  };

  // Call the OpenAI API to get the embedding
  const embedding = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  }).then((response) => response.json());

  // Get just the embedding vector
  const embeddingVector = embedding.data[0].embedding;

  // Query the index with the embedding to find the top 3 closest matches
  const queryResponse = await index.query({
    vector: embeddingVector,
    topK: 3,
  });

  // Extract matches from the query response
  const matches = queryResponse.matches;

  // Return metadata for the closest match
  return matches[0].metadata;
}
