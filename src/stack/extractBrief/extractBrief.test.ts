import extractBrief from '.';

describe('extractParameters', () => {
  test('extracts parameters correctly from double quotes', () => {
    const input = `stack(
      "Create a method that takes a dictionary and some textCode in. It returns a methodName. The methodName should be picked based on the first key in the value that is present in the textCode. If that's the case, the value should be returned",
      {
          in: {
              "dictionary": {
                  "Use the chatCompletion endpoint from openai to return a response": "callOpenAI",
                  "Find a good name for this method.": "pickMethodName",
              },
              textCode: isolatedFunction
          },
          out:{
              "methodName": "callOpenAI"
          }
      },
      pickMethodName
  )`;
    // Update the expected output to be an array of an array
    const expectedOutput =
      "Create a method that takes a dictionary and some textCode in. It returns a methodName. The methodName should be picked based on the first key in the value that is present in the textCode. If that's the case, the value should be returned";
    const result = extractBrief(input);
    expect(result).toEqual(expectedOutput);
  });
  test('extracts parameters correctly from single quotes', () => {
    const input = `stack('test that\'s right', {
      in: { test: 'ok' },
      out: { test: 'ok' }
    })`;
    // Update the expected output to be an array of an array
    const expectedOutput = "test that's right";
    const result = extractBrief(input);
    expect(result).toEqual(expectedOutput);
  });
  test('extracts parameters correctly from backticks', () => {
    const input =
      "stack(`checking here's backticks`, {\n      in: { test: 'ok' },\n      out: { test: 'ok' }\n    })";
    // Update the expected output to be an array of an array
    const expectedOutput = `checking here's backticks`;
    const result = extractBrief(input);
    expect(result).toEqual(expectedOutput);
  });
});
