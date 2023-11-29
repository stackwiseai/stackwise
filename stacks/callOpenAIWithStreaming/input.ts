import answerQuestionUsingOpenAIStreaming from '../../stacks/answerQuestionUsingOpenAIStreaming';
const question = 'what is the meaning of life?';

async function main() {
  // console.log(await answerQuestionUsingOpenAI("question"));
  const response = await answerQuestionUsingOpenAIStreaming(question);
  console.log(response);
}

main();

