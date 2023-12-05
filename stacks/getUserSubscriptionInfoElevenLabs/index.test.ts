import getUserSubscriptionInfo from '.';

test('Get user subscription info in elevenlabs', async () => {
  const response = await getUserSubscriptionInfo();
  expect(response.tier).toEqual('free');
});