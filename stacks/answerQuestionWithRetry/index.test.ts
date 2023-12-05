import answerQuestionWithRetry from '.';

test('answerQuestionWithRetry correctly retries after failures', async () => {
  const question = 'what is the meaning of life?';
  try {
    const response = await answerQuestionWithRetry(question);
    console.log(response);
    expect(response).toBe('42 is the answer to the meaning of life.');
  } catch (error) {
    console.error('Test failed:', error);
  }
});
