import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import OpenAI from "openai";
const openai = new OpenAI();
export const config = {
    runtime: "edge",
  };

export default async function handler(req, res) {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'tell me a story' }],
      stream: true,
    });

    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || '');
    }

    res.end();
  }

// export async function OpenAIStream(payload) {
//   const encoder = new TextEncoder();
//   const decoder = new TextDecoder();

//   let counter = 0;

//   const res = await fetch("https://api.openai.com/v1/completions", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
//     },
//     method: "POST",
//     body: JSON.stringify(payload),
//   });

//   const stream = new ReadableStream({
//     async start(controller) {
//       function onParse(event: ParsedEvent | ReconnectInterval) {
//         if (event.type === "event") {
//           const data = event.data;
//           if (data === "[DONE]") {
//             controller.close();
//             return;
//           }
//           try {
//             const json = JSON.parse(data);
//             const text = json.choices[0].text;
//             if (counter < 2 && (text.match(/\n/) || []).length) {
//               return;
//             }
//             const queue = encoder.encode(text);
//             controller.enqueue(queue);
//             counter++;
//           } catch (e) {
//             controller.error(e);
//           }
//         }
//       }

//       const parser = createParser(onParse);

//       for await (const chunk of res.body as any) {
//         parser.feed(decoder.decode(chunk));
//       }
//     },
//   });

//   return stream;
// }
// export const config = {
//   runtime: "edge",
// };

// const handler = async (req: Request): Promise<Response> => {
//   const { prompt } = (await req.json()) as {
//     prompt?: string;
//   };

//   const payload = {
//     model: "text-davinci-003",
//     prompt,
//     temperature: 0.7,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     max_tokens: 200,
//     stream: true,
//     n: 1,
//   };

//   const stream = await OpenAIStream(payload);
//   return new Response(stream);
// };

// export default handler;