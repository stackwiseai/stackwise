
import createNewPrediction from '.';

test('Create a new predicition in replicate', async () => {
  const data = {
    "version": "5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa",
    "input": {
      "text": "Alice"
    }
  }
  const response = await createNewPrediction({ data });
  expect(response.statusText).toBe('Created');
});