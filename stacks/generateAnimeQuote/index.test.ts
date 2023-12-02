import generateAnimateQuote from ".";

test("Generate a random Anime quote", async () => {
  const response = await generateAnimateQuote();

  expect(response.message).toBeTruthy();
});
