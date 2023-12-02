import defineCopyTradingUsingOpenAI from './defineCopyTradingUsingOpenAI';
test("callOpenAi correctly", async () => {
  const question = "What Is Copy Trading?";
  const response = await defineCopyTradingUsingOpenAI(question);
  console.log(response);
}); 
