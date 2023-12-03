import signupAndCreateAccountOnProject from '.';

test('Sign Up and Create a New Account on a Project in Supabase Client', async () => {
  const response = await signupAndCreateAccountOnProject({email:"any@test.com", password:"hello123"});
  expect(response.user.created_at).not.toBeNull();
});