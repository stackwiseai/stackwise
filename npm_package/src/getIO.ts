import { openai } from './constants';
import { SkeletonJson } from './types';

/**
 * Generates a json of input and output types
 * @param {string} query - The query string
 * @returns {Record<string, unknown>} JSON of input and output types
 */
export async function getIO(query: string): Promise<SkeletonJson> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    seed: 42,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Pretend you are now the skeleton of a function. What are the input and return types that the function that does the following will need? Respond with absolutely nothing but the input and return types in a json. Only include necessary input and output types. Some examples:
Query: Multiply two numbers
Function types: {input: { num1: 'number', num2: 'number' }, output: { result: 'number' }}

Query: Find the length of a string
Function types: {input: { str: 'string' }, output: { length: 'number' }}

Input: generate me an image using sdxl
Function types: { input: { description: 'string' }, output: { image: 'image' }}

Input: return a string into an array of chars
Function types: {input: { str: 'string' }, output: { chars: 'string[]' }}

Your turn, remembering to only respond with a json, and the necessary input and outputs of the function. 'null' if there is no input or output, and use | syntax for unions of types.
Query: ${query}
Function types:`,
      },
    ],
    temperature: 0.1,
  });

  const completion = response.choices[0].message.content;
  if (completion) {
    return JSON.parse(completion) as SkeletonJson;
  } else {
    throw new Error('No completion was returned');
  }
}
