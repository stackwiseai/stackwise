import OpenAI from 'openai';
import { Message } from '../../../utils/types';
import { listReplicateModels } from '../../documentation/getModels';
// import { indexModels } from '../../../utils/indexMarkdown';
import {} from './prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function decideModel(query: string) {
  try {
    // const replicateModels = await listReplicateModels();
    // await writeStringToFile(
    //   JSON.stringify(replicateModels, null, 2),
    //   'src/stack/replicate/shortenedModels.ts'
    // );
    // await indexModels();

    // TODO: NARROW DOWN MODEL CHOICES HERE

    const constructedArray: Message[] = [];

    const modelChoice = await openai.chat.completions.create({
      model: 'gpt-4',
      messages:
        constructedArray as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: 0,
    });

    return modelChoice; // VARIABLE
  } catch (error) {
    console.error('Error querying Replicate:', error);
    throw error;
  }
}
