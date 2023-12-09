export default function flattenInputJson(jsonInput) {
  if (
    !jsonInput ||
    typeof jsonInput !== 'object' ||
    Object.keys(jsonInput).length === 0
  ) {
    return '';
  }

  const flatten = (obj, parentKey = '') => {
    return Object.keys(obj)
      .map(key => {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key];

        // Special case for the key 'image'
        if (newKey === 'image') {
          return `${newKey}: File`;
        }

        // Handle nested objects
        if (typeof value === 'object' && !Array.isArray(value)) {
          return `${newKey}: { ${flatten(value)} }`;
        }

        // Default case for other types
        return `${newKey}: ${value}`;
      })
      .join(', ');
  };

  return flatten(jsonInput).replace(/\.\w+: /g, ': ');
}
