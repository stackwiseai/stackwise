const isAdmin: boolean | null = getValue();
stack('this is an example', {
  in: { test: isAdmin },
  out: { test: 'ok' },
});




