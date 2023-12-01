stack('this is an example', {out: 'this is an example'});

import exampleAsyncStringFunction from '../../stacks/exampleAsyncStringFunction';

await exampleAsyncStringFunction();


/**
 * Brief: this is an example
 */
export default async function exampleAsyncStringFunction(): Promise<string> {
    const data = await fetch('https://api.example.com/data');
    const result = await data.json();
    return result.string;
}