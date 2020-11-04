---
title: AWS CDK - PipelineApp - A Library for Staging Pipelines
date: '2020-10-24'
image: 'staging.png'
tags: ['eng', '2020', 'aws', 'cdk']
gerUrl: https://martinmueller.dev/cdk-pipeline-lib
pruneLength: 50
---

Hi CDK Fans,

Building AWS CDK pipelines is fun. Since the middle of this year (2020) there is even a high level CDK pipeline which brings many advantages like self-mutate, a simplified cross-account deployment and a better abstraction from the required code build projects.

I have developed a [CDK Library](https://github.com/mmuller88/alf-cdk-app-pipeline) which solves some annoying problems. If you encounter only one of the following, you should read the whole post :) :

* Maintaining CDK dependencies between multiple repositories
* Repetition of code for building CDK apps only to deploy e.g. an arbitrary stack
* Repetition of CDK pipeline code
* Missing a uniform CDK pipeline standard over e.g. an interface

In the next sections I will talk about this general library and how I solve those problems. First of all I will describe why you need a pipeline at all. Then I explain the idea behind the library and finally I show some examples of my projects which already use the library.

By the way my [CDK Library](https://github.com/mmuller88/alf-cdk-app-pipeline) can be used directly via npm depedency and does not require an npm repository. Just specify the dependency as follow:

```JSON
 "dependencies": {
    "alf-cdk-app-pipeline": "github:mmuller88/alf-cdk-app-pipeline#v0.0.7
    ...
 }
```

# Why a Pipeline at all?
In times of modern DevOps practices it is important to make changes in production as fast and easy as possible. Ideally this is done based on git commits and a staging pipeline. A Staging Pipeline executes changes on Stages.

In my company we have four stages DEV, QA, PROD. The DEV Stage is intended as a development environment for the developers. The QA Stage is a test environment that is as similar as possible to the PROD environment. And PROD itself is of course the production environment which is actively used by the company and our customers.

For a better understanding I will use only one DEV, PROD Stage in the next sections. The PipelineApp library can be extended by any number of stages.

# Requirements
My CDK Pipeline Library should fulfill some requirements which are implemented externally via an interface. Here the interface is implemented with the **PipelineAppProps** for the **PipelineApp** class in the library:

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: 'alf-cdk-ui',
  stageAccounts: [
    {
      account: {
        id: '123...',
        region: 'eu-central-1',
      },
      stage: 'dev',
    },
    {
      account: {
        id: '987...',
        region: 'eu-central-1',
      },
      stage: 'prod',
    },
  ],
  buildAccount: {
    id: '555...',
    region: 'eu-central-1',
  },
  customStack: (scope, account) => {

    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        hostedZoneId: 'Z08...',
        domainName: 'i.dev.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:123...:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c',
      }
       : // prod
      {
        hostedZoneId: 'Z003...',
        domainName: 'i.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:987...:certificate/4fe684df-36da-4516-bd01-7fcc22337dff',
      })
    }

    return new AlfCdkEc2Stack(scope, `${name}-${account.stage}`, {
      env: {
        account: account.id,
        region: account.region,
      },
      gitRepo: 'alf-ec2-1',
      tags,
      customDomain: {
        hostedZoneId: alfCdkSpecifics.hostedZoneId,
        domainName: alfCdkSpecifics.domainName,
        certArn: alfCdkSpecifics.certArn,
      },
      stackName: 'itest12',
      stage: account.stage,
    })
  },
  testCommands: (_) => [
    'sleep 240',
    `curl -Ssf $InstancePublicDnsName && aws cloudformation delete-stack --stack-name itest123 --region ${account.region}`,
  ],
};

// tslint:disable-next-line: no-unused-expression
new PipelineApp(pipelineAppProps);
```

In the next subsections I will explain the individual properties in more detail.

## Git Repository
The PipelineApp will deploy its stages based on Git repositories. Therefore it is necessary to define the repository and the branch:

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: 'alf-cdk-ui',
  ...
```

