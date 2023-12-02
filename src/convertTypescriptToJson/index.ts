import JSON5 from 'json5';
function preprocessInput(input: string): string {
  // Remove "typescript", backticks, and "(property)"
  
  input = input.replace(/```typescript|```/g, '').trim();
  input = input.replace(/\(property\)\s*/g, '');
  input = input.replace(/\s*(\w+):/g, "'$1':");

  // Replace semicolons with colons
  input = input.replace(/;/g, ',');

  input = input.replace(/:\s*([\w\[\]]+)/g, ": '$1'");
  input = '{' + input + '}';
  return input;
}

export default function convertTypescriptToJson(input: string): any {
  if (!input) {
    return {};
  }

  input = preprocessInput(input);
  console.log(input);
  return JSON5.parse(input);

  // Rest of the parsing logic goes here
}

// Test cases and other code
