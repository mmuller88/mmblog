---
title: SST, AWS CDK, AWS CloudFormation migration to Terraform
show: "yes"
date: "2024-08-27"
image: "birds-migrating.jpeg"
tags: ["eng", "2024", "aws", "cdk", "sst", "terraform"] #nofeed
# engUrl: https://martinmueller.dev/ab-picturer
pruneLength: 50
---

Recently, a client approached me with an intriguing request: to migrate their SST (v.2 https://v2.sst.dev/) project to Terraform. This task presents several interesting challenges, particularly in mapping SST and CDK constructs to equivalent Terraform resources. Additionally, certain components like Lambda functions and static S3 React buckets require extra attention, as they involve uploading additional files such as Lambda function code or React builds.

Although I performed this migration specifically for SST, the process I'll outline is equally applicable to AWS CDK or AWS CloudFormation projects. If you're facing a similar challenge, this blog post aims to provide you with a solid starting point and valuable insights into the migration process.

First, let's discuss some possible motivations and non-motivations for migrating from SST, AWS CDK, or AWS CloudFormation to Terraform.

After that, I will describe the migration process in detail.

## Motivations

My client's motivation was rather passive. As a newcomer to AWS, he used SST (v.2) to quickly deploy his application, which worked well for him. However, his company eventually decided to standardize on Terraform instead of SST. This highlights alignment as a motivation: if your company is using Terraform, you probably should too.

Another commonly cited reason is Terraform's superior state management. While Terraform deployments are faster than SST or AWS CDK, the difference doesn't feel significant to me.

There are undoubtedly more motivations; feel free to mention important ones I may have missed.

## Non-Motivations

The following are reasons I wouldn't consider as motivations for migrating to Terraform:

The biggest one is the degree of abstraction, like as for the CDK Constructs. You would lose that when migrating to Terraform. Defining many basic resources in Terraform isn't particularly enjoyable. To counter this somewhat, you can use an AI tool in your IDE to speed up the definition process. As well, Terraform modules give you a way to abstract definitions to modules, but it doesn't feel the same as the CDK Constructs.

As SST and AWS CDK are already TypeScript-based, they make it really easy to define and handle the lifecycle of Lambda functions. In Terraform, you need to define helper functions to manage the Lambda function lifecycle, such as bundling the code, creating the deployment package, and so on. This was actually quite painful for my project, and I ended up with this rather inelegant script:

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

Kind of similar is the deployment of a React app into a S3 bucket. In SST and AWS CDK you can use the `Bucket` construct and let the framework handle the deployment. In Terraform, you need to manually deploy the React app to the S3 bucket and then invalidate the CloudFront cache.

## Migration

In the next section, I will describe how the migration from SST, AWS CDK, or AWS CloudFormation to Terraform works.

## Step 1: Deploy

Before you start the migration, make sure your deployment works as expected. If you have an SST project, follow the instructions for deploying it like `npx sst deploy`. After deploying, check the functionality of the CloudFormation stacks. That is super important as that will be your comparison to the Terraform deployment.

## Step 2: Generate Terraform from the CloudFormation template

Now that your deployment from step 1 created at least one CloudFormation stack, you can start the migration.

Via the AWS Console, grab each generated stack and let a chat AI like Claude from anthropic.com or ChatGPT.com generate Terraform from the CloudFormation template. The prompt could look like:

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

As well, there are might be other resources which you might consider removing. For example, if you have several stacks and used variable referencing between the CloudFormation stacks, the AI translation to Terraform usually uses `aws_ssm_parameter` Terraform resources to replace them. But since all your resources are in one main.tf file, you don't need `aws_ssm_parameter` and simply reference resources directly.

## Step 4: Make the Lambda's working

Yeah, now comes the tricky part with making the Lambda's working. Look this totally depends on your project structure like where is the Lambda function code located and how is it structured. I think good advice is to keep it similar as possible to your SST or AWS CDK project. As well, use the `source_code_hash` to make sure the Lambda function code is hashed and the Lambda function is recreated if the code changes. Like:

```hcl
resource "aws_lambda_function" "my_lambda_function" {
  ...
  source_code_hash = filebase64sha256("my_lambda_function.zip")
}
```

What is left is the script to bundle the Lambda function code to the `my_lambda_function.zip` file. For you, it could look something like this:

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

Sure this is described for a React App but any other SPA or static site will work the same. First, you need to build the React app like:

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

Phew, that's it.

## Step 6: Validating

Validate the Terraform deployment with your reference deployment from step 1. Usually like when you have an Api Gateway our Lambdas, make sure they are working as expected when comparing the two deployments. The same goes for the S3 React bucket App.

## Considerations

Sure, storing all those AWS resources into one main.tf file isn't Terraform best practice, but it is totally a starting point. If you made sure that your Terraform deployment is working, feel free to split the main.tf file into multiple files, as you are used to.

## Conclusion

Migrating SST to Terraform was interesting. With the power of AI, it was a quick process. Combined with my years of experience, I was able to quickly migrate. If you have a question or need otherwise help, please reach out to me.

## Bonus - AB Picturer

<img src="https://github.com/mmuller88/mmblog/raw/master/content/aws-bedrock-update/ab-picturer.png" alt="drawing" width="400"/>.

Did you notice the cool blog title picture? I love writing blog posts and choosing nice pictures for them. It is actually one of two randomly selected pictures. But often I want to choose THE BEST picture. So to find the best picture I'm using AB Testing. If you are curious about it, have a look at the <https://ab-picturer.com> tool and provide me feedback or even better become an engaged tester :).

## Quiz

Deepen your knowledge about this blog post with a click on the AI generated quiz [https://quizrun.ai/?url=https://martinmueller.dev/aws-sst-cdk-to-tf](https://quizrun.ai/?url=https://martinmueller.dev/aws-sst-cdk-to-tf)