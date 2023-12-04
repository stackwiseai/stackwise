import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Brief: Generate image from text prompt
 */

export default async function textToImagePrompt(prompt: string): Promise<any> {
  try {
    const data = await replicate.run(
      "pixray/text2image:5c347a4bfa1d4523a58ae614c2194e15f2ae682b57e3797a5bb468920aa70ebf",
      {
        input: {
          drawer: "vqgan",
          prompts: prompt,
          settings: "\n",
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
