/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { placeholderName } from '../../../../shared/constants';

const BRIEF_TEMPLATE = `/**
 * Brief: {{brief}}
 */`;

const FUNCTION_AND_TYPE_TEMPLATE = `{{outputTypeInterface}}export default async function ${placeholderName}({{flatInput}}): {{outputType}} {
    {{returnStatement}}
}`;

function replaceParams(template: string, values: Record<string, any>): string {
  let result = template;
  for (const key in values) {
    result = result.replaceAll(`{{${key}}}`, values[key]);
  }
  return result;
}

// Function to build the output type interface based on the output object
const buildOutputTypeInterface = (output: Record<string, any>) => {
  let interfaceDefinition = 'interface OutputType {\n';
  for (const key in output) {
    interfaceDefinition += `  ${key}: ${typeof output[key]};\n`;
  }
  interfaceDefinition += '}';
  interfaceDefinition += '\n';
  interfaceDefinition += '\n';
  return interfaceDefinition;
};

function buildParamList(params) {
  return Object.keys(params).join(', ');
}

export default function createSkeleton(
  brief: string,
  params,
  output: Record<string, any>,
  flatInput
) {
  const processedBrief = brief.trim();
  const processedParamList = buildParamList(params).trim();

  // Determine if output object has only one property
  const outputKeys = output ? Object.keys(output) : [];
  let outputType;
  if (outputKeys.length === 0) {
    outputType = `Promise<null>`;
  } else if (outputKeys.length === 1) {
    // Check if the output property is an object
    if (typeof output[outputKeys[0]] === 'object') {
      outputType = `Promise<any>`;
    } else {
      outputType = `Promise<${typeof output[outputKeys[0]]}>`;
    }
  } else {
    // Creating the interfaces for output
    outputType = 'Promise<OutputType>';
  }
  const returnStatement = getReturnValue(output, outputKeys);

  const outputTypeInterfaceString =
    outputKeys.length <= 1 ? '' : buildOutputTypeInterface(output);

  const replacementValues = {
    brief: processedBrief,
    paramList: processedParamList,
    outputTypeInterface: outputTypeInterfaceString,
    paramListValues: buildParamList(params),
    outputType: outputType, // Reflecting actual output type or OutputType interface wrapped in a Promise
    returnStatement: returnStatement, // Modify the return statement to reflect a Promise
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
function getReturnValue(output: Record<string, any>, outputKeys: string[]) {
  if (outputKeys.length === 0) {
    return 'return null;';
  }
  console.log('output', output);

  if (outputKeys.length === 1) {
    const value = output[outputKeys[0]];
    if (typeof value === 'object') {
      return `return ${JSON.stringify(value)};`;
    }
    if (typeof value === 'string') {
      return `return "${value}";`;
    }
    return `return ${output[outputKeys[0]]};`;
  }
  return 'return "";';
}
