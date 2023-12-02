import insertDataFromTheTable from '.';

test('Insert data from the table using supabase client', async () => {
  const response = await insertDataFromTheTable({table_name:'your_table', column_name:'your_data',column_value:'new value'});
  expect(response).not.toBeNull();
});