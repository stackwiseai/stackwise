import answerQuestionUsingOpenAIAndGPT4 from './answerQuestionUsingOpenAIAndGPT4';
test('callOpenAI correctly', async () => {
  const question = 'what is the meaning of life?';
  const response = await answerQuestionUsingOpenAIAndGPT4(question);
  console.log(response);
});