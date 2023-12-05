stack('this is an example', {out: 'this is an example'});

import getExampleString from '../../stacks/getExampleString';

await getExampleString();


/**
 * Brief: this is an example
 */
export default async function getExampleString(): Promise<string> {
    let example = "this is an example.";
    return example;
}