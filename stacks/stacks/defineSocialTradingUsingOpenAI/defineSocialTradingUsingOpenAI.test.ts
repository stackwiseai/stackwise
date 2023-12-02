import defineSocialTradingUsingOpenAI from './defineSocialTradingUsingOpenAI';
test("callOpenAi correctly", async () => {
  const question = "what is Social Trading?";
  const response = await defineSocialTradingUsingOpenAI(question);
  console.log(response); 
});

