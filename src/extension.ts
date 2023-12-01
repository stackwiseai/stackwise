import { PostHog } from 'posthog-node';

import * as vscode from 'vscode';
import findStackPositions from './findStackPositions';
import getHoverInformation from './getHoverInformation';
import getStackSnippet from './getStackSnippet';
import trackStackFileRenames from './trackStackFileRenames';
import buildOrUpdateStack from './buildOrUpdateStack';
import convertTypescriptToJson from './convertTypescriptToJson';
import containsStackOpening from './containsStack';
import stack from './stack';
require('dotenv').config();
const client = new PostHog(
  'phc_FV6HCDSAT1vGQQvOAd0DdSBEwUVYM0DfCIbDbZrEjY2',
  { host: 'https://app.posthog.com' }
);


// You must first call storage.init or storage.initSync
// Set the storage file to be a hidden file, e.g., '.llmCache.json'

export function activate(context: vscode.ExtensionContext) {
  trackStackFileRenames(context);
  let disposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
      
    // Send queued events immediately. Use for example in a serverless environment
    // where the program may terminate before everything is sent
    
    if (
      document.languageId !== 'typescript' &&
      document.languageId !== 'typescriptreact'
    ) {
      return;
    }
    if (containsStackOpening(document.getText())) {
      client.capture({
        distinctId: 'test-id',
        event: 'stack saved',
        properties: {
          contentStack: document.getText()
        }
        });
    }
    ;
    client.flush();
    const stackPositions = await findStackPositions(document);
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      for (const stackPosition of stackPositions) {
        const inputInfo = await getHoverInformation(
          stackPosition.inputPosition
        );

        console.log(`inputInfo`);
        console.log(inputInfo);

        let inputJSON = convertTypescriptToJson(inputInfo);
        if (Object.keys(inputJSON).length === 0) {
          inputJSON = {
            in: null
          };
        }

        console.log(`inputJSON after calling convertTypescriptToJson`);
        console.log(inputJSON);
        
        const outputInfo = await getHoverInformation(stackPosition.outPosition);
       
        console.log(`inputInfo`);
        console.log(outputInfo);

        let outputTypeJSON = convertTypescriptToJson(outputInfo);
        if (Object.keys(outputTypeJSON).length === 0) {
          outputTypeJSON = {
            out: null
          };
        }
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
          stackPosition.integration,
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
