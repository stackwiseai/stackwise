import createRandomUser from '../../stacks/createRandomUser';

test('Create a random user using the radom.me api', async () => {

  const response = await createRandomUser();

  expect(response.dob.age).toBeTruthy();
});