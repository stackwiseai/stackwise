#!/bin/bash

# Use the first command-line argument as the role name, default to "lambda_role" if not provided
ROLE_NAME="${1:-lambda_role}"
# Use the second command-line argument as the AWS region, default to "us-east-1" if not provided
REGION="${2:-us-east-1}"

ROLE_EXISTS=$(aws iam get-role --role-name "$ROLE_NAME" --region "$REGION" --profile stackwise-agent 2>&1)

if [[ $ROLE_EXISTS == *"NoSuchEntity"* ]]; then
  echo '{"role_exists": "false"}'
else
  echo '{"role_exists": "true"}'
fi
