import * as vscode from "vscode";
export default function getStackSnippet(document, stackPosition) {
  // Log the stackPosition for debugging
  console.log("Stack Position: ", stackPosition);

  // Get the range from stackPosition to the end of the document
  const endPosition = new vscode.Position(
    document.lineCount - 1,
    document.lineAt(document.lineCount - 1).range.end.character
  );
  const textFromPosition = document.getText(
    new vscode.Range(stackPosition, endPosition)
  );

  // Log the beginning of textFromPosition for debugging
  // console.log("Text From Position (first 20 chars): ", textFromPosition.substring(0, 500));

  // Regular expression to match the 'stack(...)' call, handling nested parentheses
  const stackCallRegex = /stack\(([^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/;

  // Find the first match
  const match = stackCallRegex.exec(textFromPosition);

  if (match && match[0]) {
    // Return the entire 'stack(...)' call
    const stackSnippet = match[0].trim();
    console.log("Stack Snippet: ");
    console.log(stackSnippet);
    return stackSnippet;
  } else {
    // Return an empty string or null if no match is found
    return "";
  }
}
