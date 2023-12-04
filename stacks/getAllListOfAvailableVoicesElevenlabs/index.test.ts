import getAllVoicesAvailable from '.';

test('Get all list of available voices for a user in elevenlabs', async () => {
  const response = await getAllVoicesAvailable();
  expect(response.voices).toBeTruthy();
});