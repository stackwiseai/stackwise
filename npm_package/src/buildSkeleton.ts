interface OutputType {
  functionId: string;
  documentContent: string;
  functionExists: boolean;
  inputString: string;
  briefSkeleton: string;
  functionAndOutputSkeleton: string;
  inputValues: string;
}

/**
 * Creates a skeleton function from a json
 * @param {Record<string, unknown>} json - The JSON object
 * @returns {string} Skeleton function as a string
 */
export async function buildSkeleton(
  ioData: Record<string, unknown>
): Promise<string> {
  // Implementation here
  return '';
}
