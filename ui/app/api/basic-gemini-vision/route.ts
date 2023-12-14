export async function GET(req: Request) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');

  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  async function run() {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = 'return "hello world"';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  }

  const text = await run();
  return Response.json({ text });
}
