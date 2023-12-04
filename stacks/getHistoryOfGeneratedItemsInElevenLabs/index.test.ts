import getGeneratedAudio from '.';

test('Get all generated audio in elevenlabs', async () => {
  const response = await getGeneratedAudio();
  expect(response.history).toBeTruthy();
});