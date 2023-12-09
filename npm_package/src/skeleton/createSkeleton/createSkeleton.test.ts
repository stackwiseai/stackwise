// import createSkeleton, { combineSkeleton } from '.';
// import { placeholderName } from '../../../../shared/constants';

// describe('createSkeleton', () => {
//   test('create Skeleton given a signature', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Modified output object to have two keys
//     const output = { output: 'string', description: 'string' };

//     const flatInput = 'prompt: string';

//     // Updated expected output to include a documentation comment and a new key in the interface
//     const expectedOutput = `interface OutputType {
//   output: string;
//   description: string;
// }

// /**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function ${placeholderName}(prompt: string): Promise<OutputType> {
//     return "";
// }`;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     expect(combinedFunction).toEqual(expectedOutput);
//   });

//   test('create Skeleton with single parameter in OutputType', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Output object with a single key
//     const output = { result: 'string' };
//     const flatInput = 'prompt: string';

//     // Expected output with an interface having a single key
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function ${placeholderName}(prompt: string): Promise<string> {
//     return "string";
// }`;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     expect(combinedFunction).toEqual(expectedOutput);
//   });

//   test('use any when the input is complex', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Output object with a single key
//     const output = { result: 'string' };

//     const flatInput = 'prompt: string';

//     // Expected output with an interface having a single key
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function ${placeholderName}(prompt: string): Promise<string> {
//     return "string";
// }`;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     expect(combinedFunction).toEqual(expectedOutput);
//   });

//   test('use any when the input is complex', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Output object with a single key
//     const output = { result: { ok: 'string' } };

//     const flatInput = 'prompt: string';

//     // Expected output with an interface having a single key
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function ${placeholderName}(prompt: string): Promise<any> {
//     return {"ok":"string"};
// }`;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     expect(combinedFunction).toEqual(expectedOutput);
//   });

//   test('create Skeleton given a signature', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Modified output object to have two keys
//     const output = { output: 'string', description: 'string' };

//     const flatInput = 'prompt: string';

//     // Updated expected output to include a documentation comment and a new key in the interface
//     const expectedOutput = `interface OutputType {
//   output: string;
//   description: string;
// }

// /**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function ${placeholderName}(prompt: string): Promise<OutputType> {
//     return "";
// }`;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     expect(combinedFunction).toEqual(expectedOutput);
//   });

//   test('create Skeleton given a signature', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Modified output object to have two keys
//     const output = undefined;

//     const flatInput = 'prompt: string';

//     // Updated expected output to include a documentation comment and a new key in the interface
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function ${placeholderName}(prompt: string): Promise<null> {
//     return null;
// }`;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     expect(combinedFunction).toEqual(expectedOutput);
//   });

//   test('create Skeleton given a signature', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Modified output object to have two keys
//     const output = { out: 0 };

//     const flatInput = 'prompt: string';

//     // Updated expected output to include a documentation comment and a new key in the interface
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function ${placeholderName}(prompt: string): Promise<number> {
//     return 0;
// }`;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     expect(combinedFunction).toEqual(expectedOutput);
//   });
// });
