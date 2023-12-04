import textToImageGuidedLatentDiffusion from ".";
import textToImagePrompt from ".";

const input = {
  model: "finetuned",
  width: 640,
  height: 768,
  clip_scale: 16000,
  init_scale: 1000,
  clip_prompts: "The visual style of the image is akin to a retro 8-bit look, with clean lines and flat colors. There is a cartoonish quality to some of the characters and objects, as if they are depictions of vaporwave tropes or influences.",
  latent_scale: 12,
  output_steps: 10,
  latent_prompt: "vaporwave princess",
  custom_settings: "\n",
  init_brightness: 0,
  latent_negative: "",
  starting_timestep: 0.9,
  aesthetic_loss_scale: 400,
};
test("Generate images from text using CLIP guided latent diffusion", async () => {
  const prompt = "Mountain Sunrise";

  const response = await textToImageGuidedLatentDiffusion(
    "nightmareai/majesty-diffusion:76f01b269da5b6f12d201700e3e7d253b7decefe4d9d8ae9417df5977f63fb8d",
    input
  );
  console.log(response);
});
