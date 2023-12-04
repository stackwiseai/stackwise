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
  inputString: string;
  briefSkeleton: string;
  functionAndOutputSkeleton: string;
  inputValues: string;
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

  let inputString = '';
  let inputValues = '';

  if (inputJSON.in !== null) {
    const result = jsonify(stackSnippet);
    inputString = result.in;
    inputValues = result.inputValues;
    // let { in: inputString,  inputValues} = ;
  }
  console.log('input after JSONIFY');
  console.log(inputString);
  // console.log('output after JSONIFY');
  // console.log(out);
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

  const functionExists = stackRegistry.idExists(functionId);

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
    flatInput
  );

  return {
    brief,
    functionId,
    documentContent: 'unused',
    functionExists: !!functionExists,
    inputString,
    briefSkeleton,
    functionAndOutputSkeleton,
    inputValues,
  };
}
