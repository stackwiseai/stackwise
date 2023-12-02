import fetchDataFromTableUsingSupabase from '.';


test('Fetch data from table using supabase client', async () => {
  const response = await fetchDataFromTableUsingSupabase({table_name:'your_table', filter:'*'});
  expect(response).not.toBeNull();
});