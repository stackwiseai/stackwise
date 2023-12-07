import { buildSkeleton } from '../buildSkeleton';

export default async function createStackFile(
  ioData: Record<string, unknown>,
  brief: string
): Promise<string> {
  const {
    skeletonOutput,
    functionId,
    briefSkeleton,
    functionAndOutputSkeleton,
  } = await buildSkeleton(ioData);

  const fullSkeleton = combineSkeleton(
    briefSkeleton,
    functionAndOutputSkeleton
  );

  let methodName = '';
  let generatedFunction = '';
  const { nearestBoilerplate, exactMatch, embedding } = await chooseBoilerplate(
    fullSkeleton,
    functionId,
    'generic'
  );

  if (exactMatch) {
    // if it's an exact match it means that's it's a single BoilerplateMetadata (hash directly matched or >0.98 similarity)
    const boilerplate = nearestBoilerplate as BoilerplateMetadata;
    methodName = boilerplate.methodName;
    generatedFunction = boilerplate.inputString;
    createStackFile(generatedFunction, methodName);
    // increment count of times it's been used and what it was retrieved by
    await updateEmbedding(boilerplate, functionId);
  } else {
    console.log(`NO exact match for the functionId ${functionId}`);
    // generate a function from the default values
    let generatedFunction = await generateFunction(
      briefSkeleton,
      functionAndOutputSkeleton,
      brief,
      nearestBoilerplate,
      embedding
    );

    // integrations = await getIntegrationData(generatedFunction);
    // match IO data here (trigger html adjustment)
    // extract methodName

    generatedFunction = combineSkeleton(briefSkeleton, generatedFunction);

    await createBoilerplateEmbedding(
      brief,
      ioData,
      // integrations,
      functionId,
      generatedFunction,
      methodName,
      fullSkeleton
    );

    createStackFile(generatedFunction, methodName);
  }

  return methodName;
}
