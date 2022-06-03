---
title: A very cool DevOps AWS CDK Todolist
date: '2021-02-23'
image: 'pipeline.png'
tags: ['eng', '2021', 'projen', 'cdk', 'aws', 'appsync']
gerUrl: https://martinmueller.dev/cdk-appsync
pruneLength: 50
---

Hi.

For a long time I've been dreaming of building a platform with a great DevOps experience. I want to have cool stuff in it like:
* Infrastructure as Code (IAC)
* CI / CD (Continuous Integration / Continuous Deployment)
* A staging e.g. dev, qa, prod
* automated tests
* all this with as little TypeScript code as necessary

I have found that now with the use of the following technologies. AWS CDK to manage the infrastructure as code. AWS AppSync as implementation of GraphQL, AWS Amplify for the frontend website and managing users. Furthermore AWS CodePipeline extended with my library [AWS CDK Staging Pipeline](https://github.com/mmuller88/aws-cdk-staging-pipeline).

With my Todolist deployment I want to show you how much power is in my deployment. But first I will explain what AWS CDK is.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) is an open source framework for creating and managing AWS resources. By using languages familiar to the developer such as TypeScript or Python, Infrastructure as Code is described. In doing so, CDK synthesizes the code into AWS Cloudformation Templates and can optionally deploy them right away.

AWS CDK has been experiencing a steady increase in usage for developers since 2019 and already has a strong and helpful community that is very active like on [Slack](https://cdk-dev.slack.com). There is of course much more to say about AWS CDK and I recommend you explore it. Drop me a line if you have any questions.

# Backend AWS AppSync, AWS DynamoDB and AWS Cognito
The code for the backend is in [GitHub aws-cdk-todolist](https://github.com/mmuller88/aws-cdk-todolist).

AWS AppSync is a GraphQL api implementation. GraphQL is an interesting new API technology. Since GraphQL is still new for me, I don't dare to make any big statements now. What I do like is that the connection to databases like AWS DynamoDB feels very native. I've always been annoyed by the necessary Lambda implementations with AWS Api Gateway and the creation of new endpoints. All of that seems no longer necessary with the use of AWS AppSync.

For storing items in the todo list I use DynamoDB. Each item gets its own ID, which is assigned by the AppSync resolver. In addition, each item has a body and a username.

AWS Cognito is a service for user management and user authentication via Oauth. This service makes it very easy to implement a professional and scalable identity service with all the bells and whistles.

A deployment pipeline deployed all these resources to AWS accounts. The AWS resources for the backend and the deployment pipeline itself, are deployed using AWS CDK as Infrastructure as Code.

# Front-end React, AWS Amplify, S3 Static Website.
The code for the frontend is in [GitHub aws-cdk-todolist-ui](https://github.com/mmuller88/aws-cdk-todolist-ui).

The frontend stack consists of a React build with AWS Amplify UI extensions like @aws-amplify/auth @aws-amplify/ui-components @aws-amplify/ui-react. These extensions help massively with user management. For example, it is easy to create new users via the login screen or change the password in case you forget it.

The React build is copied to an S3 bucket via the deployment pipeline (see next section). The S3 bucket is configured as a static website. All required AWS resources for the S3 bucket and the deployment pipeline are also provided with AWS CDK.

# DevOps Pipelines
Any deployments today should have a decent deployment pipeline that has cool features like automated builds, deploys, tests, linting, versioning and so on. With this you achieve an incredible speed in development and the work is much more fun because annoying manual tasks like deploying to production or manual testing are simply omitted.

My Todolisten deployment has such a deployment pipeline. Each of the [frontend](https://github.com/mmuller88/aws-cdk-todolist-ui) and [backend](https://github.com/mmuller88/aws-cdk-todolist) have their own pipeline which is based on AWS CodePipeline and of course AWS CDK. For the pipeline I have developed a custom AWS CDK construct and also reported about it in a previous post which you can see [here](https://martinmueller.dev/cdk-pipeline-lib).

# Outlook
The [AppSync Transformer](https://github.com/) looks very interesting. With it it is possible to use the [AWS Amplify GraphQL Transformer](https://docs.amplify.aws/cli/graphql-transformer/overview) more easily. Thus many lines of code can be saved by generating an extended GraphQL schema using cool labels like @model @connection.

I do make a Udemy course about creating a platform like the Todolist. If you want a voucher for it, let me know and once it's done you'll get one.

# Summary
GraphQL is ultra exciting. I think it's a forward looking API technology and I can't wait to work with it more in a professional environment.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

 