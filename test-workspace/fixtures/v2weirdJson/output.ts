const x = 1;
const y = 2;
const checking = await stack('multiply two numbers', {
    in: { x, y },
    out: { check: 0 },
  });

import multiplyNumbers from '../../stacks/multiplyNumbers';

const x = 1;
const y = 2;
const checking = await await multiplyNumbers(x, y);


/**
 * Brief: multiply two numbers
 */
export default async function multiplyNumbers(x: number, y: number): Promise<any> {
    return x * y;
}