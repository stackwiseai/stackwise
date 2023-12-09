import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

export async function queryReplicateBoilerplate(
  prompt: string,
  image: string
): Promise<object> {
  // this function is for a model that takes an image and a prompt and returns a prediction, potentially a description
  try {
    const version = 'example/example:example'; // CHANGE
    const prediction = await replicate.run(version, {
      input: {
        // THIS CAN CHANGE
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
