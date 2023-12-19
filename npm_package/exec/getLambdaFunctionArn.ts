import { execSync } from 'child_process';

export function getLambdaFunctionArn(functionName: string, region: string) {
  try {
    const awsCliCommand = `aws lambda get-function --function-name ${functionName} --region ${region} --profile stackwise-agent`;
    const output = execSync(awsCliCommand).toString();
    const functionData = JSON.parse(output);
    return functionData.Configuration.FunctionArn;
  } catch (error) {
    console.error('Error retrieving Lambda function ARN:', error);
    return null;
  }
}
