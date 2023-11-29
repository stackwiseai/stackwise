import transformJSON from './transformJSON';

describe('transformJSON', () => {
  test('transformJSON behaves correctly', () => {
    // Sample JSON-like string with placeholders
    const inputString = { test: 'ok@var' };

    const result = transformJSON(inputString);

    const expectedOutput = {
      in: `{"test":ok}`,
    };

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });
});
