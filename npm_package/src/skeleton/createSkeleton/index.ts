import { placeholderName } from '../../constants';
import flattenInputJson from '../flattenInputJson';
import flattenOutput from '../flattenOutput';

const BRIEF_TEMPLATE = `/**
 * Brief: {{brief}}
 */`;

const FUNCTION_AND_TYPE_TEMPLATE = `{{outputTypeInterface}}async function ${placeholderName}({{flatInput}}): {{outputType}} {
    {{returnStatement}}
}`;

function replaceParams(template: string, values: Record<string, any>): string {
  let result = template;
  for (const key in values) {
    result = result.replaceAll(`{{${key}}}`, values[key]);
  }
  return result;
}

export default function createSkeleton(
  brief: string,
  input: Record<string, any>,
  output: Record<string, any>
) {
  const processedBrief = brief.trim();
  const flatInput = flattenInputJson(input);
  const flatOutput = flattenOutput(output);

  const replacementValues = {
    brief: processedBrief,
    outputTypeInterface: flatOutput.returnInterface,
    outputType: flatOutput.returnType, // Reflecting actual output type or OutputType interface wrapped in a Promise
    returnStatement: flatOutput.return, // Modify the return statement to reflect a Promise
    flatInput: flatInput,
  };

  const briefSkeleton = replaceParams(BRIEF_TEMPLATE, replacementValues);
  const functionAndOutputSkeleton = replaceParams(
    FUNCTION_AND_TYPE_TEMPLATE,
    replacementValues
  );

  return {
    briefSkeleton,
    functionAndOutputSkeleton,
  };
}