The **repositoryName** refers to the name in my repository on Github e.g. https://github.com/mmuller88/alf-cdk-ui . Via the pipeline this repository will be pulled by a token and defined as source.

## Manage Stages
It should be possible to connect to specific AWS accounts on the respective stage. The specification about the account and the stage should be given as parameter. I developed the following interface:

```TypeScript
stageAccounts: [
  {
    account: {
      id: '123..',
      region: 'eu-central-1',
    },
    stage: 'dev',
  },
  {
    account: {
      id: '987...',
      region: 'eu-central-1',
    },
    stage: 'prod',
  },
],
```

A list of stage accounts is passed to which the pipeline will deploy the stacks. Additionally the **stage** property defines the name of the stage. The order of the accounts also determines the order in which the staging is performed. In this example the DEV Stage is run through first and then the PROD Stage.

The build account defines the account where the CDK pipeline will be deployed.

```TypeScript
buildAccount: {
  id: '555...',
  region: 'eu-central-1',
},
```

In the build account you can also define important secrets with the Secret Manager or the parameter store like the GitHub token. In the pipeline stack these secrets can be accessed there.

## One or more Stacks
The pipeline should be able to deploy and integrate one or more stacks. The stack definition should be located in the respective repository and can then simply be passed to the Library as a Higher Order Function:

```TypeScript
customStack: (scope, account) => {

    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        hostedZoneId: 'Z08...',
        domainName: 'i.dev.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:123...:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c',
      }
       : // prod
      {
        hostedZoneId: 'Z00371764UBVAUANTU0U',
        domainName: 'i.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:987...:certificate/4fe684df-36da-4516-bd01-7fcc22337dff',
      })
    }

    return new AlfCdkEc2Stack(scope, `${name}-${account.stage}`, {
      env: {
        account: account.id,
        region: account.region,
      },
      gitRepo: 'alf-cdk-ec2',
      tags,
      customDomain: {
        hostedZoneId: alfCdkSpecifics.hostedZoneId,
        domainName: alfCdkSpecifics.domainName,
        certArn: alfCdkSpecifics.certArn,
      },
      stackName: 'itest12',
      stage: account.stage,
    })
  },
```

