---
title: Optimise Infrastructure with CDK Solutions Constructs Part II.
date: '2020-07-04'
image: 'part2.png'
tags: ['eng', '2020', 'aws', 'lambda', 'cdk', 'github']
gerUrl: https://martinmueller.dev/cdk-solutions-constructs-2
pruneLength: 50
---

Hi CDK Fans

In the previous [Part I](https://martinmueller.dev/cdk-solutions-constructs-eng) I have built the DynamoDB Stream to Lambda Solution Construct into my [Alfresco Provisioner CDK Deployment](https://martinmueller.dev/alf-provisioner-eng) and discussed the benefits of doing so. This week I integrated more CDK Solutions Constructs. CDK Solutions Constructs are CDK Constructs which encapsulate often used Cloudformation Patterns. You can read more about them in [Part I](https://martinmueller.dev/cdk-solutions-constructs).

# Cloudfront S3
In GitHub, this is the [Cloudfront S3](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-cloudfront-s3) Solution Construct. It implements a Cloudfront in front of an S3 bucket. This allows for a higher performance distribution of files because they are cached and distributed on the edge using a content delivery network. With the Cloudfront S3 Solution Pattern comes some great well-architected aspects like HTTP security headers and buckets for CDN and S3 access logs.

```TypeScript
const { CloudFrontToS3 } = require('@aws-solutions-constructs/aws-cloudfront-s3');

new CloudFrontToS3(stack, 'test-cloudfront-s3', {
    deployBucket: true
});
```

I planed to use this pattern to extend the S3 Static website, because it already has a cloudfront as well. However, the Cloudfront S3 Solution Construct does not support static websites. Therefore I cannot use it for my stack. What matters is that I learned a lot about this solution construct and now I know what I can't use it for, which is useful!

# SQS Lambda
The [SQS Lambda](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-sqs-lambda) Solution Construct is an exciting pattern that connects a queue from the Simple Queue Service (SQS for short) to a Lambda and thus forwards the queue messages to the Lambda for further processing. The queue and the Lambda only receive the required permissions. In addition, the SQS Lambda Solution Construct also deploys a Dead Letter Queue that is used to store and process failed messages.

```TypeScript
const { SqsToLambda } = require('@aws-solutions-constructs/aws-sqs-lambda');

new SqsToLambda(stack, 'SqsToLambdaPattern', {
    deployLambda: true,
    lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_12_X
        handler: 'index.handler',
        code: lambda.code.asset(`${__dirname}/lambda`)
    }
});
```

I need this Solution Construct because the DynamoDB Stream to Lambda Solution Construct mentioned in [Part I](https://martinmueller.dev/cdk-solutions-constructs-eng) showed a strange behaviour by occasionally duplicating event messages. With the SQS Lambda Solution Construct I was able to create a FIFO SQS which now has the additional advantages mentioned in the previous paragraph.

# Lambda DynamoDB
A simple but nevertheless great Solution Construct is the [Lambda DynamoDB](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-lambda-dynamodb). It perfectly standardizes the connection of a Lambda to a DynamoDB. If required, an existing DynamoDB table can be used or a new one created:

```TypeScript
const { LambdaToDynamoDB } = require('@aws-solutions-constructs/aws-lambda-dynamodb');

new LambdaToDynamoDB(stack, 'test-lambda-dynamodb-stack', {
    deployLambda: true,
    lambdaFunctionProps: {
        code: lambda.code.asset(`${__dirname}/lambda`),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler'
    },
    //optionally pass existing table
    existingTableObj: ddbTable
});
```

As part of the solution construct the DynamoDB access privileges are granted to the Lambda. Also, after the table is created or forwarded, an environment variable is passed to the Lambda, which contains the name of the table. This way the table is easy accessible with the Lambda:

```TypeScript
// Copied from Solution Construct Repo
this.lambdaFunction.addEnvironment('DDB_TABLE_NAME', this.dynamoTable.tableName);

// Usage within the Lambda
const DDB_TABLE_NAME = process.env.DDB_TABLE_NAME || ''
```

# Summary
The next CDK Solutions Constructs could be successfully integrated. When working with the CDK Solution Constructs I ask myself if it makes sense to build own Solution Constructs. This would have the advantage of abstracting the infrastructure. However, the disadvantages are that not much consideration is given to the [well-architected Framework](https://aws.amazon.com/architecture/well-architected/).

A further disadvantage would be that the self-created Solution Constructs should of course be maintained and further developed, which would require an additional efforts. The Use Case will decide about the sense of creating your own Solutions Constructs. Until then, you can and should use the existing AWS CDK Solution Constructs, because they are open source on Git and the strong AWS community maintains and develops them further. I could even contribute back to fix a bug. Let me know about your experience with CDK Solutions Constructs :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>