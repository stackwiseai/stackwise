import getListOfVoicesElevenLabs from ".";

test("Gets a list of all available voices.", async () => {
  const method = "Get";
  const response = await getListOfVoicesElevenLabs(method);

  expect(response).not.toBeNull();
  console.log(response);
});
