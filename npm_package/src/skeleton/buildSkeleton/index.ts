import { SkeletonJson } from '../../types';
import {
  generateSignature,
  createMD5HashFromSignature,
} from '../../generateSignature';
import createSkeleton from '../createSkeleton/index';

interface OutputType {
  functionId: string;
  briefSkeleton: string;
  functionAndOutputSkeleton: string;
}

export const buildSkeleton = async (
  ioData: SkeletonJson,
  brief: string
): Promise<OutputType> => {
  const signature = generateSignature(
    brief,
    ioData.input,
    ioData.output,
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

  const { briefSkeleton, functionAndOutputSkeleton } = createSkeleton(
    brief,
    ioData.input,
    ioData.output
  );

  return {
    functionId,
    briefSkeleton,
    functionAndOutputSkeleton,
  };
};

export function getFunctionName(code) {
  // Regex pattern to match the function name, with optional export keyword and handling spaces before the parenthesis
  const regex =
    /(?:export\s+)?(?:default\s+)?async\s+function\s+([a-zA-Z_$][a-zA-Z\d_$]*)\s*\(/;

  // Execute the regex on the provided code
  const match = regex.exec(code);

  // If a match is found, return the function name, otherwise return null
  return match ? match[1] : null;
}

export function combineSkeleton(
  briefSkeleton: string,
  functionAndOutputSkeleton: string
): string {
  console.log('WE ARE IN THE COMBINE SKELTON');
  // Find the index of the start of the export statement
  const exportStartIndex = functionAndOutputSkeleton.indexOf('async function');

  // Check if 'export' was found to avoid errors
  if (exportStartIndex === -1) {
    console.log('Export statement not found in the skeleton.');
  }

  // Insert the briefSkeleton at the found index
  const combinedSkeleton =
    functionAndOutputSkeleton.slice(0, exportStartIndex) +
    briefSkeleton +
    '\n' +
    functionAndOutputSkeleton.slice(exportStartIndex);

  return combinedSkeleton;
}
