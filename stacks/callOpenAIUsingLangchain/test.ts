import callOpenAIUsingLangchain from '../stacks/callOpenAIUsingLangchain';
async function main() {
  const response = await callOpenAIUsingLangchain("What would be a good company name for a company that makes colorful socks?")
  console.log(response)
};

main()