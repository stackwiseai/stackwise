stack(
    'brief',
    {
      'in': ['this is an example', 'this is an example']
    }
  );
  
  // TODO: allow the usage of in a string, but for now incentiviwe people to use in: ['this is an example', 'this is an example']
import processInputArray from '../../stacks/processInputArray';

await processInputArray('this is an example', 'this is an example');
  
  // TODO: allow the usage of in a string, but for now incentiviwe people to use in: ['this is an example', 'this is an example']

/**
 * Brief: brief
 */
export default async function processInputArray(in: string[]): Promise<null> {
    in.forEach((item) => {
        console.log(item);
    });
    return null;
}