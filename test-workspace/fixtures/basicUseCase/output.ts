stack('this is an example', {
  in: { test: 'ok' },
  out: { test: 'ok' },
});


import exampleFunction from '../../stacks/exampleFunction';

await exampleFunction('ok');



/**
 * Brief: this is an example
 */
export default async function exampleFunction(): Promise<null> {
    console.log("This is an example.");
    return null;
}