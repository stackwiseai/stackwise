import transformJSON from './jsonify';

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

    const result = transformJSON(inputString);

    const expectedOutput = {
      input:
        '{"dictionary":{"Use the chatCompletion endpoint from openai to return a response":"callOpenAI","Find a good name for this method.":"pickMethodName"},"textCode":isolatedFunction}',
      outExample: {
        methodName: 'callOpenAI',
      },
    };

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  test('extract', () => {
    // Sample JSON-like string with placeholders

    const inputString = `stack("test", {
      input: { test: "ok" },
      outExample: { test: "ok" }
    })`;

    const result = transformJSON(inputString);

    const expectedOutput = {
      input: `{"test":"ok"}`,
      outExample: { test: 'ok' },
    };

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  test('single quotes', () => {
    // Sample JSON-like string with placeholders

    const inputString = `stack('test', {
      input: { test: 'ok' },
      outExample: { test: 'ok' }
    })`;

    const result = transformJSON(inputString);

    const expectedOutput = {
      input: `{"test":"ok"}`,
      outExample: { test: 'ok' },
    };

    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });
});
