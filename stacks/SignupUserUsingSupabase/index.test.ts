import fetchDataFromTableUsingSupabase from '.';

test('Allow users to sign up and create a new account on a project in supabase client', async () => {
  const response = await fetchDataFromTableUsingSupabase();
  expect(response.user.created_at).not.toBeNull();
});