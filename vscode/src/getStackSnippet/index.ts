import * as vscode from 'vscode';

export default function getStackSnippet(document, stackPosition) {
  console.log('Stack Position: ', stackPosition);

  const endPosition = new vscode.Position(
    document.lineCount - 1,
    document.lineAt(document.lineCount - 1).range.end.character
  );
  const textFromPosition = document.getText(
    new vscode.Range(stackPosition, endPosition)
  );

  // Updated regular expression to match both 'stack()' and 'stack.something()' patterns, handling nested parentheses
  const stackCallRegex =
    /stack(\.[a-zA-Z0-9_]*)?\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/;

  const match = stackCallRegex.exec(textFromPosition);

  if (match && match[0]) {
    const stackSnippet = match[0].trim();
    console.log('Stack Snippet: ');
    console.log(stackSnippet);
    return stackSnippet;
  } else {
    return '';
  }
}
