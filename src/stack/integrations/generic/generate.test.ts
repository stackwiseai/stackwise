// import path from 'path';
// import fs from 'fs/promises';
// import generateFunction from './generateFunction';

// const skeleton = `export default async function sumTwoNumbers(x: number, y: number): Promise<number> {
//     return 0;
// }`;

// const brief = 'Make me a function that adds the two numbers that I give it';

// const exampleBoilerplate = null;

// const integration = 'generic';

// const briefSkeleton = `/**
//  * Brief: ${brief}
//  */`;

// const tsFilePath = path.join(__dirname, 'tempFunction.ts');

// describe('generateFunction', () => {
//   beforeAll(async () => {
//     const generatedFunction = await generateFunction(
//       briefSkeleton,
//       functionAndOutputSkeleton,
//       brief,
//       exampleBoilerplate,
//       integration
//     );

//     console.log(`generatedFunction`, generatedFunction);

//     // Write the generated function to a file
//     await fs.writeFile(tsFilePath, generatedFunction);
//   });

//   it('should add two numbers correctly', async () => {
//     const method = await import(tsFilePath);
//     const sumTwoNumbers = method.default;

//     expect(await sumTwoNumbers(1, 2)).toBe(3);
//     expect(await sumTwoNumbers(7, 8)).toBe(15);
//     expect(await sumTwoNumbers(0, 0)).toBe(0);
//     expect(await sumTwoNumbers(-1, -1)).toBe(-2);
//   });

//   afterAll(async () => {
//     await fs.unlink(tsFilePath);
//   });
// });
