import { getIO } from './getIO';
import { buildSkeleton } from './skeleton/buildSkeleton';
import chooseBoilerplate from '../../shared/integrations/generic/chooseBoilerplate';
import { BoilerplateMetadata } from '../../shared/integrations/lib/types';
import createStackFile from './createStackFile';
import updateEmbedding from './updateEmbedding';
import createStack from './createStack';

/**
 * Retrieves a completed stack
 * @param {string} brief - The user request for a stack
 * @returns {Record<string, unknown>} Data representing the stack
 */
export async function stack(brief: string): Promise<Record<string, unknown>> {
  try {
    const ioData = await getIO(brief);
    console.log('ioData', ioData);

    const { functionId, briefSkeleton, functionAndOutputSkeleton } =
      buildSkeleton(ioData, brief);

    let methodName = '';
    let stackServerCode;
    let stackClientCode;
    const { nearestBoilerplate, integration, exactMatch, embedding } =
      await chooseBoilerplate(functionAndOutputSkeleton, functionId, brief);

    if (exactMatch) {
      // if it's an exact match it means that's it's a single BoilerplateMetadata (hash directly matched or >0.98 similarity)
      const boilerplate = nearestBoilerplate as BoilerplateMetadata;
      methodName = boilerplate.methodName;
      stackServerCode = boilerplate.inputString;
      stackClientCode = boilerplate.component;
      createStackFile(stackServerCode);

      // increment count of times it's been used and what it was retrieved by
      await updateEmbedding(boilerplate, functionId);
    } else {
      await createStack(
        ioData,
        brief,
        functionId,
        briefSkeleton,
        functionAndOutputSkeleton,
        nearestBoilerplate,
        integration,
        embedding
      );
    }

    return { message: ioData };
  } catch (error) {
    console.log(error);
    return { message: 'Error' };
  }
}
