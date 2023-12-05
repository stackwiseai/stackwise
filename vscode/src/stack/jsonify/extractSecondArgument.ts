export function extractSecondArgument(inputString) {
  // Using a non-greedy regex to capture everything between the first comma and the closing parenthesis
  const match = inputString.match(/,\s*([\s\S]*?)\s*\)\s*$/);
  return match ? match[1] : null;
}
