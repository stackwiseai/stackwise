stack('this is an example', {
  input: '',
  outExample: true,
});

import generateBooleanOutput from '../../stacks/generateBooleanOutput';

await generateBooleanOutput('');


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