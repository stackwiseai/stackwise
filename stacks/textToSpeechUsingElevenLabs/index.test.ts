import convertTTS from ".";

test("Convert text to speech", async () => {
  const text = "Hello World!";
  const pathToAudio = "textToSpeechUsingElevenLabs/";

  const response = await convertTTS({ text, pathToAudio });

  expect(response.status).toEqual("ok");
});
