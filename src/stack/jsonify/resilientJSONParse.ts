import JSON5 from 'json5';

export function resilientJSONParse(input) {
  // Remove trailing commas from objects and arrays
  const noTrailingCommas = input.replace(/,\s*([}\]])/g, '$1');

  // Add double quotes around unquoted property names
  const properlyQuoted = noTrailingCommas.replace(
    /([,{]\s*)(\w+)\s*:/g,
    '$1"$2":'
  );

  try {
    return JSON5.parse(properlyQuoted);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}
