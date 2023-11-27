stack(
  'brief',
  {
    'input': ['this is an example', 'this is an example']
  }
);

import processStringArray from '../../stacks/processStringArray';

processStringArray(
  'this is an example', 'this is an example'
  );


/**
 * Brief: brief
 */
export default async function processStringArray(input: string[]): Promise<null> {
    input.forEach((str) => {
        console.log(str);
    });
    return null;
}