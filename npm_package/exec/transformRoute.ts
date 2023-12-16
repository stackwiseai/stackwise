export default function transformRoute(originalContent: string) {
  return `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler = async (event, context) => {
  const { messages } = JSON.parse(event.body);
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: messages }],
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response.choices[0].message.content),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
`;
}
