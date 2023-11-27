export function convertSingleQuotesToJsonFormat(str) {
  // Regular expression to match single quotes around keys and string values in JSON
  const singleQuoteRegex = /(\{|\,)\s*\'([^']+?)\'\s*:/g;

  // Replace single quotes around keys with double quotes
  let convertedString = str.replace(singleQuoteRegex, '$1"$2":');

  // Regular expression to match single quotes around string values
  const stringValueRegex = /:\s*\'([^']+?)\'/g;

  // Replace single quotes around string values with double quotes
  convertedString = convertedString.replace(stringValueRegex, ': "$1"');

  return convertedString;
}
