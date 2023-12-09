const fetch = require('node-fetch');

export async function getEmbedding(toEmbed: string): Promise<number[]> {
  try {
    const requestBody = {
      input: toEmbed,
      model: 'text-embedding-ada-002',
    };

    const embedding = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    }).then((response) => response.json());

    return embedding.data[0].embedding;
  } catch (error) {
    console.error('Error embedding:', error);
    throw error;
  }
}
