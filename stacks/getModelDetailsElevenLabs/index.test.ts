import getModelDetails from ".";

test("Get Model Details using ElevenLabs API", async () => {
  const modelId = "eleven_monolingual_v1";

  const modelDetailsResponse = getModelDetails(modelId);

  expect(modelDetailsResponse).toBeTruthy();
});
