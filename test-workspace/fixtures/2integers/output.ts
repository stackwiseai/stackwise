stack('multiply two numbers', {
  input: { x: 2, y: 5 },
  outExample: 0,
});




import multiplyNumbers from '../../stacks/multiplyNumbers';

await multiplyNumbers(2, 5);





/**
 * Brief: multiply two numbers
 */
export default async function multiplyNumbers(num1: number, num2: number): Promise<number> {
    return num1 * num2;
}