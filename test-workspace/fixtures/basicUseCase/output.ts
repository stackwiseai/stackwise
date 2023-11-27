stack('this is an example', {
  input: { test: 'ok' },
  outExample: { test: 'ok' },
});


import exampleFunction from '../../stacks/exampleFunction';

exampleFunction(
  'ok'
  );



/**
 * Brief: this is an example
 */
export default async function exampleFunction(): Promise<null> {
    console.log("This is an example.");
    return null;
}