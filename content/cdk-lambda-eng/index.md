---
title: AWS CDK Apps deployed with Lambda
date: '2020-07-11'
image: 'cloud.jpg'
tags: ['eng', '2020', 'aws', 'lambda', 'cdk', 'cfd']
gerUrl: https://martinmueller.dev/cdk-lambda
pruneLength: 50
---

Ahoy AWS CDK Fans

Creating any number of Ec2 instances with a Lambda is no problem. But if you want to create more complex deployments such as LoadBalancer, Securitygroups, Scalingroups, etc. with a Lambda that is tricky! CDK Apps are a good choice to manage those stacks. Deploying CDK Apps with a Lambda is not that easy and there is less information about it in the web.

During a CDK Meetup I got the suggestion to use a CodeBuild project to create the CDK App via Lambda. And yes that worked out great. In the next sections I will explain why this is useful for me and how I did it.

# Use Case
I already mentioned several times in my blogs that I use CDK to deploy my [Alfresco Provisioner](https://martinmueller.dev/alf-provisioner-eng)(also: [CDK Construct Solutions](https://martinmueller.dev/cdk-solutions-constructs-2-eng)). Running Alfresco only on an EC2 VM works, but is not the best solution in long terms. I also want to be able to run a load balancer and multiple EC2 instances for an Alfresco stack. Even more I would like to integrate a Kubernetes cluster in the stack to orchestrate the instances and pods. So it was necessary to manage this kind of complex deployments and CDK Apps are perfect for that.

Another use case is for a customer who wants to be able to deploy CDK stacks in different stage accounts like Dev, QA, Prod. The deployment should be supervised by CodePipeline written in CDK. This use case differs in that the stack is not deployed via Lambda, but via CodePipeline and CodeBuild. For deploying CDK stacks using CodePipeline a CodeBuild project must be created.

# CDK Deploy via CodeBuild and Lambda
To deploy stacks using CDK, a CodeBuild project must be created. The project looks like this:

```TypeScript
const createInstanceBuild = new Project(scope, 'LambdaBuild', {
    role: createInstanceBuildRole, // role needs all permission for deploying Stacks, accessing S3, logs ...
    source: gitHubSource, 
    buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
        install: {
            commands: [
                'cd src',
                'npm install -g aws-cdk',
                'npm install',
            ],
        },
        build: {
            commands: [
                'npm run build',
                'cdk deploy --require-approval never'
            ]
        },
    },
    }),
    environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
    },
});
```

And it's that easy! CDK Apps with CodeBuild can be deployed within an account. But if you want to do cross deployment, you only have to adjust the commands section slightly:

```TypeScript
...
phases: {
        install: {
            commands: [
                `aws --profile dev configure set aws_access_key_id $AWS_ACCESS_KEY_ID_DEV`,
                `aws --profile dev configure set aws_secret_access_key $AWS_ACCESS_KEY_ID_DEV`,
                `aws --profile dev configure set region $AWS_ACCESS_KEY_ID_DEV`,
                `aws --profile prod configure set aws_access_key_id $AWS_ACCESS_KEY_ID_PROD`,
                `aws --profile prod configure set aws_secret_access_key $AWS_ACCESS_KEY_ID_PROD`,
                `aws --profile prod configure set region $AWS_ACCESS_KEY_ID_PROD`,
                'cd src',
                'npm install -g aws-cdk',
                'npm install',
            ],
        },
        build: {
            commands: [
                'npm run build',
                'cdk deploy --require-approval never --profile dev'
            ]
        },
    },
}),
```

If you would like to take a look at the required stack changes beforehand, you can easily do that with: 

```
cdk diff --profile dev
```

What's missing now is the Lambda implementation to run the CodeBuild project. First the Lambda must be created:

```TypeScript
const createInstanceLambdaRole = new Role(scope, 'createInstanceLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });

    createInstanceLambdaRole.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: ['codebuild:StartBuild', 'logs:*']
    }));

new Function(scope, 'createCdkApp', {
    code: new AssetCode('lambda'),
    handler: 'create-cdk-stack.handler',
    runtime: Runtime.NODEJS_12_X,
    environment: {
        PROJECT_NAME: createInstanceBuild.projectName
    },
    role: createInstanceLambdaRole
});
```

As the Lambda CDK code already indicates, the Lambda function is located in the folder ./lambda:

```TypeScript
// lambeda/create-cdk-stack.ts
import AWS = require("aws-sdk");
import { CodeBuild } from "aws-sdk";

var codebuild = new AWS.CodeBuild();

const PROJECT_NAME = process.env.PROJECT_NAME || ''

export const handler = async (event: any = {}): Promise<any> => {
  console.debug("create-cdk-stack event: " + JSON.stringify(event));

  const params: CodeBuild.Types.StartBuildInput = {
    projectName: PROJECT_NAME
  };
  console.debug("params: " + JSON.stringify(params));
  const startBuildResult = await codebuild.startBuild(params).promise();
  console.debug("startBuildResult: " + JSON.stringify(startBuildResult));
}
```

E voila and can independently deploy the Lambda CDK Apps.

# Summary
CDK makes stack creation and management easy. This is also useful in dynamically created (e.g. with a Lambda) stacks! With previous solutions, cloudformation templates had to be created first and then uploaded to an S3 which could then be used as the source for a cloudformation deployment.

With this new approach I presented that is no longer necessary and you can concentrate more on the creation of the CDK app itself. Another advantage I appreciate is that I can test the CDK apps deployed via Lambda separately without having to deploy the complete CDK Parent Stack. This combined with CI CD Pipeline is the DevOps dream comes true!

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>