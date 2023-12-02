import insertDataFromTheTable from '.';

test('Insert data from the table using supabase client', async () => {
  const response = await insertDataFromTheTable();
  expect(response).not.toBeNull();
});