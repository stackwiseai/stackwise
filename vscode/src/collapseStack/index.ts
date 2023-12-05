import * as vscode from "vscode";
export default function replaceStackSnippetWithInjectFunction(
  stackSnippet,
  document,
  injectedFunction
) {
  const edit = new vscode.WorkspaceEdit();

  // Find the range of the stackSnippet in the document
  const documentText = document.getText();
  const snippetIndex = documentText.indexOf(stackSnippet);

  if (snippetIndex !== -1) {
    // If the snippet is found, calculate its start and end positions
    const startPosition = document.positionAt(snippetIndex);
    const endPosition = document.positionAt(snippetIndex + stackSnippet.length);

    // Create a range using the start and end positions
    const range = new vscode.Range(startPosition, endPosition);

    // Replace the text in the range with "Hello World"
    edit.replace(document.uri, range, injectedFunction);

    // Apply the edit
    vscode.workspace.applyEdit(edit).then((success) => {
      if (success) {
        console.log("Stack snippet replaced with the injected function.");
      } else {
        console.log("Failed to replace stack snippet.");
      }
    });
  } else {
    console.log("Stack snippet not found in the document.");
  }
}
