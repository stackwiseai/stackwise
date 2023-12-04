import retrieveAlluser from '.';

test('Retrieve all user of the project using Admin Auth', async () => {
  const response = await retrieveAlluser({
    paginate: {
      page: 1,
      perPage: 1000
    }
  })
  expect(response.length).toBeGreaterThan(1)
});