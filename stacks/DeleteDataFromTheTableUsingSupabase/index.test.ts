import deleteDataFromTheTable from '.';

test('Delete data from the table using supabase client', async () => {
  const response = await deleteDataFromTheTable({table_name:'your_table', filter_name:'your_id',filter_value:1});
  expect(response).not.toBeNull();
});