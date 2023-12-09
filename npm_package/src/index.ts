import { getIO } from './getIO';
import { buildSkeleton } from './skeleton/buildSkeleton';
import chooseBoilerplate from './integrations/generic/chooseBoilerplate';
import { BoilerplateMetadata } from './integrations/utils/types';
import createStackFile from './createStackFile/index';
import updateEmbedding from './updateEmbedding/index';
import createStack from './createStack/index';
import createFormDataWrapper from './createFormDataWrapper/index';

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
      await buildSkeleton(ioData, brief);

    console.log('functionId', functionId);
    console.log('briefSkeleton', briefSkeleton);
    console.log('functionAndOutputSkeleton', functionAndOutputSkeleton);

    let methodName = '';
    let stackServerCode;
    let stackClientCode;
    const { nearestBoilerplate, integration, exactMatch, embedding } =
      await chooseBoilerplate(functionAndOutputSkeleton, functionId, brief);

    console.log('nearestBoilerplate', nearestBoilerplate);
    console.log('integration', integration);
    console.log('exactMatch', exactMatch);

    if (exactMatch) {
      // if it's an exact match it means that's it's a single BoilerplateMetadata (hash directly matched or >0.98 similarity)
      const boilerplate = nearestBoilerplate as BoilerplateMetadata;
      methodName = boilerplate.methodName;
      stackServerCode = boilerplate.functionString;
      stackClientCode = boilerplate.component;
      const parseFormDataWrapper = createFormDataWrapper(
        ioData.input,
        methodName
      );
      await createStackFile(stackServerCode, parseFormDataWrapper);

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
