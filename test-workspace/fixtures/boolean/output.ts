
stack('this is an example', {
  in: { test: true },
  out: { test: 'ok' },
});


import exampleFunction from '../../stacks/exampleFunction';


await exampleFunction(true);



/**
 * Brief: this is an example
 */
export default async function exampleFunction(test: boolean): Promise<any> {
    if(test) {
        return {"test":"This is a test"};
    } else {
        return {"test":"This is not a test"};
    }
}