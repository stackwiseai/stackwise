stack('this is an example', {
  input: '',
  outExample: true,
});

import generateBooleanResponse from '../../stacks/generateBooleanResponse';

generateBooleanResponse(
  ''
  );


/**
 * Brief: this is an example
 */
export default async function generateBooleanResponse(input: string): Promise<string> {
    let response = '';
    if (input.toLowerCase() === 'true' || input.toLowerCase() === 'false') {
        response = 'boolean';
    } else {
        response = 'not boolean';
    }
    return response;
}