import generateImageUsingReplicate from '.';

test('Generate an image usiung replicate', async () => {
  const response = await generateImageUsingReplicate({ model: "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf", input: { prompt: "A photo of programmer in a desk" } });
  expect(response).toBeTruthy();
});