The stack shown here is located in the [alf-cdk-ec2](https://github.com/mmuller88/alf-cdk-ec2) repo with alf-cdk-ec2-stack.ts as file. The stack is called in app.ts along with the PipelineApp Library.

Thanks to the High Order Function, account information can easily be integrated as a parameter into the respective Stage Stack using **account**.

# Library Examples
In this section, I will show some of the consumers of the PipelineApp library.

## Alf CDK UI React Frontend
The first example is about a frontend stack which builds a static website. The technologies I use here are React in TypeScript Flavor. The static site is hosted in a S3 bucket with a cloud front distribution.

All code is on GitHub [alf-cdk-ui](https://github.com/mmuller88/alf-cdk-ui). The root directory contains the React App. The cdk folder contains all relevant CDK parts. Among them the UIStack in ui-stack.ts Construct and the PipelineApp in app.ts. The PipelineApp is called as follows:

```TypeScript
import { UIStack } from './ui-stack';
import { name } from './package.json';
import { PipelineApp } from 'alf-cdk-app-pipeline/pipeline-app';
import { sharedDevAccountProps, sharedProdAccountProps } from 'alf-cdk-app-pipeline/accountConfig';


// tslint:disable-next-line: no-unused-expression
new PipelineApp({
  branch: 'master',
  repositoryName: name,
  stageAccounts: [
    {
      account: {
        id: '123...',
        region: 'eu-central-1',
      },
      stage: 'dev',
    },
    {
      account: {
        id: '123...',
        region: 'us-east-1',
      },
      stage: 'prod',
    },
  ],
  buildAccount: {
    id: '123...',
    region: 'eu-central-1',
  },
  customStack: (scope, account) => {
    const stageProps = {
      ...(account.stage === 'dev' ? {
        domainName: sharedDevAccountProps.domainName,
        acmCertRef: sharedDevAccountProps.acmCertRef,
        subDomain: sharedDevAccountProps.subDomain,
        hostedZoneId: sharedDevAccountProps.hostedZoneId,
        zoneName: sharedDevAccountProps.zoneName,
      } : { // prod stage
        domainName: sharedProdAccountProps.domainName,
        acmCertRef: sharedProdAccountProps.acmCertRef,
        subDomain: sharedProdAccountProps.subDomain,
        hostedZoneId: sharedProdAccountProps.hostedZoneId,
        zoneName: sharedProdAccountProps.zoneName,
      })
    };
    // console.log('echo = ' + JSON.stringify(account));
    return new UIStack(scope, `${name}-${account.stage}`, {
      stackName: `${name}-${account.stage}`,
      stage: account.stage,
      domainName: stageProps.domainName,
      acmCertRef: stageProps.acmCertRef,
      subDomain: stageProps.subDomain,
      hostedZoneId: stageProps.hostedZoneId,
      zoneName: stageProps.zoneName,
    })
  },
  buildCommand: 'make distcdk',
  manualApprovals: (account) => {
    return account.stage === 'dev' ? false : true;
  },
  testCommands: (_) => [
    // Use 'curl' to GET the given URL and fail if it returns an error
    'curl -Ssf $domainName',
    'echo done!!!',
  ],
});

```

As you can see here I use the same account for the two stages dev and prod. It would also be possible to use different accounts. You only have to make sure that the CDK bootstrap command trusts the respective account! Interesting is that I overwrite the default **buildCommand** here. The motivation for this is to fine-tune the React App during build to get it faster.

The most interesting part is the **customStack** property and the High Order Function. Here you can define the stack which should be managed by the PipelineApp. That's pretty cool because it allows me to keep the stack definition in the UI repo but I only have to import minimal code for the pipeline app library.

This is an important point for stacks like the **UIStack**. These are only allowed the aws-cdk dependencies like

```TypeScript
import { StackProps, Construct, CfnOutput, RemovalPolicy } from '@aws-cdk/core';
```

only indirectly from the PipelineApp Library. This is more of an advantage than a disadvantage because only the aws-cdk dependencies have to be managed in the pipeline app library itself. And with a reasonable tagging strategy you can avoid aws-cdk update problems!

The build command can optionally be overwritten. Here I do this for example with **make distcdk** . In the projects I use Makefiles because they are excellent for encapsulating commands. With Makefiles I also have a nice overview of the possible and desired commands.

At the end I do a reachability test with the **testCommands** property. The parameter $domainName was defined in the stack like this:

```TypeScript
this.domainName = new CfnOutput(this, 'domainName', {
  value: route.domainName,
});
this.cfnOutputs['domainName'] = this.domainName;
```

This notation must be followed so that the PipelineApp Library can retrieve the stack output variables after stack deployment.

## Alf CDK Ec2 Backend
The next example is in Github on [alf-cdk-ec2](https://github.com/mmuller88/alf-cdk-ec2). Here I create an Alfresco deployment based on Docker Compose, Ec2 and CDK as infrastructure orchestrator. You can read more in the blog post [ACS infrastructure creation made easy with AWS CDK](https://martinmueller.dev/alf-cdk).

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: name,
  stageAccounts: [
    {
      account: {
        id: '123...',
        region: 'eu-central-1',
      },
      stage: 'dev',
    },
  ],
  buildAccount: {
    id: '123...',
    region: 'eu-central-1'
  },
  customStack: (scope, account) => {
    // console.log('echo = ' + JSON.stringify(account));
    const tags = JSON.parse(process.env.tags || '{}');

    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        hostedZoneId: process.env.hostedZoneId || 'Z08...',
        domainName: process.env.domainName || 'i.dev.alfpro.net',
        certArn: process.env.certArn || 'arn:aws:acm:eu-central-1:123...:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c',
      }
       : // prod
      {
        hostedZoneId: process.env.hostedZoneId || 'Z003...',
        domainName: process.env.domainName || 'i.alfpro.net',
        certArn: process.env.certArn || 'arn:aws:acm:us-east-1:123...:certificate/09d5c91e-6579-4189-882b-798301fb8fba',
      })
    };

    return new AlfCdkEc2Stack(scope, `${name}-${account.stage}`, {
      env: {
        account: account.id,
        region: account.region,
      },
      gitRepo: process.env.gitRepo || 'alf-cdk-ec2',
      tags,
      customDomain: {
        hostedZoneId: alfCdkSpecifics.hostedZoneId,
        domainName: alfCdkSpecifics.domainName,
        certArn: alfCdkSpecifics.certArn,
      },
      stackName: process.env.stackName || `itest123`,
      stage: account.stage,
    })
  },
  testCommands: (account) => [
    `aws ec2 get-console-output --instance-id $InstanceId --region ${account.region} --output text`,
    'sleep 180',
    `curl -Ssf $InstancePublicDnsName && aws cloudformation delete-stack --stack-name itest123 --region ${account.region}`,
  ],
};

