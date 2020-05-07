---
title: AWS CDK Multistacks for Test and Produktion
description: AWS CDK Multistacks for Test and Produktion
date: '2020-04-19'
image: 'cloud.jpg'
tags: ['eng', '2020', 'aws', 'lambda', 'cdk', 'production', 'github', 'travis']
gerUrl: https://martinmueller.dev/cdk-multistack
pruneLength: 50
---

Hi AWS Fans,

[Last time](https://martinmueller.dev/cdk-example-eng) I described how well AWS CDK is suited for describing infrastructure as code. This article is about how CDK could look in a test and production environment. In my private project I have already implemented something like a production environment and I am very enthusiastic about it. In short, I use CDK's [Multistack](https://docs.aws.amazon.com/cdk/latest/guide/stack_how_to_create_multiple_stacks.html). In the next sections I describe how my deployment looks like.

# CDK Multistack
A CDK multistack is a CDK deployment that manages multiple stacks. These stacks can be in the same or different regions, or even in a different AWS account. The different stacks can then be easily initialized with different parameters before creation. Here is an example with two stacks:

```TypeScript
new MultiStack(app, "EuWest2Prod", {
    environment: 'prod',
    env: {
      region: "eu-west-2",
      account: 'ABC'
    },
    // disable create ec2 instance
    // createInstances: {
    //   imageId: 'ami-04d5cc9b88f9d1d39'
    // },
    cognito: 'true'
    domain: {
      domainName: 'api.nope.dev',
      zoneName: 'api.nope.dev.',
      hostedZoneId: 'AA',
      certificateArn: 'arn:aws:acm:eu-west-2:ABC:certificate/xyz'
    }
  });

new MultiStack(app, "EuWest2", {
  environment: 'dev',
  env: {
    region: 'eu-west-2',
    account: 'XYZ'
  },
  createInstances: {
    imageId: 'ami-0cb790308f7591fa6'
  }
});
```

This is a small excerpt from my project. The first stack called EuWest2Prod describes the production stack, which is even in another account. The second stack EuWest2 is the test stack. This type of parameterization can be used to turn features on and off. In the production stack, by commenting out createInstances, I disabled the feature to create Ec2 instances in order to save costs. The parameterization also supports simple migration from one AWS account to another.

In the next sections, I want to talk more about my test stack and production stack. But I have to mention fairly that I don't have a real production yet. So to speak real customers who use my service. I hope to be able to change this soon in a closed beta version. At the moment I am trying to gain experience on how I could keep a real production running as good as possible, i.e. implement seamlessly new features. AWS ChangeSets for cloud formation stacks are very suitable for that. These only change the respective stack with the necessary updates. Before you continue reading, I definitely recommend to learn about AWS ChangeSets for CloudFormations.

# Test Stack
Test stacks should be primarily cheap. The tests are carried out and the log result should be easily accessible to the developer. Shortly afterwards, the stack should destroy the resources to save money. If a manual assessment of the test stack is still desired afterwards, a delay in destruction can be implemented. I did that for the Ec2 instances which terminate themself after 55 minutes.

And of course the test stack should test. What exactly that is depends on your use case. I test against an API GateWay and its endpoints. In the background, several DynamoDB tables and EC2 instances are created or terminated using step functions. I do that with Postman. If you are more interested in testing, I have already written about it in one of my [previous post](https://martinmueller.dev/cdk-example-eng).

In itself, that's it. If the test phase was successful, the update can be applied to production. This is described in the next section.

# Production Stack
The production stack is intended for customers. Everything has to work as well as possible there and new features should only be implemented after they have been proven in the test stack. It can also make sense to operate the production stack with slightly changed service settings. An example of this would be that I don't really need user administration with Cognito in the test stack, but I do in the production stack. This keeps the complexity in the test stack lower. In the snippet above, I defined cognito in production. Another example would be EC2 instances. In the test stack, low cost EC2 types are fine, but stronger and therefore more expensive instances are required in production, usually.

The question now is where the production stack should be deployed. Fortunately, CDK gives us every freedom there. It is possible to deploy the stack in the same or in a different region, in the same account. The production stack can also be deployed in another account. Profiles have to be used for this. Here is an example:

```BASH
cdk deploy "$ STACK_NAME_PRODUCTION" --profile = prod
```

This stack is now deployed in another AWS account. So far I have had a good experience with this type of deployments. However, this type of deployment has one disadvantage. Since I am now dependent on the Profile parameter, I cannot use the same cdk deploy command for the test stack and I have to execute two CDK commands:

```BASH
cdk deploy "$ STACK_NAME_TEST"
cdk deploy "$ STACK_NAME_PRODUCTION" --profile = prod
```

It would be great if I could simply specify the profile name when defining it in the multistack. This disadvantage is of course not really bad, since in a proper pipeline the test stack should run first and after passed test an a manual approval the production stack is deployed.

**EDIT:** I received feedback that there is already a workaround for this in the npm registry: https://github.com/hupe1980/cdk-multi-profile-plugin

# DevOps Travis Pipeline
Every developer should be familiar with Travis. The Travis Free Tier allows you to use VMs from Travis if your GitHub project is public. These then only have to be defined and configured in the .travis file. That's exactly what I'm doing. To be honest, I use Travis a lot. I just briefly describe my workflow when I create a new feature:

1) Write code adjustments of new feature in master.
2) If necessary add new test in Postman.
3) master commit -> Travis build is triggered.
4) Travis fails or passes.
5) If it failed, the stack reverted automatically and I evaluated the logs to see what went wrong. Back to step 1).
6) If it passed, the new feature is on all stacks and I can now test it manually.

This is very awesome because I have to do fewer interactions to implement this new feature. The entire build takes about 10 minutes and then I can just do something else for 10 minutes. This type of pipeline has brought me very quick iterations of new features. I am literally flabbergasted what is possible today with just a DevOps. What I can do alone would have required about 10 people 5 years ago instead of just one.

# Summary
CDK's multistacks are a great way to manage multiple stacks like a test stack and production stack. For my small project I have great experiences with this type of stack management and described it here. So far, a relatively small Travis build has been sufficient to create a useful pipeline. I am considering looking into AWS CodePipeline to see if it could benefit me. I hope you enjoyed my little summary :)

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>