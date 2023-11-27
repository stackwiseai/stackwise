import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

export async function queryReplicateBoilerplate(
  prompt: string,
  image: string
): Promise<object> {
  try {
    const version = '{{name}}/{{model}}:{{version}}'; // VARIABLE
    const prediction = await replicate.run(version, {
      input: {
        // VARIABLE
        image: image,
        prompt: prompt,
        max_new_tokens: 512,
      },
    });
    return prediction;
  } catch (error) {
    console.error('Error querying Replicate:', error);
    throw error;
  }
}
