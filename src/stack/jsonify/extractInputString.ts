import { convertSingleQuotesToJsonFormat } from './convertSingleQuotesToJsonFormat';
import { extractJSONPlaceholders } from './extractJSONPlaceholders';
import { extractSecondArgument } from './extractSecondArgument';
import { resilientJSONParse } from './resilientJSONParse';

export default function extractInputString(inputString) {
  // Early termination if the input is a simple string

  // Step 1: Convert single quotes to JSON format
  const convertedString = convertSingleQuotesToJsonFormat(inputString);

  // Step 2: Extract the second argument (JSON-like string)
  const jsonLikeString = extractSecondArgument(convertedString);
  if (!jsonLikeString) {
    console.error('No second argument found.');
    return null;
  }

  // Special handling for direct string input
  if (jsonLikeString.startsWith('"') && jsonLikeString.endsWith('"')) {
    return jsonLikeString;
  }

  // Extract placeholders
  const placeholders = extractJSONPlaceholders(jsonLikeString);

  // Step 3: Replace placeholders
  let modifiedString = jsonLikeString;
  placeholders.forEach((placeholder) => {
    const replacement = `"${placeholder}@var"`;
    const regex = new RegExp(`\\b${placeholder}\\b`, 'g');
    modifiedString = modifiedString.replace(regex, replacement);
  });

  // Step 4: Convert to JSON
  let json;
  try {
    json = resilientJSONParse(modifiedString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
  console.log('json:', json);
  let resultWithAtVarSuffix;

  if (typeof json.input === 'object') {
    resultWithAtVarSuffix = Object.values(json.input).map(element => 
      typeof element === 'object' || typeof element === 'number' ? JSON.stringify(element) : `"${element}"`
    ).join(', ');
  } else {
    resultWithAtVarSuffix = `"${json.input}"`;
  }


  // Step 5: Remove "@var" suffix
  const withoutSuffix = resultWithAtVarSuffix.replace(/"\w+@var"/g, (match) => {
    return match.slice(1, -5);
  });

  return withoutSuffix; 
}
