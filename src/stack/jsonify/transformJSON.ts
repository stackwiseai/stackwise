export default function transformJSON(input) {
  // Stringify the input object
  let inputString = JSON.stringify(input);

  // Use a regular expression to replace any string ending with "@var"
  // The replacement removes the quotes and the "@var" suffix
  inputString = inputString.replace(/"\w+@var"/g, (match) => {
    // Remove the quotes and "@var" suffix
    return match.slice(1, -5);
  });

  // Return the new object with the modified input string and original outExample
  return { input: inputString };
}
