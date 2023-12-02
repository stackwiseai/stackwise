import updateDataFromTheTable from '.';

test('Update data from the table using supabase client', async () => {
  const response = await updateDataFromTheTable({table_name:'your_table', column_name:'your_data' , column_value: 'your_value', filter_name:'your_id', filter_value:'1'});
  expect(response).not.toBeNull();
});