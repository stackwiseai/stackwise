import extractInputFromObject from './extractInputFromObject';
import jsonifyString from './jsonify';

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{
    input: { x, y },
    outExample: { check: 0 }
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
    input: { x, y, "z": z },
    outExample: { check: 0 }
  }`;

  const result = extractInputFromObject(inputString);

  const expectedOutput = `{ x, y, "z": z }`;
  console.log(result);

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{"input": { x, "y": y},
  "outExample": {"check": 0}
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
    input: "this is a brief",
    outExample: {"ok": true,"test": "other"
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

  const inputString = `{"input": ['this is an example', 'this is an example']
}

`;

  const result = extractInputFromObject(inputString);

  const expectedOutput = `['this is an example', 'this is an example']`;
  console.log(result);

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});

