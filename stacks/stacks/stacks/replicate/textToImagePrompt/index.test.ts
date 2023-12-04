import textToImagePrompt from ".";

test("Generate image from text prompt", async () => {
  const prompt = "Mountain Sunrise";
  const response = await textToImagePrompt(prompt);
  console.log(response);
});
