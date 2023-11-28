import handleWeirdObject from './handleWeirdObject';
import jsonifyString from './jsonify';


test('identifies and extracts placeholders from JSON-like string', () => {
    // Sample JSON-like string with placeholders
  
    const inputString = `{ x, y, "z": z }`;
  
    const result = handleWeirdObject(inputString);
  
    const expectedOutput = `{"x": x, "y": y, "z": z}`;
    console.log(result);
  
    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });  

  test('identifies and extracts placeholders from JSON-like string', () => {
    // Sample JSON-like string with placeholders
  
    const inputString = `{ x, y, "z": z }`;
  
    const result = handleWeirdObject(inputString);
  
    const expectedOutput = `{"x": x, "y": y, "z": z}`;
    console.log(result);
  
    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  test('identifies and extracts placeholders from JSON-like string', () => {
    // Sample JSON-like string with placeholders
  
    const inputString = `{
      "dictionary": {
        "Use the chatCompletion endpoint from openai to return a response": "callOpenAI",
        "Find a good name for this method.": "pickMethodName"
      }}`;
  
    const result = handleWeirdObject(inputString);
  
    const expectedOutput = `{
      "dictionary": {"Use the chatCompletion endpoint from openai to return a response": "callOpenAI", "Find a good name for this method.": "pickMethodName"}}`;
    console.log(result);
  
    // Check if the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });