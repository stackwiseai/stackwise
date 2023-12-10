import { BoilerplateMetadata } from '../integrations/utils/types';
import generateFunction from '../integrations/generic/generateFunction';
import createStackFile from '../createStackFile/index';
import createComponent from '../createComponent/index';
import { combineSkeleton, getFunctionName } from '../skeleton/buildSkeleton';
import createBoilerplateEmbedding from '../createEmbedding/boilerplateEmbedding';
import createFormDataWrapper from '../createFormDataWrapper/index';

export default async function createStack(
  ioData: Record<string, unknown>,
  brief: string,
  functionId: string,
  briefSkeleton: string,
  functionAndOutputSkeleton: string,
  nearestBoilerplate: BoilerplateMetadata | BoilerplateMetadata[],
  integration: string,
  embedding: number[]
) {
  console.log(`NO exact match for the functionId ${functionId}`);
  // generate a function from the default values
  let generatedFunction = await generateFunction(
    briefSkeleton,
    functionAndOutputSkeleton,
    brief,
    nearestBoilerplate,
    integration,
    embedding
  );

  // match IO data here (trigger html adjustment)
  // extract methodName
  const methodName = getFunctionName(generatedFunction);
  console.log('methodName', methodName);
  generatedFunction = combineSkeleton(briefSkeleton, generatedFunction);

  const { inputContent, outputContent } = createComponent(ioData);

  await createBoilerplateEmbedding(
    brief,
    ioData.input,
    ioData.output,
    integration,
    functionId,
    generatedFunction,
    methodName,
    combineSkeleton(briefSkeleton, functionAndOutputSkeleton),
    'boilerplate_1',
    inputContent,
    outputContent
  );

  const parseFormDataWrapper = createFormDataWrapper(ioData.input, methodName);

  createStackFile(generatedFunction, parseFormDataWrapper);

  return {
    inputContent,
    outputContent,
  };
}
