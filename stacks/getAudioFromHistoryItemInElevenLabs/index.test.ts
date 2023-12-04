import getAudioInHistory from '.';

test('Get Audio From History Item in elevenlabs', async () => {
  const response = await getAudioInHistory({id:'Rpfy5HkN1PXqrY9cJQGG'});
  expect(response).toEqual(expect.any(ReadableStream))
  response.cancel();
});