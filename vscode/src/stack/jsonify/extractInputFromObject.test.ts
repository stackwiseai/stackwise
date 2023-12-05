import extractInputFromObject from './extractInputFromObject';
import jsonifyString from './jsonify';

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{
    in: { x, y },
    out: { check: 0 }
  }`;

  const result = extractInputFromObject(inputString);

  const expectedOutput = `{ x, y }`;
  console.log(result);

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{
    in: { x, y, "z": z },
    out: { check: 0 }
  }`;

  const result = extractInputFromObject(inputString);

  const expectedOutput = `{ x, y, "z": z }`;
  console.log(result);

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{"in": { x, "y": y},
  "out": {"check": 0}
}`;

  const result = extractInputFromObject(inputString);

  const expectedOutput = `{ x, "y": y}`;
  console.log(result);

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{
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
}`;

  const result = extractInputFromObject(inputString);

  const expectedOutput = 
`{
      "dictionary": {
        "Use the chatCompletion endpoint from openai to return a response": "callOpenAI",
        "Find a good name for this method.": "pickMethodName"
      },
      "textCode": isolatedFunction
    }`;
  console.log(result);

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{
    in: "this is a brief",
    out: {"ok": true,"test": "other"
    }
  }`;

  const result = extractInputFromObject(inputString);

  const expectedOutput = `"this is a brief"`;
  console.log(result);

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{"in": ['this is an example', 'this is an example']
}

`;

  const result = extractInputFromObject(inputString);

  const expectedOutput = `['this is an example', 'this is an example']`;
  console.log(result);

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

