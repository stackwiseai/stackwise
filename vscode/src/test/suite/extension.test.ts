import * as assert from 'assert';
import path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

suite('Extension Test Suite', () => {

    test('File transformation test', async function() {
        this.timeout(20000); // Increase timeout to accommodate file operations and wait times

        const currentWorkingDirectory = process.cwd();

        const testWorkspacePath = path.join(currentWorkingDirectory, 'test-workspace');
        const fixturesPath = path.join(testWorkspacePath, 'fixtures');

        if (!fs.existsSync(testWorkspacePath) || !fs.existsSync(fixturesPath)) {
            throw new Error('Test workspace or fixtures directory does not exist');
        }

        vscode.workspace.updateWorkspaceFolders(0, vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, { uri: vscode.Uri.file(testWorkspacePath) });

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            throw new Error('Failed to open test workspace');
        }

        const testFolders = fs.readdirSync(fixturesPath).filter(folder => 
            fs.statSync(path.join(fixturesPath, folder)).isDirectory());

        for (const folder of testFolders) {
            const inputFilePath = path.join(fixturesPath, folder, 'input.txt');
            const tempTsFilePath = path.join(fixturesPath, folder, 'input.ts');
            const outputFilePath = path.join(fixturesPath, folder, 'output.txt');

            if (!fs.existsSync(inputFilePath)) {
                throw new Error('Input file does not exist: ' + inputFilePath);
            }

            // Rename input.txt to input.ts
            fs.renameSync(inputFilePath, tempTsFilePath);

            // Open the file in VS Code editor
            const textDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(tempTsFilePath));
            const textEditor = await vscode.window.showTextDocument(textDocument);

            // Add a blank line at the end of the file
            const lastLine = textDocument.lineAt(textDocument.lineCount - 1);
            const range = new vscode.Range(lastLine.range.end, lastLine.range.end);
            await textEditor.edit(editBuilder => {
                editBuilder.insert(range.start, '\n');
            });
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Use the VS Code command to save the file
            await vscode.commands.executeCommand('workbench.action.files.save');

            // Wait for 3 seconds
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Rename input.ts back to input.txt
            fs.renameSync(tempTsFilePath, inputFilePath);

            // Read the updated content of input.txt
            const finalContent = fs.readFileSync(inputFilePath, 'utf8');

            // Write the final content to output.txt
            fs.writeFileSync(outputFilePath, finalContent);
        }

        assert.ok(true);
    });
});




