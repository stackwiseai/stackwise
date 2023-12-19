const terraformLambdaTemplate = (
  region: string,
  functionName: string,
  roleName: string,
  iAmExists: number
) => `provider "aws" {
  region = "${region}"
  profile = "stackwise-agent"
}

resource "aws_iam_role" "lambda_role" {
  count = ${iAmExists}

  name = "${roleName}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
    }]
  })
}

data "aws_caller_identity" "current" {}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
}

resource "aws_lambda_function" "node_lambda" {
  function_name = "${functionName}"
  role = length(aws_iam_role.lambda_role) > 0 ? aws_iam_role.lambda_role[0].arn : "arn:aws:iam::\${
    data.aws_caller_identity.current.account_id
  }:role/lambda_role"

  handler = "index.handler"
  runtime = "nodejs14.x"
  timeout = 30

  environment {
    variables = {
      OPENAI_API_KEY = var.openai_api_key
    }
  }

  filename         = "function.zip"
  source_code_hash = filebase64("\${path.module}/function.zip")
}`;

export default terraformLambdaTemplate;
