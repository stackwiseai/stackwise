import deleteDataFromTheTable from '.';

test('Delete data from the table using supabase client', async () => {
  const response = await deleteDataFromTheTable();
  expect(response).not.toBeNull();
});