import retrieveBucket from '.';


test('Retrieve the details of an Storage bucket in supabase', async () => {
  const response = await retrieveBucket({
    bucket_name: 'your_bucket_name'
  })
  expect(response.id).toBe('your_bucket_name');
});