import getVoiceHistory from ".";

test("Gets metadata about all your generated audio.", async () => {
  const method = "GET";
  const response = await getVoiceHistory(method);

  expect(response).not.toBeNull();
  console.log(response);
});
