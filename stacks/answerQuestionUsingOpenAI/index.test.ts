import answerQuestionUsingOpenAI from '../../stacks/answerQuestionUsingOpenAI';


test('flattenInputJson correctly', async () => {
    const question = 'what is the meaning of life?';
    const response = await answerQuestionUsingOpenAI(question);
    console.log(response);
  });
  

  
  