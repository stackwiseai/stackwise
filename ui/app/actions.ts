'use server';

import { stack } from 'stackwise';

export const callStack = async (prevState: any, formData: FormData) => {
  const userRequest = formData.get('stack') as string;
  const message = await stack(userRequest);
  return message;
};
