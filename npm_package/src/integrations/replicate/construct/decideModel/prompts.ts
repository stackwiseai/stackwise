import { Message } from '../../../utils/types';

export const decisionExpert: Message = {
  role: 'system',
  content:
    'You are an expert at deciding which Replicate model needs to be used for a particular purpose. You are currently choosing out of a catalog of machine learning models that are available to you, and must make the correct decision for which one to use given the user request and the inputs that the user gives you.',
};

export const fewShotExamples: Message = {
  role: 'system',
  content: `Below are some examples:
    
User: I need to get the description of an image.
User input types: image
Models list: 
Correct model:`,
};
