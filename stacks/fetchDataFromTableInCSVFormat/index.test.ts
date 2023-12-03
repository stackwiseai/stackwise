import fetchDataFromTableInCSVUsingSupabase from '.';


test('Fetch data from table in SUPABASE in CSV Format', async () => {
  const response = await fetchDataFromTableInCSVUsingSupabase({table_name:'your_table'});
  expect(response).not.toBeNull();
});