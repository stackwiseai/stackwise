
stack('this is an example', {
  input: { test: true },
  outExample: { test: 'ok' },
});


import exampleFunction from '../../stacks/exampleFunction';


exampleFunction(
  true
  );



/**
 * Brief: this is an example
 */
export default async function exampleFunction(): Promise<null> {
    console.log("This is an example.");
    return null;
}