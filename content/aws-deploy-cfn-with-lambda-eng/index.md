---
title: AWS Cloudformation deploying with Lambda
date: '2021-06-07'
# image: 'version-prs.png'
tags: ['eng', '2021', 'projen', 'cdk', 'aws'] #nofeed
gerUrl: https://martinmueller.dev/aws-deploy-cfn-with-lambda
pruneLength: 50
---

Hi Folks!

I am currently working on an exciting project where it should be possible to create Ec2 instances flexibly via an API. These instances should then be made available to the customer for training purposes. The instances should be customized for the customer, so they should have a certain setting like the Ec2 type, some special tags and some more.

The deployment of the Ec2 instances should be done as cheap as possible by lambdas. About a year ago I did a similar project where Ec2 instances are dynamically created for an Alfresco deployment. [Alfresco Provisioner](https://martinmueller.dev/alf-provisioner-eng)

How to deploy Ec2 instances as dynamically as possible and also extremely easy to maintain with AWS CDK via an API like Api Gateway or Appsync, I will explain in the next sections.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) is an open source framework for creating and managing AWS resources. By using languages familiar to the developer such as TypeScript or Python, the Infrastructure as Code is described. In doing so, CDK synthesizes the code into AWS Cloudformation Templates and can optionally deploy them right away.

