stack('multiply two numbers', {
  in: { x: 2, y: 5 },
  out: 0,
});




import multiplyNumbers from '../../stacks/multiplyNumbers';

await multiplyNumbers(2, 5);





/**
 * Brief: multiply two numbers
 */
export default async function multiplyNumbers(x: number, y: number): Promise<string> {
    const result = x * y;
    return result.toString();
}