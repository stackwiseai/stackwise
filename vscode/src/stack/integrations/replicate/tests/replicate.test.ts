// import path from 'path';
// import fs from 'fs/promises';
// import generateFunction from '../construct';

// jest.setTimeout(15000);

// const tsFilePath = path.join(__dirname, 'tempFunction.ts');

// describe('generateFunction', () => {
//   test.skip('call openai model with prompt', async () => {
//     const functionAndOutputSkeleton = `export default async function callOpenAI(prompt: string): Promise<string> {
//       return '';
//   }`;

//     const brief = 'Call openai using gpt-3.5-turbo with the prompt that I gave';

//     // this means no similar was found, will use default boilerplate
//     const exampleBoilerplate = null;

//     const briefSkeleton = `/**
//    * Brief: ${brief}
//    */`;
//     const generatedFunction = await generateFunction(
//       briefSkeleton,
//       functionAndOutputSkeleton,
//       brief,
//       exampleBoilerplate,
//       embedding
//     );

//     console.log(`generatedFunction`, generatedFunction);

//     // Write the generated function to a file
//     await fs.writeFile(tsFilePath, generatedFunction);

//     const method = await import(tsFilePath);
//     const callOpenAI = method.default;

//     expect(
//       await callOpenAI(
//         `Return absolutely nothing but 'hi there'. Do not return anything before or after`
//       )
//     ).toContain('hi there');
//     expect(
//       await callOpenAI(
//         `Return absolutely nothing but 'Yes I do'. Do not return anything before or after`
//       )
//     ).toContain('Yes I do');

//     await fs.unlink(tsFilePath);
//   });
// });
