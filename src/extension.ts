import * as vscode from 'vscode';
// import chokidar from 'chokidar';
import stackRegistry from './stack/registry';
import findStackPositions from './findStackPositions';
import getHoverInformation from './hover';
import getStackSnippet from './getStackSnippet';
import buildOrUpdateStack from './buildOrUpdateStack';
import ensureDirectoryExistence from './manageStackFolder';
import convertTypescriptToJson from './convertTypescriptToJson';
require('dotenv').config();

// You must first call storage.init or storage.initSync
// Set the storage file to be a hidden file, e.g., '.llmCache.json'

export function activate(context: vscode.ExtensionContext) {
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
          stackPosition.outPosition
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

// function trackStackFileRenames(context: vscode.ExtensionContext) {
//   const addedFiles = new Map();

//   // Initialize Chokidar watcher. This tracks file renames and deletions.
//   const watcher = chokidar.watch(directoryPath, {
//     ignored: /^\./,
//     persistent: true,
//   });

//   watcher.on('all', (event, filePath) => {
//     const fileName = path.basename(filePath);

//     if (event === 'add') {
//       // Temporarily record added file with a timestamp
//       addedFiles.set(fileName, Date.now());
//     } else if (event === 'unlink') {
//       // Check if there's a recently added file that matches
//       for (let [newFile, time] of addedFiles) {
//         if (Date.now() - time < 200) {
//           // 0.5 seconds threshold
//           // stackRegistry.loadRegistry();
//           // if (stackRegistry.nameExists(newFile)) {
//           //   stackRegistry.update(newFile, newFile);
//           // }

//           console.log(`File renamed from ${fileName} to ${newFile}`);
//           addedFiles.delete(newFile);

//           return;
//         }
//       }
//       console.log(`File deleted: ${filePath}`);
//     }
//   });

//   context.subscriptions.push({
//     dispose: () => {
//       watcher.close();
//     },
//   });
// }

export function deactivate() {}
