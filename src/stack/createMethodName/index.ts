import getMethodNameWithCache from '../../cache/getMethodNameFromCache';
import { placeholderName } from '../../constants';

interface OutputType {
  updatedMethodName: string;
  updatedFunctionAndOutputSkeleton: string;
}

export default async function createMethodName(
  briefSkeleton: string,
  functionAndOutputSkeleton: string,
  brief: string
): Promise<OutputType> {
  const methodName = await getMethodNameWithCache(
    briefSkeleton,
    functionAndOutputSkeleton,
    brief
  );
  // store this in the cache, the key should be the concatenation of wholeSkeleton and methodName and the value should be methodName
  // the cache should be checked before calling getMethodName
  // the cache is present in .stack/llmCache.json
  // create the function

  console.log(`we are here - methodName`);
  console.log(methodName);

  functionAndOutputSkeleton = functionAndOutputSkeleton.replace(
    placeholderName,
    methodName
  );

  return {
    updatedMethodName: methodName,
    updatedFunctionAndOutputSkeleton: functionAndOutputSkeleton,
  };
}
