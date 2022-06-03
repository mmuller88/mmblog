---
title: AWS CDK - PipelineApp Library - Automated Testing
date: '2020-11-09'
image: 'testing.jpg'
tags: ['eng', '2020', 'aws', 'cdk', 'testing', 'postman']
gerUrl: https://martinmueller.dev/pipeline-testing
pruneLength: 50
---

Hi CDK Fans,

Recently I published a blog post about the [AWS CDK PipelineApp Library](https://martinmueller.dev/cdk-pipeline-lib-eng) I'm working on. If you are interested in the AWS CDK Pipeline you should read that one! Meanwhile I have used the library dozens of times in my projects and have developed it further.

In this post I would like to explain how to use my library to run automated tests with the pipeline.

By the way, my [CDK Library](https://github.com/mmuller88/alf-cdk-app-pipeline) can be used directly via npm dependency and does not require an npm repository. Just specify the dependency as follows:

```JSON
 "dependencies": {
    "alf-cdk-app-pipeline": "github:mmuller88/alf-cdk-app-pipeline#v0.0.8
    ...
 }
```

# What are we testing for?
In the age of fast releases to production, it is essential to perform automated tests during the release process in the pipeline. This ensures that old and new features still work.

# Cloudformation stack testing
In the last blogpost I already introduced my Ec2 stack. Now I would like to go into more detail about the test part in the **testCommands** property.

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  ...
  testCommands: (stageAccount) => [
    `curl -Ssf $InstancePublicDnsName
    aws cloudformation delete-stack --stack-name itest123 --region ${stageAccount.account.region}`,
  ],
};
```

With the command `curl -Ssf $InstancePublicDnsName` I test if the Ec2 instance is started successfully. Afterwards a cleanup is performed using the AWS CLI. Because the commands are passed as a list of strings `string[]` and are processed sequentially, the cleanup can take place after the curl command before the test days process the next command or return a fail.

The variable **$InstancePublicDnsName** was defined in the Ec2 stack and explicitly rendered into the test command. How it was defined you can see here:

```TypeScript
const instancePublicDnsName = new CfnOutput(this, 'InstancePublicDnsName', {
  value: instance.instancePublicDnsName
});
this.cfnOutputs['InstancePublicDnsName'] = instancePublicDnsName;
```

# API GW Tests
In my AWS API GW stack I run Postman tests. There are now more than 40 requests running against the API GW and testing the backend extensively. If you are interested in Postman Tests you can find a lot of articles about the topic on my blog page on https://martinmueller.dev/tags/postman .

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  ...
  testCommands: (stageAccount) => [
    ...(stageAccount.stage === 'dev'? [
      `npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json
      aws cloudformation describe-stacks --query "Stacks[?Tags[?Key == 'alfInstanceId'][]].StackName" --region ${stageAccount.account.region} --output text |
      awk '{print $1}' |
      while read line;
      do aws cloudformation delete-stack --stack-name $line --region ${stageAccount.account.region};
      done`,
    ] : []),
  ],
};
```

With the CLI tool **newman** the Postman Collection, which contains more than 40 requests tests, can be executed. From `aws cloudformation ...` on there is also a cleanup of all remaining cloudformation stacks.

# Summary
It feels like my AWS CDK pipeline library is becoming more useful and robust. With every new project of mine I add something to it and so it becomes a bit more sophisticated. I am very excited to see where the journey with my library will lead.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

  