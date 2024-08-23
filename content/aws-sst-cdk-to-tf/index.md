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

Recently, a client approached me with an interesting request: to migrate their SST (v.2) project to Terraform. This task presents several interesting challenges, particularly in mapping SST and CDK constructs to equivalent Terraform resources. Additionally, certain components like Lambda functions and static S3 React buckets require extra attention, as they involve uploading additional files such as Lambda function code or React builds.

Although I performed this migration specifically for SST, the process I'll outline is equally applicable to AWS CDK or AWS CloudFormation projects. If you're facing a similar challenge, this blog post aims to provide you with a solid starting point and valuable insights into the migration process.

But first I want to discuss some possible motivations why you would perhaps want to migrate from like SST, AWS CDK or AWS CloudFormation to Terraform.

## Motivations

The motivation from my client was rather passive. He is fairly new to AWS and used SST (v.2) to quickly deploy his application. That worked fine for him. But at some point his company he is working for decided to use Terraform instead of SST. That highlights alignment as motivation. If your company is using Terraform, you probably should use Terraform.

Another one I can think of and is often stated is the superior state management of Terraform. Granted the Terraform deployment is faster than SST or AWS CDK but it doesn't feel significant to me.

Sure their are many more motivations feel free to mention important ones to me :).

## Not Motivations

The following are my not motivations for migrating to Terraform.

The biggest one is the degree of abstraction. You would loose that when migrating to Terraform. Do you need to define so many basic resources in Terraform which isn't fun. Though to counter that a bit, use an AI tool in your IDE to speed up the defining process.

As SST and AWS CDK are already TypeScript based, it makes it really easy to define and handle the lifecycle of like Lambda functions. In Terraform you need to define helper functions to handle the lifecycle of the Lambda function like bundling the code, creating the deployment package, and so on. That was actually really painful for my project and I ended up with this ugly script 🥶:

```bash
rm -rf lambda_function_payload.zip
cd ../functions
rm -rf dist
npx tsc
npm install
cp -r node_modules/ dist/node_modules
cd dist
zip -rFS lambda_function_payload.zip *
cp -r lambda_function_payload.zip ../../../terraform
cd ../../../terraform
```

This feels ugly and was no fun.

Kind of similar is the deployment of a React app into a S3 bucket. In SST and AWS CDK you can use the `Bucket` construct and let the framework handle the deployment. In Terraform you need to manually deploy the React app to the S3 bucket and then invalidate the CloudFront cache.

## Migration

In the next section, I will describe how the migration works.

## Step 1: Deploy

Before you start the migration, make sure your deployment works as expected. If you have an SST project follow the instructions for deploying it like `npx sst deploy`. After deploying check the functionality of the CloudFormation stacks. That is super important as that will be your comparison to the Terraform deployment.

## Step 2: Generate Terraform from the CloudFormation template

Now that your deployment from step 1 created at least one CloudFormation stack, you can start the migration.

Via the AWS Console grab each generated stack and let a chat AI like Claude from anthropic.com or ChatGPT.com generate Terraform from the CloudFormation template. The prompt could look like:

```txt
{
  "Resources": {
    "CustomResourceHandlerServiceRole41AEC181": {
      "Type": "AWS::IAM::Role",
      ...
}

Change the AWS CloudFormation to Terraform. Give back the full Terraform code!
```

Through the output from all those answers into the main.tf file.

## Step 3: Cleanup the main.tf

Great now we have all the AWS resources in the main.tf file. But unlucky we have resources in the main.ts file which we don't want or which are not useful like those AWS CDK helper resources `CustomResourceHandlerServiceRole...` and `CustomResourceHandler...`.

As well there are might be other resources which you might consider removing. For example if you have several stacks and used variable referencing between the CloudFormation stacks, the AI translation to Terraform usually uses `aws_ssm_parameter` Terraform resources to replace them. But since all your resources are in one main.tf file you don't need `aws_ssm_parameter` and simply reference resources directly.

## Step 4: Make the Lambda's working

Yeah now comes the tricky part with making the Lambda's working. Look this totally depends on your project structure like where is the Lambda function code located and how is it structured. I think a good advice is to keep it similar as possible to your SST or AWS CDK project. As well use the `source_code_hash` to make sure the Lambda function code is hashed and the Lambda function is recreated if the code changes. Like:

```hcl
resource "aws_lambda_function" "my_lambda_function" {
  ...
  source_code_hash = filebase64sha256("my_lambda_function.zip")
}
```

What is left is the script to bundle the Lambda function code to the `my_lambda_function.zip` file. For you it could look something like this:

```bash
rm -rf lambda_function_payload.zip
cd ../functions
rm -rf dist # the tsconfig.json has an "outDir": "./dist" configured where all the compiled js files will be stored
npx tsc # compile the TypeScript code
npm install
cp -r node_modules/ dist/node_modules
cd dist
zip -rFS lambda_function_payload.zip *
cp -r lambda_function_payload.zip ../../terraform
cd ../../terraform
```

Deploy the Lambda function and check with the AWS Console if it is working as expected.

```bash
terraform apply
```

## Step 5: Make the S3 React bucket working

First you need to build the React app like:

```bash
cd ../frontend
npm install
npm run build
```

Copy the build to the s3 bucket and invalidate the cloudfront cache:

```bash
BUCKET_NAME=xyz-react-site-bucket
DISTRIBUTION_ID=EZ8RBY8ZM1234
aws s3 sync dist/ s3://$BUCKET_NAME --delete

aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

Phew thats it.

## Considerations

Sure storing all those AWS resources into one main.tf file isn't Terraform best practise but it is totally a starting point. If you made sure that your Terraform deployment is working feel free to split the main.tf file into multiple files as you are used to.

## Conclusion

Migrating SST to Terraform was interesting. With the power of AI it was a quick process. Combined with my years of experience, I was able to quickly migrate. If you have a question or need otherwise help, please reach out to me.

Rating your images to see if your audience likes them is super important. In this article I have shown you how to do it with AB Picturer. Join the [AB Picturer Discord](https://discord.gg/ZSvMBCUeyA).
