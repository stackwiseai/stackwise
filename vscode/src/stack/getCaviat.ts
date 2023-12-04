export function getCaviat(brief: string) {
  // brief contains openai or gpt-4 or gpt-3.5-turbo or gpt4 or gpt3.5turbo
  //convert brief to lowercase
  brief = brief.toLowerCase();
  if (brief.includes('openai') || brief.includes('gpt-4') || brief.includes('gpt4') || brief.includes('gpt-3.5-turbo') || brief.includes('gpt3.5turbo')) {
    return `Examples:
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });
}

main();
`;
  }
  return ``;
}
