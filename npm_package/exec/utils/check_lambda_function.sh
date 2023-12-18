#!/bin/bash

FUNCTION_NAME="node_lambda_function"
FUNCTION_EXISTS=$(aws lambda get-function --function-name $FUNCTION_NAME 2>&1)

if [[ $FUNCTION_EXISTS == *"Function not found"* ]]; then
  echo '{"function_exists": "false" }'
else
  echo '{"function_exists": "true" }'
fi
