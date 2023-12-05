import { readFunctionToString } from '../../lib/utils';
import { Message } from '../../lib/types';

export const boilerplateExpert: Message = {
  role: 'system',
  content:
    'You are an expert at modifying the below boilerplate code in order to match the users use case.',
};

const boilerplate = readFunctionToString('../boilerplate/queryOpenAI.ts');

export const furtherEngineering: Message = {
  role: 'system',
  content: `Below is the provided boilerplate:\n${boilerplate}\n. Remember to only modify the lines with a // VARIABLE comment on them, and use context clues to only make necessary modifications.`,
};

export const userAsk = (user_query: string): Message => {
  return {
    role: 'user',
    content: user_query,
  };
};
