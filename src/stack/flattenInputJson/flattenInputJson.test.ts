import flattenInputJson from '.';

test('flattenInputJson correctly', () => {
  const jsonInput = {in:{ prompt: 'string', test: 'string' }};
  const expectedOutput = `prompt: string, test: string`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('putting any when necessary', () => {
  const jsonInput = {in:{ prompt: { test: 'boolean', ok: 'boolean'}}};
  const expectedOutput = `prompt: any`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('putting any when necessary', () => {
  const jsonInput = {in:{ prompt: { test: 'boolean'}}};
  const expectedOutput = `prompt: boolean`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});