stack('this is an example', {
  in: { test: 'ok' },
  out: { test: 'ok' },
});


import getTestString from '../../stacks/getTestString';

await getTestString('ok');



/**
 * Brief: this is an example
 */
export default async function getTestString(test: string): Promise<any> {
    return {"test": test};
}