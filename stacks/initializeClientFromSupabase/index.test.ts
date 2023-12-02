
import initializeClientUsingSupabase from '.';

test('Initialize a client using supabase', async () => {

  const response = await initializeClientUsingSupabase();
  expect(response.auth).toBeDefined();
});