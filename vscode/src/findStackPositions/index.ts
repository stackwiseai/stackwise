import * as vscode from 'vscode';
import PositionObject from '../positionObject';
import getHoverInformation from '../getHoverInformation';

export default async function findStackPositions(
  document
): Promise<PositionObject[]> {
  const documentContent = document.getText();
  const lines = documentContent.split('\n');

  let positions = []; // Array to store positions
  let integration = null;

  for (let i = 0; i < lines.length; i++) {
    let stackIndex;
    let regex = /stack(\.[a-zA-Z0-9_]*)?\(/;

    // Function to update stackIndex for the next occurrence of 'stack' or 'stack.anythinghere('
    function updateStackIndex(currentIndex) {
      // First, try to find 'stack.anythinghere(' pattern
      let match = lines[i].slice(currentIndex).match(regex);
      if (match) {
        // Adjust index relative to the current slice of the line
        integration = match[1] ? match[1].substring(1) : match[1];
        console.log(`integration: ${integration}`);
        return currentIndex + match.index;
      }

      // If not found, look for 'stack(' pattern
      let nextIndex = lines[i].indexOf('stack(', currentIndex + 1);
      return nextIndex >= 0 ? nextIndex : -1;
    }

    stackIndex = updateStackIndex(0);

    while (stackIndex >= 0) {
      console.log('stackIndex:', stackIndex);
      const position = new vscode.Position(i, stackIndex);

      const typeInfo = await getHoverInformation(position);
      if (typeInfo) {
        let positionObject: PositionObject = {
          stackPosition: position,
          integration,
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
        let inputPosition = findNextKeyword('in:', i, stackIndex);
        if (inputPosition) {
          positionObject['inputPosition'] = inputPosition;
          console.log('inputPosition added:', positionObject.inputPosition);
        }

        // Find the position of 'out:'
        let outPosition = findNextKeyword('out:', i, stackIndex);
        if (outPosition) {
          positionObject['outPosition'] = outPosition;
          console.log('outPosition added:', positionObject.outPosition);
        }

        positions.push(positionObject);
        console.log('Position object added:', positionObject);
      }

      // Find next occurrence of 'stack' in the same line
      stackIndex = updateStackIndex(stackIndex + 1);
    }
  }

  console.log('Final positions array:', positions);
  return positions; // Return array of positions
}
