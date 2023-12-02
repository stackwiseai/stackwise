import updateDataFromTheTable from '.';

test('Update data from the table using supabase client', async () => {
  const response = await updateDataFromTheTable();
  expect(response).not.toBeNull();
});