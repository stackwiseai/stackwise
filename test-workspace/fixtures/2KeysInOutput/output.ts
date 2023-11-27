stack('this is an example', {
    input: 'this is a brief',
    outExample: {
      'ok': true,
      'test': 'other'
    },
  });
import exampleFunction from '../../stacks/exampleFunction';

exampleFunction(
  'this is a brief'
  );

/**
 * Brief: this is an example
 */
export default async function exampleFunction(input: string): Promise<null> {
    console.log(`Input received: ${input}`);
    return null;
}