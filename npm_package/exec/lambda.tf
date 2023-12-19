provider "aws" {
  region = "placeholder_region_string"
  profile = "stackwise-agent"
}

data "external" "check_iam_role" {
  program = ["bash", "${path.module}/utils/check_iam_role.sh"]
}

resource "aws_iam_role" "lambda_role" {
  count = data.external.check_iam_role.result["role_exists"] == "false" ? 1 : 0

  name = "placeholder_role_name"

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
  function_name = "placeholder_lambda_function_name"
  role = length(aws_iam_role.lambda_role) > 0 ? aws_iam_role.lambda_role[0].arn : "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/lambda_role"

  handler = "index.handler"
  runtime = "nodejs14.x"
  timeout = 30

  environment {
    variables = {
      OPENAI_API_KEY = var.openai_api_key
    }
  }

  filename         = "function.zip"
  source_code_hash = filebase64("${path.module}/function.zip")
}
