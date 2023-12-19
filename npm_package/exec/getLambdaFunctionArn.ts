import { execSync } from 'child_process';

export function getLambdaFunctionArn(functionName) {
  try {
    const awsCliCommand = `aws lambda get-function --function-name ${functionName}`;
    const output = execSync(awsCliCommand).toString();
    const functionData = JSON.parse(output);
    return functionData.Configuration.FunctionArn;
  } catch (error) {
    console.error('Error retrieving Lambda function ARN:', error);
    return null; // or handle the error as needed
  }
}