AWS CDK has been experiencing a steady increase in enthusiastic developers since 2019 and already has a strong and helpful community that is very active on [Slack](https://cdk-dev.slack.com), for example. There is of course much more to say about AWS CDK and I recommend you explore it. Drop me a line if you have any questions.

In the next section, I briefly summarize the requirements for dynamic Ec2 deploying via an API.

# Requirements
The Ec2 instances should be dynamically deployable via an API like AWS ApiGateway, which implements a REST API or AWS AppSync, which implements a GraphQL. In doing so, certain tags such as UserId or VmType shall be attached to the Ec2 instance. This allows the Ec2 instances to be easily retrieved and displayed in a React frontend, for example.

For the administration, i.e. creation, deletion and update of the resources belonging to the Ec2 instance, Cloudformation (short: CFN) should be used. Cloudformation is a handy AWS service for managing resources. Thus, the Ec2 stack can be easily created, modified or deleted. Another advantage for using CFN is that this part can be tested separately from the rest like the API for the Ec2 instance creation. I even created my own staging pipeline for this [Stating Lib](https://martinmueller.dev/cdk-pipeline-lib).

For the creation of the CFN templates I want to use AWS CDK, because using CDK makes the creation and maintenance of the Ec2 stack extremely easy.

The Ec2 CFN template synthesized by CDK is to be deployed through a Lambda.

# Problem
Unfortunately, AWS CDK alone is not made for this use case. The main problem is that the CFN parameters cannot be flexible and after the synth phase the parameters were fixed. This drawback could be worked around by always doing a complete deploy with context parameters e.g.
 ```
 cdk deploy -c userId=Alice -c vmType=2
 ```
 does. But this is very impractical because it takes a lot of build time and every time a new CFN template is created.

To solve this problem I decided to use Cloudformation directly. Because CFN has the nice feature of parameters. So with every CFN deployment you can specify parameters to e.g. change the name of the Ec2 instance. Exactly what I was looking for.

# Solution
So I use CDK for the Ec2 stack and the Lambda which should deploy the Ec2 stack dynamically. Let's start with the Lambda:

```ts
const cdkSchedulerLambda = new lambdajs.NodejsFunction(this, 'scheduler', {
  entry: `${path.join(__dirname)}/lambda/scheduler.ts`,
  bundling: {
    commandHooks: {
      afterBundling(inputDir: string, outputDir: string): string[] {
        return [`cp ${inputDir}/cfn/ec2-vm-stack.template.json ${outputDir} 2>/dev/null`];
      },
      beforeInstall(_inputDir: string, _outputDir: string): string[] {
        return [];
      },
      beforeBundling(_inputDir: string, _outputDir: string): string[] {
        return [];
      },
    },
  },
  logRetention: logs.RetentionDays.ONE_DAY,
  environment: {},
  timeout: core.Duration.minutes(15),
});
```

I use the [LambdaJS](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-nodejs-readme.html) variant here. This has the advantage that I can define the Lambda **scheduler.ts** directly in TypeScript and Construct will convert it to JS and upload it to AWS. That's as a great level of abstraction. And with the afterBundling webhook, I can upload the CFN template to Lambda already. So I don't have to do complicated work with another storage like S3 or EFS.

Next let's have a look at the **scheduler.ts**:

```ts
// eslint-disable-next-line import/no-extraneous-dependencies
import { readFileSync } from 'fs';
import * as lambda from 'aws-lambda';

import * as AWS from 'aws-sdk';
import { Ec2 } from './query-ec2';

const cfn = new AWS.CloudFormation();

export async function handler(event: lambda.DynamoDBStreamEvent) {
  console.debug(`event: ${JSON.stringify(event)}`);

  if (event.Records.length !== 1) {
    console.debug('event not valid! Exactly one record allowed!');
    return 'failed';
  }

  let newImage: Ec2 | null = null;
  if (event.Records[0].dynamodb?.NewImage) {
    newImage = AWS.DynamoDB.Converter.unmarshall(event.Records[0].dynamodb.NewImage) as Ec2;
  } else {
    console.debug('no NewImage existing');
  }

  let oldImage: Ec2 | null = null;
  if (event.Records[0].dynamodb?.OldImage) {
    oldImage = AWS.DynamoDB.Converter.unmarshall(event.Records[0].dynamodb.OldImage) as Ec2;
  } else {
    console.debug('no OldImage existing');
  }

  const templateBody = readFileSync('./ec2-vm-stack.template.json', 'utf-8');
  console.debug(`templateBody: ${JSON.stringify(templateBody)}`);

  if (newImage) {
    console.debug('Having NewImage so creating or updating');
    const createStackParams: AWS.CloudFormation.Types.CreateStackInput = {
      StackName: `stack-${newImage.userId ?? 'noUserId'}-${newImage.vmType ?? '-1'}`,
      TemplateBody: templateBody,
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
      Parameters: [{
        ParameterKey: 'userIdParam',
        ParameterValue: newImage.userId,
      }, {
        ParameterKey: 'vmTypeParam',
        ParameterValue: newImage.vmType.toString(),
      }],
    };
    console.debug(`createStackParams: ${JSON.stringify(createStackParams)}`);
    try {
      const createStackResult = await cfn.createStack(createStackParams).promise();
      console.debug(`createStackResult: ${JSON.stringify(createStackResult)}`);
    } catch (error) {
      console.debug(`Creating failed with this error: ${JSON.stringify(error)}`);
      const updateStackResult = await cfn.updateStack(createStackParams).promise();
      console.debug(`updateStackResult: ${JSON.stringify(updateStackResult)}`);
    }
    return 'success';
  } else {
    if (oldImage) {
      console.debug('Having no NewImage but OldImage so deleting!');
      const deleteStackParams: AWS.CloudFormation.Types.DeleteStackInput = {
        StackName: `stack-${oldImage.userId ?? 'noUserId'}-${oldImage.vmType ?? 'noVmType'}`,
      };
      console.debug(`deleteStackParams: ${JSON.stringify(deleteStackParams)}`);
      const deleteStackResult = await cfn.deleteStack(deleteStackParams).promise();
      console.debug(`deleteStackResult: ${JSON.stringify(deleteStackResult)}`);
      return 'deleted';
    }
  }
  return 'failed';
};
```

By using a DynamoDBStreamEvent as input, it complicates the code a bit. In principle, however, these lines are important:

```ts
const templateBody = readFileSync('./ec2-vm-stack.template.json', 'utf-8');

const createStackParams: AWS.CloudFormation.Types.CreateStackInput = {
      StackName: `stack-${newImage.userId ?? 'noUserId'}-${newImage.vmType ?? '-1'}`,
      TemplateBody: templateBody,
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
      Parameters: [{
        ParameterKey: 'userIdParam',
        ParameterValue: newImage.userId,
      }, {
        ParameterKey: 'vmTypeParam',
        ParameterValue: newImage.vmType.toString(),
      }],
    };
    console.debug(`createStackParams: ${JSON.stringify(createStackParams)}`);
    try {
      const createStackResult = await cfn.createStack(createStackParams).promise();
      console.debug(`createStackResult: ${JSON.stringify(createStackResult)}`);

      ...
```

So here the CFN template is loaded from the ec2-vm-stack.template.json file and applied using AWS SDK **createStack**.

So all that remains is the ec2-vm-stack.template.json. How do I create this? Well it is as already said also a CDK stack. However, this one uses CFN parameters as input for **userIdParam** and **vmTypeParam**. And here is the code for the Ec2 stack:

```ts
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CustomStack } from 'aws-cdk-staging-pipeline/lib/custom-stack';
import { KeyPair } from 'cdk-ec2-key-pair';
import * as statement from 'cdk-iam-floyd';

export interface Ec2StackProps extends cdk.StackProps {
  readonly stage: string;
}
export class Ec2Stack extends CustomStack {
  constructor(scope: cdk.Construct, id: string, props: Ec2StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'sg', {
      vpc: vpc,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    const userData = ec2.UserData.forLinux();
    userData.addCommands(`
#!/bin/bash
yum update -y
yum install -y httpd.x86_64
systemctl start httpd.service
systemctl enable httpd.service
echo “Hello World” > /var/www/html/index.html
    `);

    const userIdParam = new cdk.CfnParameter(this, 'userIdParam', {
      default: 'noUserId',
    });

    const vmTypeParam = new cdk.CfnParameter(this, 'vmTypeParam', {
      default: '-2',
    });

    const identifier = `${userIdParam.value.toString() ?? 'noUserId'}-${vmTypeParam.value.toString() ?? '-1'}`;

    const instance = new ec2.Instance(this, 'instance', {
      instanceName: `vm-${identifier}`,
      instanceType: new ec2.InstanceType('t2.micro'),
      vpc,
      securityGroup,
      keyName: 'mykey',
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData,
    });

    cdk.Tags.of(instance).add('Owner', 'Hacklab');
    cdk.Tags.of(instance).add('UserId', userIdParam.value.toString());
    cdk.Tags.of(instance).add('VmType', vmTypeParam.value.toString());

    instance.addToRolePolicy(new statement.Ec2().allow().toDescribeVolumes().toDetachVolume()
      .toAttachVolume().toCreateTags().toDescribeTags().toTerminateInstances().toDeleteSecurityGroup().toDescribeInstances().toStopInstances());

  }
}

```

Interestingly, I use the CFN parameters **userIdParam** and **vmTypeParam** for the dynamic part of the Ec2 stack. If the stack is now created as via the Lambda, for example, the Ec2 instance gets the two tags UserId and VmType with the values of the CFN parameters.

# Summary
Creating Ec2 instances using CFN and Lambdas is a cool thing. With CDK everything i.e. the lambda, the API and the Ec2 stack can be formulated and extended very easily. Super cool is also that with CFN it is very easy to add other resources in the future. For example, in the future I may want to provide an S3 bucket for deployment as well. I hope you enjoyed this article and maybe it even helped you. Do you have any questions? Write me :) !

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>