import { convertSingleQuotesToJsonFormat } from './convertSingleQuotesToJsonFormat';
import { extractJSONPlaceholders } from './extractJSONPlaceholders';
import { extractSecondArgument } from './extractSecondArgument';
import { resilientJSONParse } from './resilientJSONParse';
import transformJSON from './transformJSON';


// use import not require


export default function jsonifyString(inputString) {
  // Step 1: Get all placeholders
  const convertedString = convertSingleQuotesToJsonFormat(inputString);

  // Step 2: Extract the second argument (JSON-like string)
  const jsonPart = extractSecondArgument(convertedString);
  const jsonLikeString = extractSecondArgument(inputString);
  if (!jsonLikeString) {
    console.error('No second argument found.');
    return null;
  }

  const placeholders = extractJSONPlaceholders(jsonLikeString);

  // Step 2: Replace placeholders
  let modifiedString = jsonLikeString;
  placeholders.forEach((placeholder) => {
    const replacement = `"${placeholder}@var"`;
    const regex = new RegExp(`\\b${placeholder}\\b`, 'g');
    modifiedString = modifiedString.replace(regex, replacement);
  });

  // Step 3: Convert to JSON
  let json;
  try {
    json = resilientJSONParse(modifiedString);
  } catch (error) {
    return null;
  }
  
  return transformJSON(json);
}