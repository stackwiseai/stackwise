stack(
  'brief',
  {
    'in': ['this is an example', 'this is an example']
  }
);

import getNullValue from '../../stacks/getNullValue';

await getNullValue('this is an example', 'this is an example');


/**
 * Brief: brief
 */
export default async function getNullValue(): Promise<null> {
    const result = await Promise.resolve(null);
    return result;
}