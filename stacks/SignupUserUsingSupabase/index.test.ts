import fetchDataFromTableUsingSupabase from '.';

test('Allow users to sign up and create a new account on a project in supabase client', async () => {
  const response = await fetchDataFromTableUsingSupabase({email:"any@test.com", password:"hello123"});
  expect(response.user.created_at).not.toBeNull();
});