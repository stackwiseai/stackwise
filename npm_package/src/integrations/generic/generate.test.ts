import path from 'path';
const fs = require('fs').promises;
import generateFunction from './generateFunction';

jest.setTimeout(15000);

const tsFilePath = path.join(__dirname, 'tempFunction.ts');

describe('generateFunction', () => {
  test('sum two numbers', async () => {
    const functionAndOutputSkeleton = `export default async function sumTwoNumbers(x: number, y: number): Promise<number> {
    return 0;
}`;

    const brief = 'Make me a function that adds the two numbers that I give it';

    const exampleBoilerplate = null;

    const integration = 'generic';

    const briefSkeleton = `/**
 * Brief: ${brief}
 */`;
    const generatedFunction = await generateFunction(
      briefSkeleton,
      functionAndOutputSkeleton,
      brief,
      exampleBoilerplate,
      integration
    );

    console.log(`generatedFunction`, generatedFunction);

    // Write the generated function to a file
    await fs.writeFile(tsFilePath, generatedFunction);

    const method = await import(tsFilePath);
    const sumTwoNumbers = method.default;

    expect(await sumTwoNumbers(1, 2)).toBe(3);
    expect(await sumTwoNumbers(7, 8)).toBe(15);
    expect(await sumTwoNumbers(0, 0)).toBe(0);
    expect(await sumTwoNumbers(-1, -1)).toBe(-2);

    await fs.unlink(tsFilePath);
  });

  //   test.only('call openai model with prompt', async () => {
  //     const functionAndOutputSkeleton = `export default async function callOpenAI(prompt: string): Promise<string> {
  //     return '';
  // }`;

  //     const brief = 'Call openai using gpt-3.5-turbo with the prompt that I gave';

  //     // this means no similar was found, will use default boilerplate
  //     const exampleBoilerplate = null;

  //     const integration = 'openai';

  //     const briefSkeleton = `/**
  //  * Brief: ${brief}
  //  */`;
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
});
