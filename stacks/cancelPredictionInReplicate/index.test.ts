
import cancelPrediction from '.';

test('Cancel a predicition in replicate', async () => {
  const id = 'qrrkkhdbgxdj7udh4ykhv3n7bi'
  const response = await cancelPrediction({ id });
  expect(response.status).toBe('succeeded');
});