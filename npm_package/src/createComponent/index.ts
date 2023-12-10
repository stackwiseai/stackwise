interface OutputType {
  inputContent: string;
  outputContent: string;
}

/**
 * Formats a string to include spaces before capital letters.
 * @param {string} str - The string to format.
 * @returns {string} - The formatted string.
 */
function formatLabel(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
}

export default function createComponent(
  ioData: Record<string, any>
): OutputType {
  let inputContent = '';
  let outputContent = '';

  // Process input
  const input = ioData.input;
  if (input === 'null') {
    inputContent = 'No input for this stack';
  } else {
    for (const key in input) {
      const type = input[key];
      const label = formatLabel(key);
      switch (type) {
        case 'number':
          inputContent += `<input type="number" name="${key}" placeholder="Enter ${key}" required />\n`;
          break;
        case 'string':
          inputContent += `<input type="text" name="${key}" placeholder="Enter ${key}" required />\n`;
          break;
        case 'boolean':
          inputContent += `<label htmlFor="${key}">${label}</label>\n<input type="checkbox" name="${key}" required />\n`;
          break;
        case 'date':
          inputContent += `<label htmlFor="${key}">Date</label>\n<input type="date" name="${key}" required />\n`;
          break;
        case 'email':
          inputContent += `<input type="email" name="${key}" placeholder="Enter ${key}" required />\n`;
          break;
        case 'password':
          inputContent += `<input type="password" name="${key}" placeholder="Enter ${key}" required />\n`;
          break;
        case 'image':
        case 'audio':
        case 'video':
          inputContent += `<label htmlFor="${key}">${label}</label>\n<input type="file" name="${key}" accept="${type}/*" required />\n`;
          break;
        default:
          if (Array.isArray(type)) {
            inputContent += `<label htmlFor="${key}">${label}</label>\n<select name="${key}" required>\n`;
            type.forEach(option => {
              inputContent += `  <option value="${option}">${option}</option>\n`;
            });
            inputContent += '</select>\n';
          }
          break;
      }
    }
  }

  // Process output
  const output = ioData.output;
  if (output === 'null') {
    outputContent = 'No output for this stack';
  } else {
    for (const key in output) {
      const type = output[key];
      const label = formatLabel(key);
      switch (type) {
        case 'string':
          outputContent += `<p>{state.${key}}</p>\n`;
          break;
        case 'number':
          outputContent += `<div>{state.${key}}</div>\n`;
          break;
        case 'string[]':
          outputContent += `<div>{state.${key}.map((item, i) => <p key={i}>{item}</p>)}</div>\n`;
          break;
        case 'boolean[]':
          outputContent += `<div>{state.${key}.map((item, i) => <div key={i}>\n<label htmlFor="${key}">${label}{' ' + i}</label>\n<input type="checkbox" name="${key}" checked={item} readonly />\n</div>)}</div>\n`;
          break;
        case 'number[]':
          outputContent += `<div>{state.${key}.map((item, i) => <div key={i}>{item}</div>)}</div>\n`;
          break;
        case 'boolean':
          outputContent += `<label htmlFor="${key}">${label}</label>\n<input type="checkbox" name="${key}" checked={state.${key}} readonly />\n`;
          break;
        case 'image':
          outputContent += `<img src={state.${key}} alt="${label}" />\n`;
          break;
        case 'audio':
          outputContent += `<audio src={state.${key}} controls></audio>\n`;
          break;
        case 'video':
          outputContent += `<video src={state.${key}} controls></video>\n`;
          break;
        case 'file':
          outputContent += `<a href={state.${key}} download>${formatLabel(
            key
          )}</a>\n`;
          break;
        default:
          break;
      }
    }
  }

  return {
    inputContent: inputContent.trim(),
    outputContent: outputContent.trim(),
  };
}
