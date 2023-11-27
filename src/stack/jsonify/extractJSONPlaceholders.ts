export function extractJSONPlaceholders(jsonString) {
  const regex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b(?=[,\s]*[}\]])/g;
  return jsonString.match(regex) || [];
}
