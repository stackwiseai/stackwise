stack('this is an example', {
    in: 'this is a brief',
    out: {
      'ok': true,
      'test': 'other'
    },
  });
import exampleFunction from '../../stacks/exampleFunction';

await exampleFunction('this is a brief');

/**
 * Brief: this is an example
 */
export default async function exampleFunction(): Promise<null> {
    console.log("This is an example.");
    return null;
}