interface OutputType {
  returnType: string;
  returnInterface: string;
  return: string | number | boolean | Record<string, any>;
}

export default function flattenOutput(
  outputJson: Record<string, any>
): OutputType {
  if (
    !outputJson ||
    typeof outputJson !== 'object' ||
    Object.keys(outputJson).length === 0
  ) {
    return {
      returnInterface: '',
      returnType: 'Promise<void>',
      return: 'return',
    };
  }

  const keys = Object.keys(outputJson);
  if (keys.length === 1 && !isObject(outputJson[keys[0]])) {
    return {
      returnInterface: '',
      returnType: `Promise<${outputJson[keys[0]]}>`,
      return: `return ${getDefaultReturnValue(outputJson[keys[0]])}`,
    };
  } else {
    const interfaceString = `interface OutputType {\n    ${keys
      .map(key => `${key}: ${formatType(outputJson[key])};`)
      .join('\n    ')}\n}`;
    const defaultReturnObject = formatReturnObject(
      keys.reduce((obj, key) => {
        obj[key] = isObject(outputJson[key])
          ? flattenOutput(outputJson[key]).return
          : getDefaultReturnValue(outputJson[key]);
        return obj;
      }, {}),
      false
    );

    return {
      returnInterface: interfaceString,
      returnType: 'Promise<OutputType>',
      return: defaultReturnObject,
    };
  }
}

function getDefaultReturnValue(type) {
  switch (type) {
    case 'number':
      return '0';
    case 'string':
      return '""';
    case 'boolean':
      return 'false';
    case 'string[]':
    case 'number[]':
      return '[]';
    case 'File':
    case 'HTMLElement':
      return 'null';
    default:
      return 'null';
  }
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function formatType(type) {
  if (isObject(type)) {
    const keys = Object.keys(type);
    return `{ ${keys.map(key => `${key}: ${type[key]}`).join('; ')}; }`;
  }
  return type;
}

function formatReturnObject(obj, isNested = false) {
  const formatted = Object.keys(obj)
    .map(key => {
      let value = obj[key];
      // If the value is a formatted return string for a nested object, remove the 'return' prefix
      if (value.startsWith('return {')) {
        value = value.slice(7).trim();
      }
      return `${key}: ${value}`;
    })
    .join(', ');

  return isNested ? `{ ${formatted} }` : `return { ${formatted} }`;
}
