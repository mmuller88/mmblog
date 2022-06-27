---
title: Newsletter martinmueller.dev 2022 week 23
show: "yes"
date: "2022-06-12"
tags: ["eng", "2022", "newsletter", "aws", "devops", "serverless"] #nofeed
pruneLength: 50
---

In this weekly newsletter, I write a summary of posts that got my attention during the week. I center around topics AWS, DevOps, Architecture, AWS CDK, Data Engineering, Data Analytics and much more.

If you like my content follow me on my usual spots to hang around:

- <https://twitter.com/MartinMueller_>
- <https://www.linkedin.com/in/martinmueller88>
- <https://github.com/mmuller88>
- <https://dev.to/mmuller88>
- <https://martinmueller.dev>

## As a developer, how to estimate the time for a task?

<https://dev.to/ms_yogii/as-a-developer-how-to-estimate-the-time-for-a-task-44b>

Article about how to estimate tasks. It explains very well why it is hard to estimate the time you will spend on a task and how you can improve that. My highlight is the advice to divide your task into smaller chunks that are less than 30 minutes in time efforts.

Thanks a lot to the author [Yogini Bende](https://dev.to/ms_yogii)

## AWS Step Functions — Are Active Executions Affected When Your State Machine Gets Updated?

<https://dev.to/pubudusj/aws-step-functions-are-active-executions-affected-when-your-state-machine-gets-updated-5dfn>

The author highlights an interesting detail when using Lambda as part of an AWS Step Function workflow. Use Lambda Versions if you want to ensure to not update current Step Functions executions. But if you always want to update then don't use Lambda Versions. Please read the article for more details!

Thanks a lot to the author [Pubudu Jayawardana](https://dev.to/pubudusj)

## 7 Pillars of Cloud Cost Optimization

<https://www.linkedin.com/pulse/7-pillars-cloud-cost-optimization-shashank-abhishek/>

Nice deep dive into how to optimize AWS costs. Though point 4 "Use Savings Plans" is not always a good choice in my opinion. One reason against it is that as AWS moves fast with like-new Ec2 tiers it might be better to go with on-demand and change dynamically the tier. It always depends I guess ^^. Anyway, it is a super good article :).

Thanks a lot to the author [Shashank Abhishek](https://www.linkedin.com/in/shashankabhishek/)

## Seamless Integration with Remote Docker Hosts for Development

<https://medium.com/geekculture/seamless-integration-with-remote-docker-hosts-for-development-7a369d94812f>

Interesting article on how to run docker on a remote docker host. Though I miss a little bit of the use case or why a developer would like to do that.

Thanks a lot to the author [Domenico Sibilio](https://medium.com/@domenicosibilio)

## Briten testen 4-Tage-Woche – von der Frittenbude bis zur Software-Firma

translated: Brits test 4-day week - from the fish and chips shop to software company

<https://t3n.de/news/briten-testen-4-tage-woche-grossbritannien-1477699>

Super interesting article about some companies from the UK wanting to try the 4 days week. I am a huge fan of the 4 days week. I am convinced it increases productivity in many areas.

Thanks a lot to the author [Andreas Weck](https://t3n.de/redaktion/andreas-weck)

## Cost Optimizations in AWS - Part 1

<https://dev.to/alsaheem/cost-optimizations-in-aws-part-1-25mn>

Nice article about how to optimize your AWS costs.

Thanks a lot to the author [Adebisi ayomide](https://dev.to/alsaheem)

## How to create a software test plan?

<https://aqua-cloud.io/create-software-testing-plan/>

Super nice deep dive into testing with highlighting important requirements. As well gives you a developing test plan with concrete steps. Super useful!

Thanks a lot to the authors [Denis Matusovskiy](https://aqua-cloud.io/author/denis-matusovskiy/) and [Robert Weingartz](https://aqua-cloud.io/author/robert-weingartz/)

## How did I create EC2 by Voice?

<https://dev.to/aws-builders/how-did-i-created-ec2-by-voice-2p54>

Super creative idea how can with the use of AWS Transcribe and Lambda create an Ec2 instance by voice. Very cool!

Thanks a lot to the author [Mohamed Latfalla](https://dev.to/imohd23)

## Terraform vs Pulumi vs CloudFormation: Best Choice for 2022

<https://docs.multy.dev/blog/iac-comparison>

Very nice comparison between the Infrastructure as Code Tools like Terraform, Pulumi and CloudFormation.

Thanks a lot to the author [João Coelho](https://www.linkedin.com/in/jo%C3%A3o-coelho-843472a7/)

## Auth Portal powered by AWS/AzureAD and built with CDKs

<https://faun.pub/aws-aad-auth-portal-cdk-56c782e3a048>

Uh nice using AWS CDK or CDKTF to connect AWS Cognito with Azure AD. That are exciting combinations. The author as well highlights the easy testability of AWS CDK and CDKTF. Must read!

Thanks a lot to the author [SEB](https://medium.com/@sebolabs)

## AWS Inspector: A Guide to Discover Your Security Holes

<https://adamtheautomator.com/aws-inspector/>

How to use AWS Inspector for security. Explains first how to enable the AWS Inspector. Then the author explains how to inspect Ec2 instances with it and how to interpret the findings.

Thanks a lot to the author []()

## A Guide to AWS Certifications

<https://dev.to/aws-builders/a-guide-to-aws-certifications-40ff>

A deep dive into AWS certificates. Very useful for reading if you planning to do an associate or professional exam. In the end it

Thanks a lot to the author [Karl Mathias Moberg](https://dev.to/kmoberg)

## How to Improve Developer Experience: 7 Things to Change

<https://dev.to/nimbusenv/how-to-improve-developer-experience-7-things-to-change-3c5e>

Very nice and deep article on how to improve the developer experience. There are a lot of good tips and is hard for me to pick my favorite one. So I suggest you read them all :)!

Thanks a lot to the author [Nimbus](https://dev.to/nimbusenv)

## Hugo vs. Gatsby.js

<https://dev.to/cloudcannon/hugo-vs-gatsbyjs-35gd>

Thanks a lot! This post is super informative. The author compares Gatsbyjs with Hugo like when you should take what. Yeah, many years ago I was choosing GatsBy because I eventually wanted to use components :). And I am about to implement components.

Thanks a lot to the author [David Large](https://dev.to/avidlarge)

## New Observability Features for AWS Step Functions

<https://www.infoq.com/news/2022/06/aws-step-functions-observability>

That is an interesting update about AWS Step Functions observability updates. I like the new different views Graph view, Table view and Event view.

Thanks a lot to the author [Steef-Jan Wiggers](https://www.infoq.com/profile/Steef~Jan-Wiggers/)

## 10 Secure Coding Best Practices to Follow in Every Project

<https://dev.to/smartscanner/10-secure-coding-best-practices-to-follow-in-every-project-1i9h>

Useful best practices for coding. My highlight is the "Process an Open-Source Spirit" where the author explains how to prepare the project to be consumable as an Open-Source project.

Thanks a lot to the author [SmartScanner](https://dev.to/smartscanner)

## Final Words

Thank you to the authors of those amazing posts. And thank you to the readers of the newsletter. When you like this format or know how to improve it please let me know :). Let's Build!

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
