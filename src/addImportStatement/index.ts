import * as vscode from 'vscode';
import path from 'path';

export default function addImportStatement(
  methodName: string,
  document: vscode.TextDocument,
  integration: string
) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace is open.');
    return;
  }

  // Calculate the relative path for the import
  const relativePath = calculateRelativePath(
    document.uri,
    workspaceFolders[0].uri
  );

  // Determine the import path based on integration
  const importPath =
    integration === 'generic'
      ? `${relativePath}stacks/${methodName}`
      : `${relativePath}stacks/${integration}/${methodName}`;

  const importStatement = `import ${methodName} from '${importPath}';\n`;

  const firstLine = document.lineAt(0).text;
  let insertPosition;

  // Check if the first line contains 'use client' or 'use server'
  if (firstLine.includes('use client') || firstLine.includes('use server')) {
    // Insert on the second line
    insertPosition = new vscode.Position(1, 0);
  } else {
    // Otherwise, insert at the top of the document
    insertPosition = new vscode.Position(0, 0);
  }

  // Insert the import statement at the determined position
  const edit = new vscode.WorkspaceEdit();
  edit.insert(document.uri, insertPosition, importStatement);
  vscode.workspace.applyEdit(edit).then(() => {
    saveDocument(document);
  });
}

function calculateRelativePath(
  documentUri: vscode.Uri,
  workspaceUri: vscode.Uri
): string {
  // Normalize paths to handle different file systems
  let documentPath = path.normalize(documentUri.fsPath).split(path.sep);
  let workspacePath = path.normalize(workspaceUri.fsPath).split(path.sep);

  // Special handling for Windows drive letters
  if (process.platform === 'win32') {
    documentPath[0] = documentPath[0].toLowerCase();
    workspacePath[0] = workspacePath[0].toLowerCase();
  }

  // Remove common path segments
  while (
    documentPath.length > 0 &&
    workspacePath.length > 0 &&
    documentPath[0].toLowerCase() === workspacePath[0].toLowerCase()
  ) {
    documentPath.shift();
    workspacePath.shift();
  }

  // Replace each remaining segment in the document path with '../'
  let relativePath = '../'.repeat(documentPath.length - 1); // -1 because we don't need to count the file itself

  // Handle edge case when relative path is empty, it means document is in the workspace root
  if (!relativePath) {
    relativePath = './';
  }

  return relativePath;
}

function saveDocument(document: vscode.TextDocument) {
  if (document.isDirty) {
    document.save().then(
      () => {
        vscode.window.showInformationMessage('Stack created successfully 🎉');
      },
      (err) => {
        vscode.window.showErrorMessage(`Error saving document: ${err}`);
      }
    );
  }
}
