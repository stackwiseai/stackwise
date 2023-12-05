stack('this is an example', {
  in: '',
  out: true,
});

import convertStringToBoolean from '../../stacks/convertStringToBoolean';

await convertStringToBoolean('');


/**
 * Brief: this is an example
 */
export default async function convertStringToBoolean(input: string): Promise<boolean> {
    return input.toLowerCase() === "true";
}