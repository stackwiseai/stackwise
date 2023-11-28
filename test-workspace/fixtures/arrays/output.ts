stack(
  'brief',
  {
    'input': ['this is an example', 'this is an example']
  }
);

import validateInputArray from '../../stacks/validateInputArray';

await validateInputArray('this is an example', 'this is an example');


/**
 * Brief: brief
 */
export default async function validateInputArray(input: string[]): Promise<null> {
    if (!Array.isArray(input)) {
        throw new Error('Input must be an array');
    }

    for (let i = 0; i < input.length; i++) {
        if (typeof input[i] !== 'string') {
            throw new Error(`Element at index ${i} is not a string`);
        }
    }

    return null;
}