const BRIEF_TEMPLATE = `/**
 * Brief: {{brief}}
 */`;

const FUNCTION_AND_TYPE_TEMPLATE = `{{outputTypeInterface}}export default async function {{name}}({{flatInput}}): {{outputType}} {
    {{returnStatement}}
}`;

function replaceParams(template, values) {
  let result = template;
  for (const key in values) {
    result = result.replaceAll(`{{${key}}}`, values[key]);
  }
  return result;
}

// Function to build the output type interface based on the output object
const buildOutputTypeInterface = (output) => {
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
  brief,
  params,
  output,
  signature,
  flatInput
) {
  const processedBrief = brief.trim();
  const processedSignature = signature.trim();
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
    name: processedSignature,
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
function getReturnValue(output, outputKeys) {
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

export function combineSkeleton(
  briefSkeleton: string,
  functionAndOutputSkeleton: string
): string {
  // Find the index of the start of the export statement
  const exportStartIndex = functionAndOutputSkeleton.indexOf('export default');

  // Check if 'export' was found to avoid errors
  if (exportStartIndex === -1) {
    throw new Error('Export statement not found in the skeleton.');
  }

  // Insert the briefSkeleton at the found index
  const combinedSkeleton =
    functionAndOutputSkeleton.slice(0, exportStartIndex) +
    briefSkeleton +
    '\n' +
    functionAndOutputSkeleton.slice(exportStartIndex);

  return combinedSkeleton;
}
