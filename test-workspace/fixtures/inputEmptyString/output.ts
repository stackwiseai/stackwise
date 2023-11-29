stack('this is an example', {
  in: '',
  out: true,
});

import convertStringToBoolean from '../../stacks/convertStringToBoolean';

await convertStringToBoolean('');


/**
 * Brief: this is an example
 */
export default async function convertStringToBoolean(in: string): Promise<boolean> {
    if (in.toLowerCase() === 'true') return true;
    if (in.toLowerCase() === 'false') return false;
    throw new Error('Input must be a string of "true" or "false".');
}