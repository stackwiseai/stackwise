import * as vscode from 'vscode';
import PositionObject from '../positionObject';
import getHoverInformation from '../hover';

export default async function findStackPositions(
  document
): Promise<PositionObject[]> {
  const documentContent = document.getText();
  const lines = documentContent.split('\n');

  let positions = []; // Array to store positions

  for (let i = 0; i < lines.length; i++) {
    let stackIndex = lines[i].indexOf('stack(');
    while (stackIndex >= 0) {
      const position = new vscode.Position(i, stackIndex);
      const typeInfo = await getHoverInformation(position);
      if (typeInfo) {
        let positionObject: PositionObject = {
          stackPosition: position,
        };

        console.log('stackPosition added:', positionObject.stackPosition);

        // Function to find the next occurrence of a keyword after a given index
        function findNextKeyword(keyword, startIndex, currentLine) {
          for (let j = startIndex; j < lines.length; j++) {
            // console.log(`find next keyword: ${keyword} in line ${lines[j]}`);
            let keywordIndex = lines[j].indexOf(keyword);
            if (keywordIndex >= 0) {
              return new vscode.Position(j, keywordIndex + 1);
            }
          }
          return null;
        }

        // Find the position of 'in:'
        let inputPosition = findNextKeyword('input', i, stackIndex);
        if (inputPosition) {
          positionObject['inputPosition'] = inputPosition;
          console.log('inputPosition added:', positionObject.inputPosition);
        }

        // Find the position of 'out:'
        let outPosition = findNextKeyword(
          'out:',
          i,
          stackIndex
        );
        if (outPosition) {
          positionObject['outPosition'] = outPosition;
          console.log(
            'outPosition added:',
            positionObject.outPosition
          );
        }

        positions.push(positionObject);
        console.log('Position object added:', positionObject);
      }

      // Find next occurrence of 'stack(' in the same line
      stackIndex = lines[i].indexOf('stack(', stackIndex + 1);
    }
  }

  console.log('Final positions array:', positions);
  return positions; // Return array of positions
}
