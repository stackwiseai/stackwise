import getMethodName from '../getMethodName';
import {
  generateSignature,
  createMD5HashFromSignature,
} from '../generateSignature';
import stackRegistry from '../registry';
import extractBrief from '../extractBrief';
import jsonify from '../jsonify/jsonify';
import flattenInputJson from '../flattenInputJson';
import getMethodNameWithCache from '../../cache/getMethodNameFromCache';
import createSkeleton from '../createSkeleton';

interface OutputType {
  brief: string;
  functionId: string;
  documentContent: string;
  functionExists: boolean;
  methodName: string;
  inputString: string;
  briefSkeleton: string;
  functionAndOutputSkeleton: string;
}

interface InputType {
  stackSnippet: string;
  inputJSON: { [key: string]: any };
  outputJSON: { [key: string]: any };
}

export default async function buildStack({
  inputJSON,
  outputJSON,
  stackSnippet,
}: InputType): Promise<OutputType> {
  const brief = extractBrief(stackSnippet);
  console.log('brief after extraction');
  console.log(brief);
  console.log('stackSnippet before JSONFY');
  const { input: inputString, outExample } = jsonify(stackSnippet);
  console.log('input after JSONIFY');
  console.log(inputString);
  console.log('output after JSONIFY');
  console.log(outExample);
  // Create a signature from the extracted parameters
  const signature = generateSignature(
    brief,
    inputJSON,
    outputJSON,
    'stackwise'
  );
  console.log('signature');
  console.log(signature);

  const md5hash = createMD5HashFromSignature(signature);
  console.log('md5hash');
  console.log(md5hash);

  const functionId = `a${md5hash}`;
  console.log('functionId');
  console.log(functionId);

  const functionExists = stackRegistry.exists(functionId);

  const flatInput = flattenInputJson(inputJSON);

  console.log('Before Create Skeleton');
  console.log('brief:');
  console.log(brief);
  console.log('inputJSON');
  console.log(inputJSON);
  console.log('outputJSON');
  console.log(outputJSON);
  console.log('flatInput');
  console.log(flatInput);

  let { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
    brief,
    inputJSON,
    outputJSON,
    functionId,
    flatInput
  );

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

  if (methodName) {
    functionAndOutputSkeleton = functionAndOutputSkeleton.replace(
      'placeholderStackwiseFunction',
      methodName
    );

    functionAndOutputSkeleton = functionAndOutputSkeleton.replace(
      functionId,
      methodName
    );
  }
  return {
    brief,
    functionId,
    documentContent: 'unused',
    functionExists,
    methodName,
    inputString,
    briefSkeleton,
    functionAndOutputSkeleton,
  };
}
