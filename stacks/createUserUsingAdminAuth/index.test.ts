import createUser from '.';

test('Create a new user for the project using supabase Admin AUTH', async () => {
  const data = {
    email: 'user@dummy1.com',
    password: 'password',
    user_metadata: { name: 'Yoda' }
  }
  const response = await createUser({userData:data});
  expect(response.user).not.toBeNull();
});