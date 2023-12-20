#!/bin/bash

# Use the first command-line argument as the function name
FUNCTION_NAME="${1:-node_lambda_function}"
# Use the second command-line argument as the AWS region, default to "us-east-1" if not provided
REGION="${2:-us-east-1}"

# Check if the Lambda function exists
FUNCTION_EXISTS=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --profile stackwise-agent 2>&1)

if [[ $FUNCTION_EXISTS == *"ResourceNotFoundException"* ]]; then
  echo "Lambda function $FUNCTION_NAME does not exist. Proceeding with creation."
else
  echo "Lambda function $FUNCTION_NAME exists. Importing into Terraform state."
  # Get the function ARN
  FUNCTION_ARN=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --query 'Configuration.FunctionArn' --output text --profile stackwise-agent)
  
  # Check if the ARN was successfully retrieved
  if [ -z "$FUNCTION_ARN" ]; then
    echo "Error: Unable to retrieve ARN for Lambda function $FUNCTION_NAME"
    exit 1
  fi

  # Import the function into Terraform state
  terraform import aws_lambda_function.node_lambda "$FUNCTION_ARN"
fi
