import * as vscode from 'vscode';

export default interface PositionObject {
    stackPosition: vscode.Position;
    inputPosition?: vscode.Position;
    outPosition?: vscode.Position;
}
