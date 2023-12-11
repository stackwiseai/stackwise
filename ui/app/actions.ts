'use server';
import fs from 'fs';
import path from 'path';

// import { stack } from 'stackwise';

export const callStack = async (prevState: any, formData: FormData) => {
  const userRequest = formData.get('stack') as string;
  // const message = await stack(userRequest);
  const message = 'remove';

  return message;
};

export const getCodePaths = async (frontendPath, backendPath) => {
  const frontendCode = fs.readFileSync(
    path.join(process.cwd(), frontendPath),
    'utf8'
  );
  const backendCode = fs.readFileSync(
    path.join(process.cwd(), backendPath),
    'utf8'
  );

  return { frontendCode, backendCode };
};

export const parseFormData = async (prevState: any, formData: FormData) => {
  const num1 = Number(formData.get('num1'));
  const num2 = Number(formData.get('num2'));

  return await multiplyNumbers(num1, num2);
};

/**
 * Brief: Multiply two numbers together
 */
async function multiplyNumbers(num1: number, num2: number): Promise<number> {
  return num1 * num2;
}
