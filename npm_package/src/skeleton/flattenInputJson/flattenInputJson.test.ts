import flattenInputJson from '.';

test('flattenInputJson correctly', () => {
  const jsonInput = { num1: 'number', num2: 'number' };
  const expectedOutput = `num1: number, num2: number`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('nested', () => {
  const jsonInput = { prompt: { test: 'boolean', ok: 'boolean' } };
  const expectedOutput = `prompt: { test: boolean, ok: boolean }`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('nested', () => {
  const jsonInput = null;
  const expectedOutput = ``;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('nested', () => {
  const jsonInput = {};
  const expectedOutput = ``;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('test image', () => {
  const jsonInput = { image: 'image' };
  const expectedOutput = `image: File`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('string array', () => {
  const jsonInput = { list: 'string[]' };
  const expectedOutput = `list: string[]`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('number array', () => {
  const jsonInput = { numbers: 'number[]' };
  const expectedOutput = `numbers: number[]`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('boolean', () => {
  const jsonInput = { isValid: 'boolean' };
  const expectedOutput = `isValid: boolean`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('nested object with array', () => {
  const jsonInput = { user: { name: 'string', roles: 'string[]' } };
  const expectedOutput = `user: { name: string, roles: string[] }`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});

test('HTMLElement type', () => {
  const jsonInput = { element: 'HTMLElement' };
  const expectedOutput = `element: HTMLElement`;

  const result = flattenInputJson(jsonInput);
  expect(result).toEqual(expectedOutput);
});
