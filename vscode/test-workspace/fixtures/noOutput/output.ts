stack('this is an example', {in: 'this is an example'});

import exampleFunction from '../../stacks/exampleFunction';

await exampleFunction('this is an example');


/**
 * Brief: this is an example
 */
export default async function exampleFunction(input: string): Promise<any> {
    let reversedInput = input.split('').reverse().join('');
    return reversedInput;
}