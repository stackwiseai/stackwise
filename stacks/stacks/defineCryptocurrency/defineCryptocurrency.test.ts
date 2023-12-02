import defineCryptocurrency from './defineCryptocurrency';
test("callOpenAi correctly", async () => {
  const question = "What is cryptocurrency?";
  const response = await defineCryptocurrency(question);
  console.log(response);
});
