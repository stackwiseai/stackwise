import * as vscode from 'vscode';
import path from 'path';

export const directoryPath = path.join(
  vscode.workspace.rootPath,
  // TODO: pull from config file
  'stacks'
);

export const placeholderName = 'stackPlaceholder';
