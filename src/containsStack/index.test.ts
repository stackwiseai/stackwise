import containsStack from '.';
import flattenInputJson from '.';

test('flattenInputJson correctly', () => {
  const text = "stack({in: {prompt: 'string', test: 'string' }})";
  const expectedOutput = true;

  const result = containsStack(text);
  expect(result).toEqual(expectedOutput);
});
test('flattenInputJson correctly', () => {
    const text = "restack({in: {prompt: 'string', test: 'string' }})";
    const expectedOutput = false;

    const result = containsStack(text);
    expect(result).toEqual(expectedOutput);
});
test('flattenInputJson correctly', () => {
    const text = "cdsnjkcdns stack({in: {prompt: 'string', test: 'string' }})";
    const expectedOutput = true;

    const result = containsStack(text);
    expect(result).toEqual(expectedOutput);
});

test('flattenInputJson correctly', () => {
    const text = "  stack({in: {prompt: 'string', test: 'string' }})";
    const expectedOutput = true;

    const result = containsStack(text);
    expect(result).toEqual(expectedOutput);
});
