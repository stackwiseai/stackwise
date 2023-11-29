stack('multiply two numbers', {
  in: { x: 2, y: 5 },
  out: 0,
});




import multiplyNumbers from '../../stacks/multiplyNumbers';

await multiplyNumbers(2, 5);





/**
 * Brief: multiply two numbers
 */
export default async function multiplyNumbers(input: {a: number, b: number}): Promise<number> {
    return input.a * input.b;
}