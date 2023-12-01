import defineWordUsingOpenAI from './defineWordUsingOpenAI';
test("callOpenAi correctly", async () => {
  const question = "what is a flowchart in computer programming?";
  const response = await defineWordUsingOpenAI(question);
  console.log(response);
});
