const x = 1;
const y = 2;
const checking = await stack('multiply two numbers', {
    input: { x, y },
    outExample: { check: 0 },
  });

import multiplyNumbers from '../../stacks/multiplyNumbers';

const x = 1;
const y = 2;
const checking = await multiplyNumbers(
  x, y
  );


/**
 * Brief: multiply two numbers
 */
export default async function multiplyNumbers(a: number, b: number): Promise<number> {
    return a * b;
}