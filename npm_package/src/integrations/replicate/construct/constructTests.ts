import OpenAI from 'openai';
import { Message } from '../../utils/types';
import { boilerplateExpert, furtherEngineering, userAsk } from './prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_APY_KEY,
});

export async function constructTests(model, query, props) {
  // This is the base model that creates Replicate integrations from boilerplate

  const constructedArray: Message[] = [
    boilerplateExpert,
    furtherEngineering,
    userAsk(query),
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages:
        constructedArray as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: 0,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    throw error;
  }
}
