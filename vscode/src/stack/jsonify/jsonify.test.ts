import jsonifyString from './jsonify';

test('dictionary object', () => {
  // Sample JSON-like string with placeholders

  const inputString = `stack (
    "ok this is an example",
    {
      "in": {
        "dictionary": {
          "Use the chatCompletion endpoint from openai to return a response": "callOpenAI",
          "Find a good name for this method.": "pickMethodName"
        },
        "textCode": isolatedFunction
      },
      "out": {
        "methodName": "callOpenAI"
      }
    })`;

  const result = jsonifyString(inputString);

  const expectedOutput = {
    in:
      '{"dictionary":{"Use the chatCompletion endpoint from openai to return a response":"callOpenAI","Find a good name for this method.":"pickMethodName"},"textCode":isolatedFunction}',
    inputValues: `{"Use the chatCompletion endpoint from openai to return a response":"callOpenAI","Find a good name for this method.":"pickMethodName"}, isolatedFunction`
  };

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('extract', () => {
  // Sample JSON-like string with placeholders

  const inputString = `stack("test", {
    in: { test: "ok" },
    out: { test: "ok" }
  })`;

  const result = jsonifyString(inputString);

  const expectedOutput = {
    in: `{"test":"ok"}`,
    inputValues: `"ok"`
  };

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('single quotes', () => {
  // Sample JSON-like string with placeholders

  const inputString = `stack('test', {
    in: { test: 'ok' },
    out: { test: 'ok' }
  })`;

  const result = jsonifyString(inputString);

  const expectedOutput = {
    in: `{"test":"ok"}`,
    inputValues: `"ok"`
  };

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('single quotes', () => {
  // Sample JSON-like string with placeholders

  const inputString = `stack('multiply two numbers', {
      in: { x, y },
      out: { check: 0 },
    })`;

  const result = jsonifyString(inputString);

  const expectedOutput = {
    in: `{"x":x,"y":y}`,
    inputValues: `x, y`,
  };

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});