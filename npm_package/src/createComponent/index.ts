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

  // need to add ? to make it not required
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
  const outputKeys = Object.keys(output);
  if (output === 'null') {
    outputContent = 'No output for this stack';
  } else if (outputKeys.length === 1) {
    const key = outputKeys[0];
    const type = output[key];
    switch (type) {
      case 'string':
        outputContent += `<p>{value}</p>\n`;
        break;
      case 'number':
        outputContent += `<div>{value}</div>\n`;
        break;
      case 'string[]':
        outputContent += `<div>{value.map((item, i) => <p key={i}>{item}</p>)}</div>\n`;
        break;
      case 'boolean':
        outputContent += `<input type="checkbox" checked={value} readonly />\n`;
        break;
      case 'boolean[]':
        outputContent += `<div>{value.map((item, i) => <input type="checkbox" key={i} checked={item} readonly />)}</div>\n`;
        break;
      case 'number[]':
        outputContent += `<div>{value.map((item, i) => <div key={i}>{item}</div>)}</div>\n`;
        break;
      case 'image':
        outputContent += `<img src={value} alt="Image" />\n`;
        break;
      case 'audio':
        outputContent += `<audio src={value} controls></audio>\n`;
        break;
      case 'video':
        outputContent += `<video src={value} controls></video>\n`;
        break;
      case 'file':
        outputContent += `<a href={value} download>Download File</a>\n`;
        break;
      default:
        break;
    }
  } else {
    for (const key in output) {
      const type = output[key];
      const label = formatLabel(key);
      switch (type) {
        case 'string':
          outputContent += `<p>{value.${key}}</p>\n`;
          break;
        case 'number':
          outputContent += `<div>{value.${key}}</div>\n`;
          break;
        case 'string[]':
          outputContent += `<div>{value.${key}.map((item, i) => <p key={i}>{item}</p>)}</div>\n`;
          break;
        case 'boolean[]':
          outputContent += `<div>{value.${key}.map((item, i) => <div key={i}>\n<label htmlFor="${key}">${label}{' ' + i}</label>\n<input type="checkbox" name="${key}" checked={item} readonly />\n</div>)}</div>\n`;
          break;
        case 'number[]':
          outputContent += `<div>{value.${key}.map((item, i) => <div key={i}>{item}</div>)}</div>\n`;
          break;
        case 'boolean':
          outputContent += `<label htmlFor="${key}">${label}</label>\n<input type="checkbox" name="${key}" checked={value.${key}} readonly />\n`;
          break;
        case 'image':
          outputContent += `<img src={value.${key}} alt="${label}" />\n`;
          break;
        case 'audio':
          outputContent += `<audio src={value.${key}} controls></audio>\n`;
          break;
        case 'video':
          outputContent += `<video src={value.${key}} controls></video>\n`;
          break;
        case 'file':
          outputContent += `<a href={value.${key}} download>${formatLabel(
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
