---
title: Newsletter martinmueller.dev 2022 week 28
show: "yes"
date: "2022-07-17"
tags: ["eng", "2022", "newsletter", "aws", "devops"] #nofeed
pruneLength: 50
---

In this weekly newsletter, I write a summary of posts that got my attention during the week. I center around topics AWS, DevOps, Architecture, AWS CDK, Serverless, Data Engineering, Data Analytics and much more.

If you like my content follow me on my usual spots to hang around:

- <https://twitter.com/MartinMueller_>
- <https://www.linkedin.com/in/martinmueller88>
- <https://github.com/mmuller88>
- <https://dev.to/mmuller88>
- <https://martinmueller.dev>

## Automating AWS account bootstrapping with AWS-CDK

<https://medium.com/@andrewfrazer/automating-aws-account-bootstrapping-with-aws-cdk-117e5ead1c51>

Super interesting article on how to CDK bootstrap new accounts in a more DevOps way. Very cool is the idea that whenever a new account is created with Control Tower that will trigger an AWS CodeBuild job to bootstrap the account.

Thanks a lot to the author [Andrew Frazer](https://medium.com/@andrewfrazer). And thank you for being a very active member of the CDK Community.

## The Cost of Production Blindness

<https://dev.to/codenameone/the-cost-of-production-blindness-48aj>

Super nice input in one of my favorite topics production. I totally agree that we need to peek more into production. What is the problem when you don't do that and some attempts how to do it are explained in this article.

Thanks a lot to the author [Shai Almog](https://dev.to/codenameone)

## Why Do Developers Prefer Linux?

<https://dev.to/techmaniacc/why-do-developers-prefer-linux-32a3>

An interesting explanation of why developers prefer Linux. If you only compare Windows and Linux, I tend to agree with the points but the comparison with macOS is missing. Sure you could argue that macOS is close to Linux.

Thanks a lot to the author [Joseph Mania](https://dev.to/techmaniacc)

## Streams in NodeJS

<https://dev.to/kalashin1/streams-in-nodejs-2b8l>

A nice article about the concept of streams. I used them a couple of times like in Data Engineering projects as I find them super useful for effectively processing big text data. In special the piping feature for connecting streams is super cool.

Thanks a lot to the author [Kinanee Samson](https://dev.to/kalashin1)

## Two ways to directly integrate AWS Lambda function with Amazon API Gateway

<https://dev.to/aws-builders/two-ways-to-directly-integrate-aws-lambda-function-with-amazon-api-gateway-3can>

The article explains the two different types/ways how to connect an AWS API Gateway with a Lambda. That is the proxy and non-proxy type. Usually, you are using the proxy type. TBH. I never used the non-proxy type so it is interesting to read about it!

Thanks a lot to the author [Wojciech Matuszewski](https://dev.to/wojciechmatuszewski)

## The best password manager on Linux?

<https://dev.to/robole/the-best-password-manager-on-linux-f3c>

Highlights KeePassXC as noncloud hosted password manager. I use it for some years now and I like it too :). I use it for Mac laptops as well.

Thanks a lot to the author [Rob OLeary](https://dev.to/robole)

## Programming Myths vs Facts

<https://dev.to/qavsdev/programming-myths-vs-facts-5cja>

A nice Myths vs Facts for programming. It gives a better insight into what programmers are doing and clarifies some wrong expectations. I like!

Thanks a lot to the author [QAvsDEV](https://dev.to/qavsdev)

## Help - A little overwhelmed in DevOps

<https://www.reddit.com/r/devops/comments/vwgu5b/help_a_little_overwhelmed_in_devops/>

A nice discussion to give a kind of a small roadmap for DevOps and helps to understand wrong expectations about DevOps.

## AppSync and DynamoDB Lessons Learned

<https://instil.co/blog/appsync-dynamodb-lessons-learned/>

Exciting discussion with like DynamoDB single vs multi-table design. I personally favor multi-table design supported with Amplify AppSync.

Thanks a lot to the author Matthew Wilson

## History of APIs

<https://dev.to/littleironical/history-of-apis-281j>

An interesting history roundtrip about APIs

Thanks a lot to the author [Hardik kumar](https://dev.to/littleironical)

## Investigating 15s HTTP response time in AWS ECS

<https://dev.to/gwenshap/investigating-15s-http-response-time-in-aws-ecs-2gge>

An interesting story about investigating a long response time when using AWS ECS in multiple availability zones.

Thanks a lot to the author [Gwen (Chen) Shapira](https://dev.to/gwenshap)

## How to ask for help

<https://dev.to/dhravya/how-to-ask-for-help-2690>

Super article about how to ask correctly for help in like a community.

Thanks a lot to the author [Dhravya](https://dev.to/dhravya)

## Final Words

Thank you to the authors of those amazing posts. And thank you to the readers of the newsletter. When you like this format or know how to improve it please let me know :). Let's Build!

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
