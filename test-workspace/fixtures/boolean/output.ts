
stack('this is an example', {
  in: { test: true },
  out: { test: 'ok' },
});


import exampleFunction from '../../stacks/exampleFunction';


await exampleFunction(true);



/**
 * Brief: this is an example
 */
export default async function exampleFunction(input: string): Promise<null> {
    console.log(`Input received: ${input}`);
    return null;
}