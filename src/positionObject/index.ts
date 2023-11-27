import * as vscode from 'vscode';

export default interface PositionObject {
    stackPosition: vscode.Position;
    inputPosition?: vscode.Position;
    outExamplePosition?: vscode.Position;
}
