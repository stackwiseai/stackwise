stack('this is an example', {
  in: { test: 'ok' },
  out: { test: 'ok' },
});


import exampleAsyncFunction from '../../stacks/exampleAsyncFunction';

await exampleAsyncFunction('ok');



/**
 * Brief: this is an example
 */
export default async function exampleAsyncFunction(test: string): Promise<any> {
    const result = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({"test": test});
        }, 1000);
    });
    return result;
}