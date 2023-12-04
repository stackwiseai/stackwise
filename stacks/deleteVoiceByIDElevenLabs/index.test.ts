import deleteVoiceFromVoiceLab from '.';

test('Delete voice from voice library in elevenlabs', async () => {
  const response = await deleteVoiceFromVoiceLab({id:'6KC787jmbt8cNR3hbfCJ'});
  expect(response.status).toBe('ok')
});