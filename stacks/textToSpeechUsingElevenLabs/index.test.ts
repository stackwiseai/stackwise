import LetYourCuriosityGuideYou from ".";

test("Convert this text to speech: Let your curiosity guide you", async () => {
  const response = await LetYourCuriosityGuideYou();
  console.log(response)

  expect(response.status).toEqual('ok');
});
