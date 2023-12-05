export default function extractBrief(fileContent) {
  console.log('fileContent', fileContent);
  // Updated regular expression to match 'stack()' and 'stack.something(' patterns
  const stackwisePattern = /stack(\.[a-zA-Z0-9_]*)?\(([\s\S]*?)\)/;
  const stackwiseMatch = fileContent.match(stackwisePattern);

  console.log('stackwiseMatch', stackwiseMatch);

  if (stackwiseMatch && stackwiseMatch[2]) {
    const argumentString = stackwiseMatch[2];

    console.log('argumentString', argumentString);

    // Enhanced regular expression to capture multiline strings with escaped quotes
    // Modified to match strings even if they are not followed by a comma or closing parenthesis
    const quotePattern = /["'`]([\s\S]*?)["'`]\s*(,|\)|$)/;
    const quotedMatch = argumentString.match(quotePattern);

    console.log('quotedMatch', quotedMatch);

    if (quotedMatch && quotedMatch[1]) {
      // Unescaping the captured string
      console.log('quotedMatch[1]', quotedMatch[1]);
      return quotedMatch[1].replace(/\\(['"])/g, '$1');
    }
  }

  return null;
}
