// import createSkeleton, { combineSkeleton } from '.';

// describe('createSkeleton', () => {
//   test('create Skeleton given a signature', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Modified output object to have two keys
//     const output = { output: 'string', description: 'string' };

//     const signature = 'placeholderStackwiseFunction';
//     const flatInput = 'prompt: string';

//     // Updated expected output to include a documentation comment and a new key in the interface
//     const expectedOutput = `interface OutputType {
//   output: string;
//   description: string;
// }

// /**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function placeholderStackwiseFunction(prompt: string): Promise<OutputType> {
//     return Promise.resolve("");
// }
// `;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       signature,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     console.log('combinedFunction', combinedFunction);
//     console.log('expectedOutput', expectedOutput);
//     expect(combinedFunction).toEqual(expectedOutput);
//   });

//   test('create Skeleton with single parameter in OutputType', () => {
//     const brief =
//       'use the given prompt to call the Fuyu model to get a description of the image';
//     const params = { prompt: 'Describe the colors in the image.' };

//     // Output object with a single key
//     const output = { result: 'string' };

//     const signature = 'singleOutputFunction';
//     const flatInput = 'prompt: string';

//     // Expected output with an interface having a single key
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function singleOutputFunction(prompt: string): Promise<string> {
//     return "string";;
// }
// `;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       signature,
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

//     const signature = 'singleOutputFunction';
//     const flatInput = 'prompt: string';

//     // Expected output with an interface having a single key
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function singleOutputFunction(prompt: string): Promise<string> {
//     return "string";
// }
// `;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       signature,
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

//     const signature = 'singleOutputFunction';
//     const flatInput = 'prompt: string';

//     // Expected output with an interface having a single key
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function singleOutputFunction(prompt: string): Promise<any> {
//     return {"ok":"string"};
// }
// `;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       signature,
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

//     const signature = 'placeholderStackwiseFunction';
//     const flatInput = 'prompt: string';

//     // Updated expected output to include a documentation comment and a new key in the interface
//     const expectedOutput = `interface OutputType {
//   output: string;
//   description: string;
// }

// /**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function placeholderStackwiseFunction(prompt: string): Promise<OutputType> {
//     return Promise.resolve("");
// }
// `;

//     const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       signature,
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

//     const signature = 'placeholderStackwiseFunction';
//     const flatInput = 'prompt: string';

//     // Updated expected output to include a documentation comment and a new key in the interface
//     const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function placeholderStackwiseFunction(prompt: string): Promise<null> {
//     return Promise.resolve(null);
// }
// `;

// test('create Skeleton given a signature', () => {
//   const brief =
//     'use the given prompt to call the Fuyu model to get a description of the image';
//   const params = { prompt: 'Describe the colors in the image.' };

//   // Modified output object to have two keys
//   const output = { outExample: 0 };

//   const signature = 'placeholderStackwiseFunction';
//   const flatInput = 'prompt: string';

//   // Updated expected output to include a documentation comment and a new key in the interface
//   const expectedOutput = `/**
//  * Brief: use the given prompt to call the Fuyu model to get a description of the image
//  */
// export default async function placeholderStackwiseFunction(prompt: string): Promise<number> {
//     return 0;
// }
// `;

//   const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
//       brief,
//       params,
//       output,
//       signature,
//       flatInput
//     );
//     const combinedFunction = combineSkeleton(
//       briefSkeleton,
//       functionAndOutputSkeleton
//     );
//     expect(combinedFunction).toEqual(expectedOutput);
// });
