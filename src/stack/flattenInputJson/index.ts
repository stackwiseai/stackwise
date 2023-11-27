export default function flattenInputJson(jsonInput) {
  return Object.entries(jsonInput)
    .map(([key, value]) => {
      // Check if the value is an object (and not null)
      if (typeof value === 'object') {
        if (Object.keys(value).length === 1) {
          return `${key}: ${value[Object.keys(value)[0]]}`;
        }
        if (value !== null) {
          return `${key}: any`;
        }
      }
      
      return `${key}: ${value}`;
    })
    .join(', ');
}
