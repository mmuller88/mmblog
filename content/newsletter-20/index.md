---
title: Newsletter martinmueller.dev 2022 week 20
show: "yes"
date: "2022-05-22"
tags: ["eng", "2022", "newsletter", "aws", "devops"] #nofeed
pruneLength: 50
---

In this weekly newsletter, I write a summary of posts that got my attention during the week. I center around topics AWS, DevOps, Architecture, AWS CDK, Data Engineering, Data Analytics and much more.

If you like my content follow me on my usual spots to hang around:

- <https://twitter.com/MartinMueller_>
- <https://www.linkedin.com/in/martinmueller88>
- <https://github.com/mmuller88>
- <https://dev.to/mmuller88>
- <https://martinmueller.dev>

## What exactly is Frontmatter?

<https://dev.to/dailydevtips1/what-exactly-is-frontmatter-123g>

Explains what Frontmatter is. I didn't realize that I already use it for my blog post Gatsby side martinmueller.dev :D.

Thanks a lot to the author [Chris Bongers](https://dev.to/dailydevtips1)

## How to work around CloudFormation circular dependencies

<https://theburningmonk.com/2022/05/how-to-work-around-cloudformation-circular-dependencies/>

Super interesting. CloudFormation circular dependencies are an often encountered problem when working with CloudFormation or with AWS CDK (which is basically CloudFormation). So this article is super useful for how to resolve those.

Thanks a lot to the Serverless Hero [Yan Cui](https://theburningmonk.com/)

## Why CI/CD? How was a life without CI/CD & how is it now?

<https://dev.to/wardaliaqat01/why-cicd-how-was-a-life-without-cicd-how-is-it-now-46bl>

A good and comprehensive article on why CI/CD is so awesome. Use this article to sell CI/CD to whomever ^^.

Thanks a lot to the author [Warda Liaqat](https://dev.to/wardaliaqat01)

## Improve DX by publishing an API SDK - a CDK Serverless example

<https://www.rehanvdm.com/blog/improve-dx-publishing-an-api-sdk-cdk-serverless>

Uii an API SDK is a nice idea. For me, that looks similar to OpenAPI / Swagger SDKs. It seems to be a smart combination of OpenAPI SDK and TypeScript. Plus with a sophisticated CI/CD flow like posting to slack you can make developers earlier aware of SDK changes. Interesting idea please read the full article!

Thanks a lot to the author [Rehan van der Merwe](https://www.rehanvdm.com/)

## Security Iceberg: AWS Security Hub the right way

<https://cloudonaut.io/security-iceberg-aws-security-hub-the-right-way/>

A nice introduction and roundup about AWS Security Hub. Gives as well some tips when working with it.

Thanks a lot to the author [Andreas Wittig](https://twitter.com/andreaswittig)

## Solutions Architect Tips: How to Build Your First Architecture Diagram

<https://www.readysetcloud.io/blog/allen.helton/how-to-build-your-first-architecture-diagram/>

An interesting article about architecture diagrams. It introduced and recommends the use of c4model which is super interesting <https://c4model.com/#SystemContextDiagram> .

Thanks a lot to the author [Allen Helton](https://www.readysetcloud.io/)

## Docs for Everyone

<https://dev.to/meganesulli/docs-for-everyone-28pm>

Nice article about how to write meaningful documentation. Highlights the importance of diagrams.

Thanks a lot to the author [Megan Sullivan](https://dev.to/meganesulli)

## What makes a good DevOps manager?

<https://www.reddit.com/r/devops/comments/ustzqj/what_makes_a_good_devops_manager>

A great discussion about what makes a great DevOps Manager.

## What Are AWS CDK Constructs, Stacks and How To Use Them

<https://interweave.cloud/2022/05/17/what-are-aws-cdk-constructs-stacks-and-how-to-use-them/>

A good explanation about AWS CDK level 1, 2 and 3 constructs.

Thanks a lot to the author [Faizan Raza](https://interweave.cloud/author/faizanraza-interweave/)

## Introduction to AWS Developer Tools - Part 1

<https://dev.to/kcdchennai/introduction-to-aws-developer-tools-part-1-590b>

Super cool overview and summary of existing AWS Developer Tools. My highlight is [cloud9](https://aws.amazon.com/cloud9/). Look at the article if you want to know why.

Thanks a lot to the author [MakendranG](https://dev.to/makendrang)

## Source Control your AWS CloudFormation templates with GitHub

<https://dev.to/techielass/source-control-your-aws-cloudformation-templates-with-github-8im>

This is a cool article about how to manage your CloudFormation template via GitHub Actions like linting and more. But yeah I would recommend not using CloudFormation directly and using AWS CDK :).

Thanks a lot to the author [Sarah Lean](https://dev.to/techielass)

## Getting started with testing DynamoDB code in Python

<https://dev.to/aws-builders/getting-started-with-testing-dynamodb-code-in-python-dif>

Interesting post about testing DynamoDB code in Python. You can use the python package moto to mock the AWS Service. That is super cool and how I used to when I am working with jest in TypeScript. Super cool that Python has something similar :). So I recommend reading the full article if you are interested in programming AWS CDK or AWS SDK with Python.

Thanks a lot to the author [Maurice Borgmeier](https://dev.to/mauricebrg)

## Is This Thing On? Giving an Effective Talk In Person

https://dev.to/aws-builders/is-this-thing-on-giving-an-effective-talk-in-person-887

An interesting talk about public speaking. The author gives tips on how to improve public speaking.

Thanks a lot to the author [Kristi Perreault](https://dev.to/kristiperreault)

## ESLint and Prettier

https://dev.to/suchintan/eslint-and-prettier-51e0

Nice post about why eslint and prettier are important.

Thanks a lot to the author [SUCHINTAN DAS](https://dev.to/suchintan)

## Open Source Projects

In this section, I list Open Source projects I find super interesting!

## json-schema-to-typescript

<https://www.npmjs.com/package/json-schema-to-typescript>

Import TypeScript type from JSON. That was always a disadvantage when a client wanted me to use a JSON file as input for CDK properties. It is super cool that it seems you easily can infer the type.

## Final Words

Thank you to the authors of those amazing posts. And thank you to the readers of the newsletter. When you like this format or know how to improve it please let me know :). Let's Build!

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
