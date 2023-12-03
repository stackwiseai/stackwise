import retrieveUser from '.';

test('Retrieve a user object using Supabase AUTH Admin ', async () => {
  const response = await retrieveUser({id:"9330c516-c779-42cd-9bed-c1d45e38f947"});
  expect(response.user.email).toEqual("anytest@test.com")
});