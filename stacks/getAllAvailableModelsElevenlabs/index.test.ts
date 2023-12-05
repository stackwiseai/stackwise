import getAllAvailableVoices from '.';

test('Get all available models in elevenlabs', async () => {
  const response = await getAllAvailableVoices();
  expect(response).toBeTruthy()
});