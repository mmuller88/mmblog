---
title: Optimize Infrastructure with CDK Solutions Constructs Part I.
date: '2020-06-28'
image: 'cdkpattern.png'
tags: ['eng', '2020', 'aws', 'lambda', 'cdk', 'github']
gerUrl: https://martinmueller.dev/cdk-solutions-constructs
pruneLength: 50
---

Ahoy AWS'ler

Recently the first [CDK Solution Constructs](https://github.com/awslabs/aws-solutions-constructs) were released. It promise a new level of abstraction for CDK Constructs by combining often used Cloudformation patterns into their own CDK Constructs. For example, if you want to use an API GateWay with a lambda proxy, you can use the [aws-apigateway-lambda Solution Construct](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-apigateway-lambda).

A great [AWS Blogpost](https://aws.amazon.com/blogs/aws/aws-solutions-constructs-a-library-of-architecture-patterns-for-the-aws-cdk/) demonstrates the combination of two such Solution Constructs very well. Furthermore, the CDK Solution Constructs promise to align on the [well-architected Framework](https://aws.amazon.com/architecture/well-architected/), in order to include the five pillars Operational Excellence, Security, Reliability, Performance Efficiency and Cost Optimization best as possible in the CDK deployment. This and the reduction in CDK code lines has led me to investigate whether my [Alfresco Provisioner CDK Deployment](https://martinmueller.dev/alf-provisioner-eng) could benefit from some CDK Solution Constructs. In the next few sections I will describe the CDK Solution Pattern that I have successfully incorporated into my deployment so far.

# AWS DynamoDB Stream to Lambda 
This pattern, also to be seen in [Github](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-dynamodb-stream-lambda), describes the often used intention to call a DynamoDB table with changes in the items via a stream to a Lambda in order to be able to react to changes like creating, editing or deleting of the item itself. An example could be if the item is deleted from the table, it can be persisted elsewhere at a lower cost.

In my deployment I use it directly to map the EC2 instances according to the desired configuration in the table. For example, if the EC2 instance needs to be stopped, only **stopped** is written to the **expectedStatus** column of the table. If the instance is to be running again you simply write **running**. If the instance is to be completely terminated, the item can simply be deleted and the streamed lambda will ensure that the instance is deleted.

My previous solution was to use StepFunction alone, but using streams is much more advantageous and saves many lines of code. I also like the fact that the pattern abstracts the stream away and I only have to worry about the table and the lambda.

# Summary
The CDK Solution Constructs are great patterns that simplify the creation of the AWS infrastructure massively and even take the well-architected framework into account. Next week I will try to integrate the next pattern [Cloudfront S3](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-cloudfront-s3). Be curious!

With great excitement I follow the development of the CDK Solution Constructs. Do you already have experience with CDK or even with the CDK Solution Constructs? If so for what? If you have any questions or suggestions, let me know!

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>