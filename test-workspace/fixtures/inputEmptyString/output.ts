stack('this is an example', {
  in: '',
  out: true,
});

import exampleAsyncFunction from '../../stacks/exampleAsyncFunction';

await exampleAsyncFunction('');


/**
 * Brief: this is an example
 */
export default async function exampleAsyncFunction(): Promise<string> {
    let result: string = "This is an example";
    return result;
}