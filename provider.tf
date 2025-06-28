provider "aws" {
  region     = "ap-southeast-2" # 悉尼地区
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
