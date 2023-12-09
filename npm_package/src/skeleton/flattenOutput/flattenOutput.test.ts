import flattenOutput from '.';

test('flattenOutput correctly', () => {
  const jsonOutput = { result: 'number' };
  const expectedOutput = {
    returnInterface: '',
    returnType: 'Promise<number>',
    return: 'return 0',
  };

  const result = flattenOutput(jsonOutput);
  expect(result).toEqual(expectedOutput);
});

test('output list', () => {
  const jsonOutput = { list: 'string[]' };
  const expectedOutput = {
    returnInterface: '',
    returnType: 'Promise<string[]>',
    return: 'return []',
  };

  const result = flattenOutput(jsonOutput);
  expect(result).toEqual(expectedOutput);
});

test('output list', () => {
  const jsonOutput = { result1: 'number', result2: 'number' };
  const expectedOutput = {
    returnInterface:
      'interface OutputType {\n    result1: number;\n    result2: number;\n}',
    returnType: 'Promise<OutputType>',
    return: 'return { result1: 0, result2: 0 }',
  };

  const result = flattenOutput(jsonOutput);
  expect(result).toEqual(expectedOutput);
});

test('boolean type', () => {
  const jsonOutput = { isValid: 'boolean' };
  const expectedOutput = {
    returnInterface: '',
    returnType: 'Promise<boolean>',
    return: 'return false',
  };

  const result = flattenOutput(jsonOutput);
  expect(result).toEqual(expectedOutput);
});

test('multiple types', () => {
  const jsonOutput = { name: 'string', age: 'number', active: 'boolean' };
  const expectedOutput = {
    returnInterface:
      'interface OutputType {\n    name: string;\n    age: number;\n    active: boolean;\n}',
    returnType: 'Promise<OutputType>',
    return: `return { name: "", age: 0, active: false }`,
  };

  const result = flattenOutput(jsonOutput);
  expect(result).toEqual(expectedOutput);
});

test('nested object', () => {
  // This is a more advanced test case, assuming your function might handle nested structures
  const jsonOutput = { user: { name: 'string', age: 'number' } };
  const expectedOutput = {
    returnInterface:
      'interface OutputType {\n    user: { name: string; age: number; };\n}',
    returnType: 'Promise<OutputType>',
    return: `return { user: { name: "", age: 0 } }`,
  };

  const result = flattenOutput(jsonOutput);
  expect(result).toEqual(expectedOutput);
});
