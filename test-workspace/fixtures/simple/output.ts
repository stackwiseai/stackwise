stack('this is an example', {
  input: 'this is an example',
  outExample: true,
});



import generateBooleanOutput from '../../stacks/generateBooleanOutput';

await generateBooleanOutput('this is an example');




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