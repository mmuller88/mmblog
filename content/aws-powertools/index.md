---
title: Getting started with Powertools for AWS Lambda (TypeScript)
show: "no"
date: "2023-12-20"
image: "index.webp"
tags: ["eng", "2023", "aws", "powertools" "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/aws-powertools
pruneLength: 50
---

Hi there,

I'm new to the [Powertools for AWS Lambda (TypeScript)](https://docs.powertools.aws.dev/lambda/typescript/latest/) library. Though I hear a lot of my DevOps friends say that it's a great tool for building serverless applications, I've never had the chance to use it myself. So I decided to give it a try and see what all the fuss is about. What can I say, I totally love it. In the next sections I will explain what the.

## What is Powertools for AWS Lambda

Powertools for AWS Lambda is a collection of utilities, patterns, and best practices for writing AWS Lambda functions in Python, Typescript, Java and DotNet. It includes logging, tracing, custom metrics, and more. The goal of this project is to enable developers to build scalable and robust serverless applications easily.

## Why I am using AWS Lambda Powertools

I'm a huge DevOps fanboy so I'm all over for techniques like Infrastructure as Code (IaC) or Serverless. Pretty cool about those that it helps me to focus on my business logic of my software product rather then wasting time in setting it up. Powertools feels pretty similar as it helps me to easy implement certain goodies as logging or tracing without the need to spend much time.

Certainly my main motivation is the Powertools logger library. The logger library helps you to write my Lambda logs in specific format to enable features like log levels and log queries with AWS CloudWatch Logs Insights. So far that is amazingly great and it gives me a powerful insight into my Lambda.

I'm using Powertools for me newest AI MVP. Part of the MVP is a Lambda where I call the AWS Bedrock API. Furthermore I automatically validate the LLM response. For more details see https://martinmueller.dev/aws-bedrock-validation.

## How to start?

* Started here https://github.com/aws-powertools/powertools-lambda-typescript with AWS CDK example to integrate.

## Outlook

The idempotency feature seems super cool and we could totally us it for our AI MVP. It could help to reduce the quite high costs of using the AWS Bedrock API. But unfortunately idempotency doesn't seem to be combinable with Lambda stream response. Hopefully that will change in future 🤞.

## Conclusion

Working with AWS Lambda Powertools Typescript ...

I hope you found this post helpful, and I look forward to sharing more with you in the future.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on the:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
