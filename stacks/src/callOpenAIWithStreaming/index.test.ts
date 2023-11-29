const question = 'what is the meaning of life?';

async function main() {
  const response = await answerQuestionUsingOpenAI(question);
  console.log(response);
}

main();