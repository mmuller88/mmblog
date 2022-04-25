---
title: Weekly Newsletter from martinmueller.dev 2022/04/18-24
show: "yes"
date: "2022-03-25"
image: "diagram.png"
tags: ["eng", "2022", "newsletter"] #nofeed
# gerUrl: https://martinmueller.dev/cdk-dia
pruneLength: 50 #ihr
---

In this weekly newsletter, I write a summary of posts that got my attention during the week. I center around topics AWS, DevOps, Architecture, AWS CDK, Data Engineering, Data Analytics and much more.

If you like my content follow me on my usual spots to hang around:

- https://twitter.com/MartinMueller_
- https://www.linkedin.com/in/martinmueller88
- https://github.com/mmuller88
- https://dev.to/mmuller88
- https://martinmueller.dev

## Self-healing

https://dev.to/jobber/self-healing-code-46o9

Self-healing code with graceful degradation. Very cool idea that the solution keeps running with limited functionality even when a large portion of it doesn't work properly. There should be/are plenty of examples where Netflix or Amazon is doing stuff like that. The author even takes it a step further like having a read-replica database to keep serving HTTP GET reads but blocking writes when the main database is down and an HTTP GET write is requested. That approach sounds very promising in general and probably can be transferred to other similar situations as well.

## Fuck-up-Stories

https://t3n.de/news/fuckups-fehler-fehlerkultur-fehlermanagment-1459624

Interesting content about Fuck-up-Stories in Companies and how healthy they can be when doing in a company. In the long term, it can increase the revenue of a company.

## Jaeger QuickStart

https://betterprogramming.pub/introducing-jaeger-quick-start-deploying-on-aws-f0ee5d398e8a
A post about Jaeger and how to run it in a QuickStart. Interesting as I didn't work much with Jaeger so much. It highlights how cool such Quick Starts are for starting quick :). Very interesting seems to be the fact that you can combine Jaeger with AWS X-Ray.

## Joining DevOps

https://www.reddit.com/r/devops/comments/u7p6w9/joining_devops/

A new DevOps Junior after getting a DevOps-ish Job asking for help with where to start in the DevOps.

## Lambda with AWS CDK and EFS

https://dev.to/wesleycheek/lambda-function-with-persistent-file-store-using-aws-cdk-and-aws-efs-45h8

Deploy AWS Lambda with CDK and EFS attached to it.

## AWS Well-Architected - Security Pillar

https://dev.to/sebastiantorres86/aws-well-architected-framework-security-pillar-2jhc

A nice summary whey security and what is important regarding AWS Security. Have a nice best practice list.

## API Design - GraphQL vs Rest

https://dev.to/wundergraph/api-design-best-practices-for-long-running-operations-graphql-vs-rest-1mkb

Has an interesting example of how asynchronous API can be done asynchronous API with GraphQL and REST API. Then the author compares the GraphQL and REST API solutions with each other.

## AWS Step Function scheduler for EKS nodes

https://www.automat-it.com/post/custom-kubernetes-scheduler-with-eks-and-step-functions-for-machine-learning-workloads

Cool solution for how to start EKS nodes when they are needed with Step Function.

## Amazon DevOps Guru for serverless

https://aws.amazon.com/blogs/aws/automatically-detect-operational-issues-in-lambda-functions-with-amazon-devops-guru-for-serverless/

DevOps Guru for Serverless seems super interesting for like optimizing your serverless deployments

## AWS Organizations and AWS SSO

https://www.reddit.com/r/aws/comments/u9niif/aws_organizations_and_aws_sso/

A Reddit question for how to set up AWS Organizations and AWS SSO. I recommended giving https://github.com/superwerker/superwerker a try.

## VPN tunnel with AWS

https://www.thenetworkdna.com/2022/01/site-to-site-vpn-tunnel-from-aws-to.html

VPN tunneling is already a tough topic at least for me. Cool instructions but I would prefer to have it as code somehow.

## AWS Policy as Code

https://dev.to/aws-builders/introduction-to-policy-as-code-5bma

Policy as Code is getting more and more attraction. As an AWS CDK fanboy, I guess I do that for many years now ^^.

## Software Architecture and Abstraction

https://dev.to/vickodev/software-architecture-and-abstraction-for-newbie-3nob

Very interesting post about what is a software architecture, software design patterns and abstractions.

## Final Words

Thank you to the authors of those amazing posts. And thank you to the readers of the newsletter. When you like this format or know how to improve it please let me know :). Let's Build!

I love to work on Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

OR

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)
