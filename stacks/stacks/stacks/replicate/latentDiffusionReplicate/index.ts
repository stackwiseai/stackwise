import Replicate from "replicate";

require("dotenv").config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

type options = {
  model: string;
  width: number;
  height: number;
  clip_scale: number;
  init_scale: number;
  clip_prompts: string;
  latent_scale: number;
  output_steps: number;
  latent_prompt: string;
  custom_settings: string;
  init_brightness: number;
  latent_negative: string;
  starting_timestep: number;
  aesthetic_loss_scale: number;
};
/**
 * Brief: Generate images from text using CLIP guided latent diffusion
 */

export default async function textToImageGuidedLatentDiffusion(
  type: string,
  input: options
): Promise<any> {
  try {
    const data = await replicate.run(type, {
      input: input,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
