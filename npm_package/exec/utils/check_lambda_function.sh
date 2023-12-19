#!/bin/bash

# Use the first command-line argument as the function name
FUNCTION_NAME="${1:-node_lambda_function}"
# Use the second command-line argument as the AWS region, default to "us-east-1" if not provided
REGION="${2:-us-east-1}"

FUNCTION_EXISTS=$(aws lambda get-function --function-name "$FUNCTION_NAME" --region "$REGION" --profile stackwise-agent 2>&1)

if [[ $FUNCTION_EXISTS == *"ResourceNotFoundException"* ]]; then
  echo '{"function_exists": "false"}'
else
  echo '{"function_exists": "true"}'
fi
