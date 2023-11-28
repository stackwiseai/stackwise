import { convertSingleQuotesToJsonFormat } from './convertSingleQuotesToJsonFormat';
import extractInputFromObject from './extractInputFromObject';
import { extractSecondArgument } from './extractSecondArgument';
import handleWeirdObject from './handleWeirdObject';
import removeTrailingCommas from './removeTrailingCommas';
import replaceJSONPlaceholders from './replaceJSONPlaceholders';
import { resilientJSONParse } from './resilientJSONParse';
import transformJSON from './transformJSON';

export default function jsonifyString(inputString) {
  // Step 1: Get all placeholders
  const noTrailingCommas = removeTrailingCommas(inputString);
  console.log('noTrailingCommas');
  console.log(noTrailingCommas);
  const convertedString = convertSingleQuotesToJsonFormat(noTrailingCommas);
  console.log('convertedString');
  console.log(convertedString);
  // Step 2: Extract the second argument (JSON-like string)
  // const weirdObjectRemoved = handleWeirdObject(noTrailingCommas);
  // console.log('weirdObjectRemoved');
  // console.log(weirdObjectRemoved);
  const jsonLikeString = extractSecondArgument(convertedString);
  if (!jsonLikeString) {
    console.error('No second argument found.');
    return null;
  }
  console.log('jsonLikeString');
  console.log(jsonLikeString);
  const inputOnly = extractInputFromObject(jsonLikeString);
  console.log('inputOnly');
  console.log(inputOnly);
  const inputOnlyWithoutWeirdObject = handleWeirdObject(inputOnly);
  console.log('inputOnlyWithoutWeirdObject');
  console.log(inputOnlyWithoutWeirdObject);
  const modifiedString = replaceJSONPlaceholders(inputOnlyWithoutWeirdObject);

  console.log('modifiedString');
  console.log(modifiedString);

  // Step 3: Convert to JSON
  let json;
  try {
    json = resilientJSONParse(modifiedString);
  } catch (error) {
    return null;
  }
  let resultWithAtVarSuffix;

  if (typeof json === 'object') {
    resultWithAtVarSuffix = Object.values(json).map(element => 
      typeof element === 'object' || typeof element === 'number' ? JSON.stringify(element) : `"${element}"`
    ).join(', ');
  } else {
    resultWithAtVarSuffix = `"${json}"`;
  }


  // Step 5: Remove "@var" suffix
  const withoutSuffix = resultWithAtVarSuffix.replace(/"\w+@var"/g, (match) => {
    return match.slice(1, -5);
  });


  const inputJson = transformJSON(json);
    // merge two jsons

  return {input: inputJson.input, inputValues: withoutSuffix};
}