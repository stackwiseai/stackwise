import JSON5 from 'json5';

function preprocessInput(input: string): string {
  // Remove "typescript", backticks, and "(property)"
  input = input.replace(/```typescript|```/g, '').trim();
  input = input.replace(/\(property\)\s*/g, '');

  // Replace semicolons with commas
  input = input.replace(/;/g, ',');

  // Wrap property names with quotes
  input = input.replace(/\s*(\w+):/g, "'$1':");

  // Wrap 'x | y | z' patterns with quotes, handling cases with and without '|'
  input = input.replace(/:\s*([^,{}\n]+?)(,|\n|$)/g, (match, p1, p2) => {
    // Check for presence of '|' and replace accordingly
    if (p1.includes('|')) {
      // Replace '|' with ' | ' for proper spacing, ensuring single space
      p1 = p1.replace(/\s*\|\s*/g, ' | ');
      return `: "${p1.trim()}"${p2}`;
    } else {
      return `: '${p1.trim()}'${p2}`;
    }
  });

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
}

// Rest of the parsing logic goes here
