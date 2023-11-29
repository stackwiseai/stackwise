import * as vscode from 'vscode';
import findStackPositions from './findStackPositions';
import getHoverInformation from './hover';
import getStackSnippet from './getStackSnippet';
import trackStackFileRenames from './trackStackFileRenames';
import buildOrUpdateStack from './buildOrUpdateStack';
import convertTypescriptToJson from './convertTypescriptToJson';
require('dotenv').config();

// You must first call storage.init or storage.initSync
// Set the storage file to be a hidden file, e.g., '.llmCache.json'

export function activate(context: vscode.ExtensionContext) {
  trackStackFileRenames(context);
  let disposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (
      document.languageId !== 'typescript' &&
      document.languageId !== 'typescriptreact'
    ) {
      return;
    }

    function cannotFindStack(diagnostics, messageToFind) {
      return diagnostics.some((diagnostic) =>
        diagnostic.message.includes(messageToFind)
      );
    }
    const stackPositions = await findStackPositions(document);
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      for (const stackPosition of stackPositions) {
        const inputInfo = await getHoverInformation(
          stackPosition.inputPosition
        );

        console.log(`inputInfo`);
        console.log(inputInfo);

        const inputJSON = convertTypescriptToJson(inputInfo);
        console.log(`inputJSON after calling convertTypescriptToJson`);
        console.log(inputJSON);

        const outputInfo = await getHoverInformation(
          stackPosition.outExamplePosition
        );

        console.log(`inputInfo`);
        console.log(outputInfo);

        const outputTypeJSON = convertTypescriptToJson(outputInfo);
        console.log(`outputTypeJSON`);
        console.log(outputTypeJSON);

        const stackSnippet = getStackSnippet(
          document,
          stackPosition.stackPosition
        );
        // If typeInfo is present, call buildOrUpdateStack
        buildOrUpdateStack(
          stackSnippet,
          stackPosition.stackPosition,
          inputJSON,
          outputTypeJSON,
          document
        );
      }
    }
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
