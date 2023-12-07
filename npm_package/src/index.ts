import createStackFile from './createStackFile';
import { getIO } from './getIO';
import { createHtml } from './createHtml';

/**
 * Retrieves a completed stack
 * @param {string} brief - The user request for a stack
 * @returns {Record<string, unknown>} Data representing the stack
 */
export async function stack(brief: string): Promise<Record<string, unknown>> {
  try {
    const ioData = await getIO(brief);

    const methodName = await createStackFile(ioData, brief);
    await createHtml(ioData, methodName);

    return { message: 'Success' };
  } catch (error) {
    console.log(error);
    return { message: 'Error' };
  }
}
