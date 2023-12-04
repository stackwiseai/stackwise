stack('multiply three numbers', {
    in: { x: 2, y: 5, z: 3 },
    out: 0,
  });
import multiplyThreeNumbers from '../../stacks/multiplyThreeNumbers';

await multiplyThreeNumbers(2, 5, 3);

/**
 * Brief: multiply three numbers
 */
export default async function multiplyThreeNumbers(x: number, y: number, z: number): Promise<string> {
    let result = x * y * z;
    return result.toString();
}