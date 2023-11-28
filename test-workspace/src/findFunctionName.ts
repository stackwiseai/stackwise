/**
 * Finds the first occurrence of a pattern FUNCTION(STUFF) in a string and returns FUNCTION.
 * @param str - The string to search in.
 * @returns The function name if found, otherwise null.
 */
export function findFunctionName(str: string): string | null {
    const pattern: RegExp = /(\w+)\s*\(\s*(.*?)\s*\)/s;
    const match: RegExpExecArray | null = pattern.exec(str);

    return match ? match[1] : null;
}
