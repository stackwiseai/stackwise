import fetchDataFromTableUsingSupabase from '.';


test('Fetch all data from the table using supabase client', async () => {
  const response = await fetchDataFromTableUsingSupabase();
  expect(response).not.toBeNull();
});