import * as vscode from 'vscode';

export default interface PositionObject {
  stackPosition: vscode.Position;
  integration: string | null;
  inputPosition?: vscode.Position;
  outPosition?: vscode.Position;
}
