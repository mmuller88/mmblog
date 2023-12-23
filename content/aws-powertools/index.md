---
title: My experience with Powertools for AWS Lambda (TypeScript)
show: "yes"
date: "2023-12-23"
image: "index.png"
tags: ["eng", "2023", "aws", "powertools"] #nofeed
# engUrl: https://martinmueller.dev/aws-powertools
pruneLength: 50
---

Hi there,

I'm new to [Powertools for AWS Lambda (TypeScript)](https://docs.powertools.aws.dev/lambda/typescript/latest/). Though I hear a lot of my DevOps friends say that it's a great tool for building serverless applications, I've never had the chance to use it myself. So I decided to give it a try and see what all the fuss is about. What can I say, I totally love it. In the next sections I will explain what the.

## What is Powertools for AWS Lambda

Powertools for AWS Lambda is a collection of utilities, patterns, and best practices for writing AWS Lambda functions in Python, Typescript, Java and DotNet. It includes logging, tracing, custom metrics, and more. The goal of this project is to enable developers to build scalable and robust serverless applications easily.

## Why I am using AWS Lambda Powertools

I'm a huge DevOps fanboy so I'm all over for techniques like Infrastructure as Code (IaC) or Serverless. Pretty cool about those that it helps me to focus on my business logic of my software product rather then wasting time in setting it up. Powertools feels pretty similar as it helps me to easy implement certain goodies as logging or tracing without the need to spend much time.

Certainly my main motivation is the Powertools logger library. The logger library helps you to write my Lambda logs in specific format to enable features like log levels and log queries with AWS CloudWatch Logs Insights. So far that is amazingly great and it gives me a powerful insight into my Lambda.

I'm using Powertools for me newest AI MVP. Part of the MVP is a Lambda where I call the AWS Bedrock API. Furthermore I automatically validate the LLM response. For more details see https://martinmueller.dev/aws-bedrock-validation.

## How to start?

The Powertools GitHub repository offers nice examples to integrate and learn from. For example [here](https://github.com/aws-powertools/powertools-lambda-typescript) are nice example written in AWS CDK. Following I will list the features I gained some experience with.

## Logger

The logger is super fun to use! It gives me a powerful insight into my lambdas. Though I'm still not super sure when to use the different log levels and when and what objects I should put into the object logger part. But I will keep learning from my DevOps friends and make my own experience. Ultimately I will know better when I truly need insight via Logs Insights.

## Parameters

The parameters feature is super cool. It helps me to easily access the parameters I defined in my AWS CDK stacks. I can access them via the `get` function. So far I only used it for getting secrets from the secrets manager but I'm super excited to use it for more like perhaps app configurations.

## Idempotency

The idempotency feature seems super useful. It could help to reduce the quite high costs of using the AWS Bedrock API. But unfortunately idempotency isn't currently combinable with Lambda stream response. Hopefully that will change in future 🤞.

## Resources to learn utilizing Powertools

Here's a list of examples I found helpful to learn how to apply Powertools:

- https://github.com/aws-powertools/powertools-lambda-typescript
- https://github.com/leegilmorecode/embedded-aws-cloudwatch-dashboards/tree/main [Lee Gilmore](https://github.com/leegilmorecode)

## Conclusion

Working with AWS Lambda Powertools Typescript totally make sense and I love it. It will definitely be my default choice when developing my next Lambda. I still need to learn how to use it properly. Please if you have any feedback how I can utilize Powertools better, reach out to me!

I hope you found this post helpful, and I look forward to sharing more with you in the future.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on the:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
