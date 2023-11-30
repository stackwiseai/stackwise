import * as vscode from 'vscode';
export default async function getHoverInformation(position): Promise<string> {
    if (!position) {
      return;
    }
    const editor = vscode.window.activeTextEditor;
    const hoverContents = []; // Array to store hover contents
    if (editor) {
      const document = editor.document;
      console.log('within hover position:', position);
      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider',
        document.uri,
        position
      );
  
      if (hovers && hovers.length > 0) {
        hovers.forEach((hover) => {
          hover.contents.forEach((content) => {
            if (typeof content === 'string') {
              hoverContents.push(content); // Store content in the array
            } else {
              // If it's a MarkdownString, log its value
              hoverContents.push(content.value); // Store content value in the array
            }
          });
        });
  
        if (hoverContents.length > 0) {
          return hoverContents.join('\n'); // Return all contents as a single string
          // Or, return the array itself if that's more useful: return hoverContents;
        }
      }
    }
  }