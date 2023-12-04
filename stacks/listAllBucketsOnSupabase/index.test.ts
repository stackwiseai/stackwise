import listAllBuckets from '.';


test('List all Storage buckets in supabase', async () => {
  const response = await listAllBuckets()
  expect(response[0].id).toBe('your_bucket_name');
});