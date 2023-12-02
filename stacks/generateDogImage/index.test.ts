import generateRandomDogImages from ".";

test('Create a random dog image', async () => {

  const response = await generateRandomDogImages();
  
  expect(response.message).toBeTruthy();
});