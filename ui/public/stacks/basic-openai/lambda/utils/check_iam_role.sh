#!/bin/bash

ROLE_NAME="lambda_role"
ROLE_EXISTS=$(aws iam get-role --role-name $ROLE_NAME 2>&1)

if [[ $ROLE_EXISTS == *"NoSuchEntity"* ]]; then
  echo '{"role_exists": "false"}'
else
  echo '{"role_exists": "true"}'
fi
