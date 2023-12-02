/**
 * Brief: multiply three numbers
 */
export default async function multiplyThreeNumbers(x: number, y: number, z: number): Promise<string> {
    const result = x * y * z;
    return result.toString();
}