'use server';

import { stack } from 'stackwise';

export const callStack = async (prevState: any, formData: FormData) => {
  const userRequest = formData.get('stack') as string;
  const message = await stack(userRequest);
  return message;
};

export const parseFormData = async (prevState: any, formData: FormData) => {
  const str = formData.get('str');

  return await countChars(str);
};

/**
 * Brief: count the number of chars in a string
 */
async function countChars(str: string): Promise<number> {
    return str.length;
}