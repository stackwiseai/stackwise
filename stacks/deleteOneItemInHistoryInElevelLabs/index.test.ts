import getItemByIdElevelLabs from '.';

test('Delete one item from history in elevenlabs', async () => {
  const response = await getItemByIdElevelLabs({id:'qs777EBPUP6ZjL9B3MPy'});
  expect(response.detail.status).toBeTruthy()
});