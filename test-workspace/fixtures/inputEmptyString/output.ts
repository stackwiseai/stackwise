stack('this is an example', {
  in: '',
  out: true,
});

import generateBooleanResponse from '../../stacks/generateBooleanResponse';

await generateBooleanResponse("''");


/**
 * Brief: this is an example
 */
export default async function generateBooleanOutput(input: string): Promise<string> {
    let output = '';
    if (input) {
        output = 'true';
    } else {
        output = 'false';
    }
    return output;
}