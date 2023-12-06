import { OpenAI } from "langchain/llms/openai";

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method === 'POST') {
    console.log("Received request:", req);
    // Extract the brief from the request body
    const { brief } = req.body;
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    // Parse the header to get the API key
    const apiKey = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    

    const llm = new OpenAI({openAIApiKey: apiKey});
    const llmResult = await llm.predict(brief);

    // Send a response back
    res.status(200).json({ message: 'Brief received successfully' });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
  