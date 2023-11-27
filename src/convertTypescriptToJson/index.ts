export default function convertTypescriptToJson(input: string): any {
  // Regular expression to match different structures of TypeScript input, including array types
  if (!input) {return {};}
  input = addSingleQuotes(input);

  const regex = /(\w+)\s*:\s*{\s*(\w+)\s*:\s*([\w\[\]]+);/g;
  const regexAlt = /'(.*?)':\s*([\w\[\]]+)/g;
  let match;
  const result = {};

  // First pattern
  while ((match = regex.exec(input)) !== null) {
    const [, outerKey, innerKey, type] = match;
    if (!result[outerKey]) {
      result[outerKey] = {};
    }
    result[outerKey][innerKey] = type;
  }

  // Second pattern
  while ((match = regexAlt.exec(input)) !== null) {
    const [, key, type] = match;
    result[key] = type;
  }

  return result;
}

function addSingleQuotes(str) {
  return str.replace(/\(property\)\s*(\w+):/g, "(property) '$1':");
}