// tslint:disable-next-line: no-unused-expression
new PipelineApp(pipelineAppProps);
```

In this example only one staging account is defined

## Alf CDK Backend
The next example is also in Github [alf-cdk](https://github.com/mmuller88/alf-cdk). It is a very large stack consisting of Cognito, API GW, Lambdas, StepFunction, DynamoDB and more. This stack also creates other CDK stacks using a Lambda function.

```TypeScript
import { name } from './package.json';
import { PipelineApp, PipelineAppProps } from 'alf-cdk-app-pipeline/pipeline-app';
import { AlfInstancesStack, AlfInstancesStackProps, alfTypes } from './lib/alf-instances-stack'
import { sharedDevAccountProps, sharedProdAccountProps } from 'alf-cdk-app-pipeline/accountConfig';

const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: name,
  stageAccounts: [
    {
      account: {
        id: '123...',
        region: 'eu-central-1',
      },
      stage: 'dev',
    },
    {
      account: {
        id: '987...',
        region: 'us-east-1',
      },
      stage: 'prod',
    },
  ],
  buildAccount: {
    id: '123...',
    region: 'eu-central-1'
  },
  customStack: (scope, account) => {
    // values that are differs from the stages
    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        domain: {
          domainName: `api.${sharedDevAccountProps.zoneName.slice(0,-1)}`,
          zoneName: sharedDevAccountProps.zoneName,
          hostedZoneId: sharedDevAccountProps.hostedZoneId,
          certificateArn: `arn:aws:acm:us-east-1:${account.id}:certificate/f605dd8c-4ae3-4c1b-9471-4b152e0f8846`
        },
        createInstances: {
          enabled: true,
          imageId: 'ami-0ea3405d2d2522162',
          minutes: 5,
          maxPerUser: 2,
          maxInstances: 3,
          domain: {
            domainName: `i.${sharedDevAccountProps.zoneName.slice(0,-1)}`,
            hostedZoneId: 'Z0847928PFMOCU700U4U',
            certArn: `arn:aws:acm:eu-central-1:${account.id}:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c`,
          }
        },
        swagger: {
          domain: {
            domainName: sharedDevAccountProps.domainName,
            certificateArn: sharedDevAccountProps.acmCertRef,
          }
        },
        auth: undefined,
      } : { // prod stage
        domain: {
          domainName: `api.${sharedProdAccountProps.zoneName.slice(0,-1)}`, // 'api.alfpro.net',
          zoneName: sharedProdAccountProps.zoneName,
          hostedZoneId: sharedProdAccountProps.hostedZoneId,
          certificateArn: `arn:aws:acm:us-east-1:${account.id}:certificate/62010fca-125e-4780-8d71-7d745ff91789`
        },
        createInstances: {
          enabled: false,
          imageId: 'ami-01a6e31ac994bbc09',
          minutes: 45,
          maxPerUser: 2,
          maxInstances: 50,
          domain: {
            domainName: `i.${sharedProdAccountProps.zoneName.slice(0,-1)}`,
            hostedZoneId: 'Z00371764UBVAUANTU0U',
            certArn: `arn:aws:acm:eu-central-1:${account.id}:certificate/4fe684df-36da-4516-bd01-7fcc22337dff`,
          }
        },
        swagger: {
          domain: {
            domainName: sharedProdAccountProps.domainName,
            certificateArn: sharedProdAccountProps.acmCertRef,
          }
        },
        auth: {
          cognito: {
            userPoolArn: `arn:aws:cognito-idp:us-east-1:${account.id}:userpool/us-east-1_8c1pujn9g`,
            scope: 'aws.cognito.signin.user.admin'
          }
        },
      }),
    }
    // console.log('echo = ' + JSON.stringify(account));
    const alfInstancesStackProps: AlfInstancesStackProps = {
      environment: account.stage,
      env: {
        region: account.region,
        account: account.id
      },
      stage: account.stage,
      stackName: `${name}-${account.stage}`,
      domain: alfCdkSpecifics.domain,
      createInstances: {
        enabled: alfCdkSpecifics.createInstances.enabled,
        imageId: alfCdkSpecifics.createInstances.imageId,
        alfTypes,
        automatedStopping: {
          minutes: alfCdkSpecifics.createInstances.minutes
        },
        allowedConstraints: {
          maxPerUser: alfCdkSpecifics.createInstances.maxPerUser,
          maxInstances: alfCdkSpecifics.createInstances.maxInstances,
        },
        domain: alfCdkSpecifics.createInstances.domain,
      },
      executer: {
        rate: 'rate(1 minute)'
      },
      swagger: {
        file: 'templates/swagger_validations.yaml',
        domain: {
          domainName: alfCdkSpecifics.swagger.domain.domainName,
          subdomain: 'openapi',
          certificateArn: alfCdkSpecifics.swagger.domain.certificateArn,
        }
      },
      auth: alfCdkSpecifics.auth,
    };

    return new AlfInstancesStack(scope, `${name}-${account.stage}`, alfInstancesStackProps);
  },
  manualApprovals: (account) => {
    return account.stage === 'dev' ? false : true;
  },
  testCommands: (account) => [
    ...(account.stage==='dev'? [
      `npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json`,
      'echo done! Delete all remaining Stacks!',
      `aws cloudformation describe-stacks --query "Stacks[?Tags[?Key == 'alfInstanceId'][]].StackName" --region ${account.region} --output text |
      awk '{print $1}' |
      while read line;
      do aws cloudformation delete-stack --stack-name $line --region ${account.region};
      done`,
    ] : []),
  ],
};

// tslint:disable-next-line: no-unused-expression
new PipelineApp(pipelineAppProps);
```

As you can see this is a very large stack with many input properties. In the future I might break down this huge stack into smaller ones. This example is interesting because it does a lot of testing with Postman and the AWS CLI at the end. The property **testCommands** performs tests for the DEV Stage Postman:

```
npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json`
```

Then it deletes any remaining CDK stacks resulting from the tests:

```
aws cloudformation describe-stacks --query "Stacks[?Tags[?Key == 'alfInstanceId'][]].StackName" --region ${account.region} --output text |
awk '{print $1}' |
while read line;
  do aws cloudformation delete-stack --stack-name $line --region ${account.region};
done`,
```

# Summary
CDK code pipelines are super cool. But they are also super complicated or complex. You don't want to deal with all this complexity every time just to squeeze stacks into a staging pipeline. So there should be a good abstraction to these staging pipelines.

In this article I presented such an abstraction in form of a library. I am already using it to run some CDK stacks, which are presented here.

This library can only access repositories in my github account. It would be possible to make the library more general sophisticated in order to be able to access any git repositories. If you find this useful, let me know. But now I'm curious. What do you think of my PipelineApp library? What can I improve? Let me know.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
