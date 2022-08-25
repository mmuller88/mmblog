---
title: Newsletter martinmueller.dev 2022 week 31
show: "yes"
date: "2022-08-07"
tags: ["eng", "2022", "newsletter", "aws", "devops"] #nofeed
pruneLength: 50
---

This week was my first week solely working as a freelancer. That is scary but exciting too :)!

In this weekly newsletter, I write a summary of posts that got my attention during the week. I center around topics AWS, DevOps, Architecture, AWS CDK, Serverless, Data Engineering, Data Analytics and much more.

If you like my content follow me on my usual spots to hang around:

- <https://twitter.com/MartinMueller_>
- <https://www.linkedin.com/in/martinmueller88>
- <https://github.com/mmuller88>
- <https://dev.to/mmuller88>
- <https://martinmueller.dev>

## Aurora Serverless v2 PostgreSQL vs. provisioned Aurora PostgreSQL

<https://towardsaws.com/aurora-serverless-v2-postgresql-vs-provisioned-aurora-postgresql-f60a93b99b83>

That is an interesting article that compares the costs from Aurora Serverless v2 PostgreSQL vs Aurora PostgreSQL. And as you can read in the article it isn't always cheaper! Actually, it seems Aurora Serverless should be avoided when you have high DB traffic. So therefore perhaps use it for development and later consider switching to Aurora on-demand!

Thanks a lot to the author [Ian Binder](https://medium.com/@ianbinder)

## CDK: Certificate Handling with Custom Resources

<https://blog.56k.cloud/cdk-certificate-handling-with-custom-resources/>

In this article, the author uses AWS CDK Custom Resources to solve a problem with DNS validating a certificate. As the custom domain isn't managed by Route 53 you can't use the standard route53 constructs to do that. Super smart how the author solved it by using a custom resource.

Thanks a lot to the author [Jochen Zehnder](https://blog.56k.cloud/author/jochen/)

## Containers vs Serverless

<https://greengocloud.com/2018/10/07/Containers-vs-Serverless/>

Super experiment article about containers vs serverless. It gives a short introduction to each and then the author gives his opinion. I agree with the author. If you want to know whom we are betting on then read the article!

Thanks a lot to the author [Blake Green](https://greengocloud.com/about/).

## Allow only what your Lambda code needs

<https://dev.to/aws-builders/allow-only-what-your-lambda-code-needs-59f2>

A nice article to explain the necessity of least-privilege IAM permissions.

Thanks a lot to the author [Jones Zachariah Noel](https://dev.to/zachjonesnoel)

## Pros and Cons of Public Cloud WAFs

<https://thenewstack.io/pros-and-cons-of-public-cloud-wafs/>

A critical summary of public Cloud WAF and when you should and shouldn't use them.

Thanks a lot to the author [Alessandro Fael Garcia](https://www.linkedin.com/in/alessfg)

## It's never too late: Mechanical engineer to Web developer

<https://dev.to/sagarpanchal0055/its-never-too-late-mechanical-engineer-to-web-developer-58di>

An impressive short story from an engineer changing career from a mechanical engineer to a web developer. Very cool and inspiring :)!

Thanks a lot to the author [Sagar Panchal](https://dev.to/sagarpanchal0055)

## Styled Components in Material UI (MUI) with Styled Utility

<https://dev.to/rasaf_ibrahim/styled-components-in-material-ui-mui-with-styled-utility-3l3j>

A nice example of how to use React-styled components together with MUI / (former Material UI).

Thanks a lot to the author [Rasaf Ibrahim](https://dev.to/rasaf_ibrahim)

## What Does The Future Hold For Serverless?

<https://www.readysetcloud.io/blog/allen.helton/what-does-the-future-hold-for-serverless/>

Super exciting article is about the future development of serverless. I totally agree that more analytic tools/capabilities on how to optimize the architecture would be great.

Thanks a lot to the author Allen Helton.

## Is AWS support really this terrible?

<https://www.reddit.com/r/aws/comments/wf79q9/is_aws_support_really_this_terrible/>

An interesting discussion about how the support with AWS is and how it can be improved.

## Selling an AMI and a CloudFormation template as an alternative to SaaS

<https://cloudonaut.io/selling-ami-cloudformation-alternative-saas/>

Interesting article on how to use the AWS Marketplace with AMI and CloudFormation type to earn money. As well the story of product marbot from cloudonaut.io is super fascinating.

Thanks a lot to the author Andreas Wittig

## DynamoDB Pros & Cons

<https://dev.to/roy8/dynamodb-pros-cons-k2a>

A short introduction to AWS DynamoDB. Really good if you don't know much about DynamoDB.

Thanks a lot to the author [Roy](https://dev.to/roy8)

## Managing Secrets in Your DevOps Pipeline

<https://thenewstack.io/managing-secrets-in-your-devops-pipeline/>

Contains some useful guidelines when managing secrets.

Thanks a lot to the author [PAVAN BELAGATTI](https://thenewstack.io/author/pavan-belagatti/)

## A Simple Guide to CI/CD For Total Beginners in 2022

<https://dev.to/hackmamba/a-simple-guide-to-cicd-for-total-beginners-in-2022-2kgp>

Explains the idea of CI/CD and why we need it. Gives a quick round trip for some CI/CD tools.

Thanks a lot to the author [Scofield Idehen](https://dev.to/scofieldidehen)

## Final Words

Thank you to the authors of those amazing posts. And thank you to the readers of the newsletter. When you like this format or know how to improve it please let me know :). Let's Build!

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
