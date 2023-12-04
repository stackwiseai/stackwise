import getAllVoicesAvailable from '.';

test('get specific voice metadata using voice id in elevenlabs', async () => {
  const response = await getAllVoicesAvailable({id:'zrHiDhphv9ZnVXBqCLjz'});
  expect(response.name).toBe('Mimi')
});