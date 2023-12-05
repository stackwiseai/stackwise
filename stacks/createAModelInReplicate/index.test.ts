
import createNewPrediction from '.';

test('Create a model in replicate', async () => {
  const data = {
    owner: "pagebook1",
    name: "my-model2",
    description: "An example model",
    visibility: "public",
    hardware: "cpu"
  };
  const response = await createNewPrediction({ data });
  expect(response.name).toBe(data.name);
});