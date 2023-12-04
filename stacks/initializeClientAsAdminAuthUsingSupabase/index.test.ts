import initializeAdminAuth from '.';

test('Initialize supabase client as admin auth', async () => {
  const response = await initializeAdminAuth();
  expect(response).not.toBeNull();
});