import extractInputString from './extractInputString';

describe('extractJSONPlaceholders', () => {
  test('identifies and extracts placeholders from JSON-like string', () => {
    // Sample JSON-like string with placeholders

    const inputString = `stack (
      "ok this is an example",
      {
        "input": {
          "dictionary": {
            "Use the chatCompletion endpoint from openai to return a response": "callOpenAI",
            "Find a good name for this method.": "pickMethodName"
          },
          "textCode": isolatedFunction
        },
        "outExample": {
          "methodName": "callOpenAI"
        }
      })`;

    const expectedOutput = '{"Use the chatCompletion endpoint from openai to return a response":"callOpenAI","Find a good name for this method.":"pickMethodName"}, isolatedFunction';

    const result = extractInputString(inputString);

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  test('extract', () => {
    // Sample JSON-like string with placeholders

    const inputString = `stack("test", {
      input: { test: "ok" },
      outExample: { test: "ok" }
    })`;

    const result = extractInputString(inputString);

    const expectedOutput = '"ok"';

    expect(result).toEqual(expectedOutput);
  });

  test('single quotes', () => {
    // Sample JSON-like string with placeholders

    const inputString = `stack('test', {
      input: { test: 'ok' },
      outExample: { test: 'ok' }
    })`;

    const result = extractInputString(inputString);

    const expectedOutput = '"ok"';

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  test('single quotes', () => {
    // Sample JSON-like string with placeholders

    const inputString = `stack('this is an example', {
      input: { test: 'ok' },
      outExample: { test: 'ok' },
    })`;

    const result = extractInputString(inputString);

    const expectedOutput = '"ok"';

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  test('single quotes', () => {
    // Sample JSON-like string with placeholders

    const inputString = `stack('this is an example', {
      input: "input passed directly",
      outExample: { test: 'ok' },
    })`;

    const result = extractInputString(inputString);

    const expectedOutput = '"input passed directly"';

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  test('single quotes', () => {
    // Sample JSON-like string with placeholders

    const inputString = `stack('multiply two numbers', {
      input: { x: 2, y: 5 },
      outExample: 0,
    })`;

    const result = extractInputString(inputString);

    const expectedOutput = '2, 5';

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });


  
});




