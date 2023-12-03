import deleteUser from '.';

test('Delete user from the supabase project using supabase Admin AUTH', async () => {

  const response = await deleteUser({ id: '18e0e0d9-74c8-4aae-b173-f47e9f6e0112' });
  console.log(response)
  expect(response.user).not.toBeNull();
});