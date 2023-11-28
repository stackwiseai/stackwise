import jsonifyString from './jsonify';
import replaceJSONPlaceholders from './replaceJSONPlaceholders';

test('identifies and extracts placeholders from JSON-like string', () => {
  // Sample JSON-like string with placeholders

  const inputString = `{ "x": x, "y": y}`;

  const result = replaceJSONPlaceholders(inputString);

  const expectedOutput = '{ "x": "x@var", "y": "y@var"}';

  // Check if the result matches the expected output
  expect(result).toEqual(expectedOutput);
});
