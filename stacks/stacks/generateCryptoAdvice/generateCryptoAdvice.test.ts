import generateCryptoAdvice from './generateCryptoAdvice';


test("callOpenAi correctly", async () => {
  const question = "What do I need to know before buying cryptocurrency?";
  const response = await generateCryptoAdvice(question);
  console.log(response); 
});
