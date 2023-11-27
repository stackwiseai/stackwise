export default function extractBrief(fileContent) {
  const stackwisePattern = /stack\(([\s\S]*?)\)/;
  const stackwiseMatch = fileContent.match(stackwisePattern);

  if (stackwiseMatch && stackwiseMatch[1]) {
    const argumentString = stackwiseMatch[1];

    // Enhanced regular expression to capture multiline strings with escaped quotes
    const quotePattern = /["'`]([\s\S]*?)["'`](?=\s*,|\s*\))/;
    const quotedMatch = argumentString.match(quotePattern);

    if (quotedMatch && quotedMatch[1]) {
      // Unescaping the captured string
      return quotedMatch[1].replace(/\\(['"])/g, '$1');
    }
  }

  return null;
}
