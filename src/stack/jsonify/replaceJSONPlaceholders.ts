export default function replaceJSONPlaceholders(jsonLikeString) {
  // Regular expression to match placeholders after a colon and before an optional comma or closing bracket/brace
  const regex = /:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=[,}\]])/g;

  // Replace the matched placeholders in-place
  return jsonLikeString.replace(regex, (match, p1) => `: "${p1}@var"`);
}