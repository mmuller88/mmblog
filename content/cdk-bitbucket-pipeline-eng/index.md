---
title: A CDK BitBucket Staging Pipeline
date: '2021-10-31'
image: 'bitbucket.jpg'
tags: ['eng', '2021', 'bitbucket', 'aws', 'cdk'] 
gerUrl: https://martinmueller.dev/cdk-bitbucket-pipeline
pruneLength: 50
---

I have been working for a client with very exciting AWS CDK tasks. The customer is heavily into the Atlassian ecosystem. BitBucket is used to host the code. Now the customer wants to move more into the DevOps space and manage their AWS deployments with AWS CDK as well. For this purpose, the existing AWS infrastructure needs to be translated into CDK. Additionally, a staging deployment pipeline should deploy the CDK stacks on a dev, qa and prod stages. Happy to help there :).

## Disclaimer

Even though I already have a lot of experience with CDK (see [here](https://martinmueller.dev/tags/cdk)), I don't know much about BitBucket. So I don't know if my approach is ideal, but at the time of writing this article, it works quite well :).

I'm writing this article mainly because I haven't found any other helpful posts or instructions how to build a CDK staging deployment pipeline using BitBucket. So maybe if you have a similar task you might can use this post to help you getting started.

## Which pipeline?

Now, of course, the question was where should the CDK staging deployment pipeline live? The choices were AWS CodePipeline or BitBucket's pipeline.

## Maybe AWS CodePipeline?

The advantage of AWS CodePipeline would be that there is already an ingenious AWS CDK Staging Pipeline Construct like the [CDK Pipeline](https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html) . This would give you almost everything your DevOps heart desires, e.g. a synth action where the Cloudformation template is generated from CDK and deploy actions which then deploy to the respective stages. Also very useful are the optional actions that can be executed after the deploy action. Thus, for example, integration tests can be executed after the deploy. It is also very nice that the pipeline is defined in TypeScript. That provides documentation and specifies a certain standard through the typing for how a pipeline should look like.

## Or BitBucket's pipeline?

The customer already uses BitBucket's pipeline for testing, linting and creating builds. Therefore, it would be undesired if the customer would be forced to switch back and forth between the two pipeline dashboards AWS CodePipeline and BitBucket's Pipeline. In addition, all functions of the AWS CodePipeline and the CDK Pipeline Construct can be reprogrammed with BitBucket's Pipeline.

A pretty cool feature that AWS CodePipeline doesn't have is skipping steps if the specified subdirectory hasn't been changed. Here is an example:

```yaml
- step:
    name: Synth CDK app
    condition:
      changesets:
        includePaths:
          - "bitbucket-pipelines.yml"
          - "devops/**"
    script:
      - echo "synth cdk app"
      ...
```

I miss such a cool feature in AWS CodePipeline. Also, the customer uses a monorepo. So all projects are in one BitBucket repository. This would also be very disadvantageous for AWS CodePipeline since it would always trigger a pipeline run for every commit.

Considering all the pros and cons, we decided to use BitBuckets's Codepipeline as our CDK staging deployment pipeline.

## Folder structure

As mentioned earlier, the customer has a monorepo and of course they would like to keep that. We have now decided on the following folder structure:

```bash
devops # Contains AWS CDK dependencies and CDK Apps
devops/${STAGE} # Contains stage specific scripts like bootstrap command
devops/${STAGE}/vpc # VPC CDK App
devops/${STAGE}/cognito # Cognito CDK App
devops/${STAGE}/website # S3 Website CDK App
...
```

STAGE is either dev, qa or prod .

In the **devops** folder are the AWS CDK dependencies. Via package.json all needed CDK libraries are loaded e.g. :

```json
  "dependencies": {
    ...
    "@aws-cdk/aws-s3": "1.130.0",
    "@aws-cdk/aws-cloudfront": "1.130.0",
    "@aws-cdk/aws-cloudfront-origins": "1.130.0",
    "@aws-cdk/aws-s3-deployment": "1.130.0",
    ...
  }
```

Also, the devops/package.json includes a script to bootstrap the build AWS account and synthesize it. The build AWS account is the account from where the stages are managed. Synthesizing is the process of transforming the CDK app into one or more Cloudformation templates:

```json
"scripts": {
  ...
  "synth": "yarn build && yarn cdk synth",
  "bootstrap": "yarn build && yarn cdk bootstrap --trust 11111111,222222,3333333 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://44444444/us-east-1"
},
```

The bootstrap command creates a CDK helper stack in build account 44444444 and trusts all stages dev = 11111111, qa = 222222, prod = 3333333. Trusted here means that a cross account deploy permission is added to the CDK helper stack role. This allows the build account to deploy to the different stage accounts. It is also very important that the stage accounts must perform a bootstrap. The bootstrap command can be found in devops/${STAGE}/package.json e.g. for dev:

```json
"scripts: {
  ...
  "bootstrap": "yarn cdk bootstrap --trust 44444444 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://$111111/us-east-1"
}
```

As you can see here, the stage account e.g. dev=11111111 must also bootstrap the build account 44444444. These bootstraps can be a bit confusing, but fortunately don't need to be done often. I still recommend to document the bootstrap process well in e.g. the Readme.md . In general I think a good documentation is very very helpful :).

## Example VPC

In each stage there should be a VPC where private infrastructure like Postgres DBs should be deployed. So each stage contains a VPC subdirectory devops/${STAGE}/vpc . There in a main.ts is the CDK code. I show this here with the dev stage:

```ts
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../../components/vpc-stack';
const env = require('../package.json').env;

export const DevVpcStack = (app: cdk.App) => new VpcStack(app, `${env.stage}-VpcStack`, { env });
```

Since each stage needs a VPC, it makes sense to place the common VPC CDK code in a shared component under the devops/components folder:

```ts
export class VpcStack extends cdk.Stack {

  vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'vpc', { maxAzs: 2 });
  }
}
```

The respective VPC is then loaded in devops/src/main.ts:

```ts
import * as cdk from '@aws-cdk/core';
import { DevVpcStack } from '../dev/vpc/main';
import { ProdVpcStack } from '../prod/vpc/main';
import { SqaVpcStack } from '../sqa/vpc/main';
import { StagingVpcStack } from '../staging/vpc/main';

const app = new cdk.App();

// vpcs
const devVpc = DevVpcStack(app).vpc;
const sqaVpc = SqaVpcStack(app).vpc;
const stagingVpc = StagingVpcStack(app).vpc;
const prodVpc = ProdVpcStack(app).vpc;

...
```

Admittedly, artificially splitting the stages into devops/${STAGE}/vpc and then merging them into devops/src/main.ts is a bit weird and may not be ideal. Alternatively, everything could just be written to devops/src/main.ts. However, we hope to have a better overview of the "individual" CDK stacks this way.

## Bitbucket pipeline

The Bitbucket pipeline now roughly goes through the following steps. First, tests are run in parallel and builds are build. Among the builds are, for example, different React builds for the different stages. After that, the CDK synth is run using `yarn cdk synth`. During synth, assets such as the different React builds are uploaded to S3:

```yaml
- step:
  name: synth CDK app
  caches: 
    - node-custom
  condition:
    changesets:
      includePaths:
        - "bitbucket-pipelines.yml"
        - "devops/**"
  script:
    - export AWS_REGION=us-west-2
    - export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_BUILD
    - export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY_BUILD
    - cd devops
    - yarn synth
  artifacts:
    - devops/cdk.out/**
```

After the synth, the first stage dev can now apply the cloudformation templates synthesized by CDK. For this I use e.g. this CDK command:

```bash
yarn cdk deploy -a 'cdk.out/' dev-VpcStack --require-approval never
```

The cdk.out folder was previously designated as an artifact in the CDK synth step and is now reused for the respective stages (dev in this case) and CDK stacks. The pipeline yaml code looks like this:

```yaml
- parallel:
    - step:
        name: Deploy vpc to dev
        caches: 
          - node-custom
        condition:
          changesets:
            includePaths:
              - "bitbucket-pipelines.yml"
              - "devops/**"
        script:
          - export AWS_REGION=us-west-2
          - export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_BUILD
          - export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY_BUILD
          - cd devops/dev/vpc && yarn deploy-cdk-stage
          - cd ../hasura && yarn deploy-cdk-stage
    - step:
        name: Diff qa
        caches: 
          - node-custom
        condition:
          changesets:
            includePaths:
              - "bitbucket-pipelines.yml"
              - "devops/**"
        script:
          - export AWS_REGION=us-west-2
          - export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_BUILD
          - export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY_BUILD
          - cd devops/qa && yarn diff
    - step:
        name: Approval deploy qa
        trigger: manual
        condition:
          changesets:
            includePaths:
              - "bitbucket-pipelines.yml"
              - "devops/**"
              - dashboard/**
        script:
          - echo "Deploy"
  - parallel:
        # qa stage simila looking to dev
```

So it is deployed directly to the dev stage. A diff to the next stage qa is also created in parallel. In order to also perform the qa deploy, the **Approval deploy qa** step must be approved via a manual trigger. If you agree, the whole process in qa runs analog to dev.

## What next?

For the sake of clarity, we are still missing a kind of dashboard to display the most important CfnOutput URLs, such as the cloudfront urls of the React apps. We also want to know which commit was used for the respective deploy. For this purpose, a dashboard that can find out the current deployments and their commit ID via Lambda and probably also display them directly would be very suitable.

## Summary

Working with BitBucket as a repository is mega cool. I had a lot of fun building a CDK staging deployment pipeline under these circumstances. Here I described roughly how this pipeline looks like and what our reasons were to build this pipeline this way. Only time will tell if these were good decisions when the customer actually uses the pipeline. Do you think we missed something or do you have ideas what can be done better? Then please write me :).

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>