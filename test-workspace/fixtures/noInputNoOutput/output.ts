stack('this is an example');
import exampleFunction from '../../stacks/exampleFunction';

await exampleFunction();

/**
 * Brief: this is an example
 */
export default async function exampleFunction(): Promise<null> {
    console.log("This is an example.");
    return null;
}