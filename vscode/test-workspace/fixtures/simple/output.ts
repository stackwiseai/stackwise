stack('this is an example', {
  in: 'this is an example',
  out: true,
});



import convertStringToBoolean from '../../stacks/convertStringToBoolean';

await convertStringToBoolean('this is an example');




/**
 * Brief: this is an example
 */
export default async function convertStringToBoolean(input: string): Promise<boolean> {
    return input.toLowerCase() === "true";
}