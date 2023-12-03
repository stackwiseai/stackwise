import loginExistingUserWithEmailPassword from '.';

test('Login existing user using email and password on supabase', async () => {
  const response = await loginExistingUserWithEmailPassword({email:"anytest@test.com", password:"123456"});
  expect(response.session.access_token).not.toBeNull();
});