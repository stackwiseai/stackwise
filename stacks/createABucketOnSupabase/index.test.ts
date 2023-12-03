import createABucketOnSupabase from '.';


test('Create a bucket using supabase', async () => {
  const response = await createABucketOnSupabase({
    bucket_name: 'your_bucket_name', options: {
      public: false,
      allowedMimeTypes: ['image/jpg'],
      fileSizeLimit: 1024
    }
  })
  console.log(response)
  expect(response).not.toBeNull();
});