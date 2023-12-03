import createABucketOnSupabase from '.';


test('Create a bucket using supabase', async () => {
  const response = await createABucketOnSupabase({
    bucket_name: 'bucket_name', options: {
      public: false,
      allowedMimeTypes: ['image/jpg'],
      fileSizeLimit: 1024
    }
  })
  expect(response).not.toBeNull();
});