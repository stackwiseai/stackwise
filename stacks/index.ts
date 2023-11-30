const question = 'what is the meaning of life?';
async function main() {
  // console.log(await answerQuestionUsingOpenAI("question"));
  const response = stack('answer my  question using OpenAI', {in: question, out: '42'});
  console.log(response);
}
main();
