stack('this is an example', {
  in: 'this is an example',
  out: true,
});



import exampleAsyncFunction from '../../stacks/exampleAsyncFunction';

await exampleAsyncFunction('this is an example');




/**
 * Brief: this is an example
 */
export default async function exampleAsyncFunction(): Promise<string> {
    let result: string = "This is an example";
    return result;
}