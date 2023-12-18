import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema"
import { SerpAPI } from "langchain/tools";

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 1.0, 
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function handleChatRequest(req: Request) {
  const { messages } = await req.json();

  const response = await model.predictMessages([
    new HumanMessage(messages),
  ], { tools: [new SerpAPI()] });

  

  return {
    text: response,
    additional_kwargs: response.additional_kwargs,
  };
}
