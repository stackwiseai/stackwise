export default function removeTrailingCommas(inputString) {
  // This regex finds trailing commas in objects and arrays
  const regex = /,(?=\s*[}\]])/g;
  return inputString.replace(regex, '');
}
