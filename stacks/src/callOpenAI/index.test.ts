import answerQuestionUsingOpenAI from '.';
import astParser from '.';
import * as fs from 'fs';


test('flattenInputJson correctly', async () => {
  const question = 'what is the meaning of life?';
  const response = await answerQuestionUsingOpenAI(question);
  console.log(response);
});