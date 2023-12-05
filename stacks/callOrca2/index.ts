import Replicate from "replicate"
require("dotenv").config();
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

/**
 * Brief: call Orca2 and return its response\, using @replicate
 */
export default async function callOrca2(question: string): Promise<string> {
  try {
    const response = await replicate.run(
      "mattt/orca-2-13b:dac511fd566228a0dd189e95318523fccb6ba175f9f0ecd29214b579b00b64c7",
      {
        input: {
          top_k: 50,
          top_p: 1,
          prompt: question,
          temperature: 1,
          max_new_tokens: 256
        }
      }
    );

    // Assuming the actual array of strings is under the 'result' property of the response
    if (response && Array.isArray(response)) {
      return response.join('')
    } else {
      throw new Error('Unexpected response structure');
    }
  } catch (error) {
    console.error('Error querying Replicate:', error);
    throw error
  }
}