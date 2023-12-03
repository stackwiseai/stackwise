stack('this is an example');
import exampleFunction from '../../stacks/exampleFunction';

await exampleFunction();

/**
 * Brief: this is an example
 */
export default async function exampleFunction(): Promise<any> {
    const example = "this is an example";
    return example;
}