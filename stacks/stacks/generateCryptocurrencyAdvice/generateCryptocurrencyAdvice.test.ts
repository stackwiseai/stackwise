import generateCryptocurrencyAdvice from './generateCryptocurrencyAdvice';
test("callOpenAi correctly", async () => {
  const question = "Is cryptocurrency a good investment?";
  const response = await generateCryptocurrencyAdvice(question);
  console.log(response);
});
