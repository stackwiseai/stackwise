const isAdmin: boolean | null = getValue();
stack('this is an example', {
  in: { test: isAdmin },
  out: { test: 'ok' },
});





import getTestString from '../../stacks/getTestString';

const isAdmin: boolean | null = getValue();
await getTestString(isAdmin);






