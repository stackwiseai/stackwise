'use server';

import { stack } from 'stackwise';

export const callStack = async (prevState: any, formData: FormData) => {
  const userRequest = formData.get('stack') as string;
  const message = await stack(userRequest);
  return message;
};

export const parseFormData = async (prevState: any, formData: FormData) => {
  const num1 = formData.get('num1') as string;
  const num2 = formData.get('num2') as string;

  return multiplyNumbers(Number(num1), Number(num2));
};

// this needs to be llm
const multiplyNumbers = (num1: number, num2: number): number => {
  return num1 * num2;
};


/**
 * Brief: multiply two numbers
 */
export default async function placeholderName(num1: number, num2: number): Promise<number> {
    return num1 * num2;
}