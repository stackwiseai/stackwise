import OpenAI from "openai";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Brief: Answer my question using OpenAI Streaming responses
 */
export default async function useOpenAIstreamEndpoint(
  input: string
): Promise<AsyncIterable<any>> {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
    stream: true,
  });
  return (async function* () {
    for await (const chunk of stream) {
      yield chunk.choices[0]?.delta?.content || "";
    }
  })();
}
