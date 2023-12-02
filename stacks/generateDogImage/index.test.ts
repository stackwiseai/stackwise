import generateRandomDogImages from ".";

test("Generate a random dog image", async () => {
  const response = await generateRandomDogImages();

  expect(response.message).toBeTruthy();
});
