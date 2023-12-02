import answerQuestionUsingOpenAI from '.';

test('callOpenAI correctly', async () => {
  const question = 'what is the meaning of life?';
  const response = await answerQuestionUsingOpenAI(question);
  console.log(response);
});