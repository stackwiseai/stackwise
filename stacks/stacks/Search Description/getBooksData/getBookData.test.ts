import getBookData from '../../../stacks/getBookData';


test("callOpenAi correctly", async () => {
  const question = "Don Quixote";

  const response = await getBookData(question);

  expect(response).toEqual({
    properties: {
      release_date: "1605",
      author: "Miguel de Cervantes",
    },
  });
  console.log(response);
});
