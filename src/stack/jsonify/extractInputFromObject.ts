export default function extractInputFromObject(inputString: string): string {
  let start_index = inputString.indexOf('"in":') + 5;
  if (start_index === 4) { 
      start_index = inputString.indexOf('in:') + 3;
  }

  while (inputString[start_index] === ' ') {
    start_index++;
  }

  if (inputString[start_index] !== '{' && inputString[start_index] !== '[') {
    let end_index = start_index;
    let inQuotes = inputString[start_index] === '"';

    for (let i = start_index + 1; i < inputString.length; i++) {
      if (inQuotes) {
        if (inputString[i] === '"' && inputString[i - 1] !== '\\') {
          end_index = i + 1;
          break;
        }
      } else {
        if (inputString[i] === ',' || inputString[i] === ' ' || inputString[i] === '\n') {
          end_index = i;
          break;
        }
      }
    }
    return inputString.substring(start_index, end_index).trim();
  }

  let brace_count = 0;
  let bracket_count = 0;
  let end_index = start_index;

  for (let i = start_index; i < inputString.length; i++) {
    const char = inputString[i];
    if (char === '{' || char === '[') {
      if (char === '{') {
          brace_count++;
      } else {
          bracket_count++;
      }
    } else if (char === '}' || char === ']') {
      if (char === '}') {
          brace_count--;
      } else {
          bracket_count--;
      }

      if (brace_count === 0 && bracket_count === 0) {
        end_index = i + 1;
        break;
      }
    }
  }

  return inputString.substring(start_index, end_index).trim();
}
