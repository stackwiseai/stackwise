
import getAllPrediction from '.';

test('get all list of predictions made in replicate', async () => {
  const response = await getAllPrediction();
  expect(response.results).toBeTruthy();
});