---
title: SST, AWS CDK, AWS CloudFormation migration to Terraform
show: "no"
date: "2024-08-17"
# imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=ab&state=preview"
# imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=ab&state=visitor"
# image: "titleGuitar.png"
tags: ["eng", "2024", "aws", "terraform", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/ab-picturer
pruneLength: 50
---

A client of mine came with the request to please migrate his SST (v.2) to Terraform. This is an interesting request because it involves some tricky parts like mapping the SST and CDK constructs to Terraform resources. As well some special constructs like Lambda and a static S3 React bucket effort additional uploading of files like the Lambda Function code or the React build.  Though I did the migration for SST but the same process will work for AWS CDK or AWS CloudFormation. So if you face a challenge like that, I hope with this blog post I can give you a starting point.

But first I want to discuss some possible motivations why you would perhaps want to migrate from like SST, AWS CDK or AWS CloudFormation to Terraform.

## Motivation

* The motivation from my client want.

## Not Motivation

* SST and AWS CDK actually are having a sweed degree of abstraction. You would loose that when migrating to Terraform. ...

## Migration

In the next section, I will describe how the migration works.

## Step 1: Deploy

* make sure your deployment works as expected.

## Step 2: Generate Terraform from the CloudFormation template

* Your deployment generated at least one CloudFormation stack.
* Via the AWS Console grab each generated stack and let a chat AI like Claude from anthropic.com or ChatGPT.com generate Terraform from the CloudFormation template. That prompt could look like:

```txt
{
  "Resources": {
    "CustomResourceHandlerServiceRole41AEC181": {
      "Type": "AWS::IAM::Role",
      ...
}

Change the AWS CloudFormation to Terraform. Give back the full Terraform code!
```

Through the output from all those answers into the main.tf file

## Step 3: Cleanup the main.tf

Great now we have all the AWS resources in the main.tf file. But unlucky we have resources in the main.ts file which we don't want or which are not useful like those AWS CDK helper resources `CustomResourceHandlerServiceRole...` and `CustomResourceHandler...`.

As well there are might be other resources which you might consider removing. For example if you have several stacks and used variable referencing between the CloudFormation stacks, the AI translation to Terraform usually uses `aws_ssm_parameter` Terraform resources to replace them. But since all your resources are in one main.tf file you don't need `aws_ssm_parameter` and simply reference resources directly.

## Step 4: Make the Lambda's working

...

## Step 5: Make the S3 React bucket working

...

## Step 6: Deploy your Terraform

```bash
terraform apply
```

* Iterate step 3 to 5 until your Terraform deployment works as expected.

## Considerations

Sure storing all those AWS resources into one main.tf file isn't Terraform best practise but it is totally a starting point. If you made sure that your Terraform deployment is working feel free to split the main.tf file into multiple files as you are used to.

## Conclusion

Migrating SST to Terraform was fun. With the power of AI it was a super quick process. Combined with my years of experience, I was able to quickly migrate. If you have a question or need otherwhise help, please reach out to me.

Rating your images to see if your audience likes them is super important. In this article I have shown you how to do it with AB Picturer. Join the [AB Picturer Discord](https://discord.gg/ZSvMBCUeyA).
