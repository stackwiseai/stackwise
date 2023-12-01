export default function containsStackOpening(text: string): boolean {
    const stackPattern = /(^|\W)stack\(/;
    return stackPattern.test(text);
}
