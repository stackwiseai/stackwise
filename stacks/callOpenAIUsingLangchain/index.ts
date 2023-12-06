require("dotenv").config();
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.9,
});

/**
 * Brief: call OpenAI using langchain
 */
export default async function callOpenAIUsingLangchain(question: string): Promise<string> {
  return await llm.predict(question);
}