import getWhoisRecord from '.';

test('Get Whois record of domain using cloudflare api', async () => {
  const response = await getWhoisRecord({account_id:'583434c2154cb0278444ded751a3fc2b',domain:'google.com'})
  expect(response.success).toBe(true);
});