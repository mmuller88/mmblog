---
title: Weekly Newsletter from martinmueller.dev 2022/05/02-08
show: "no"
date: "2022-05-08"
tags: ["eng", "2022", "newsletter", "nofeed"] #nofeed
pruneLength: 50
---

In this weekly newsletter, I write a summary of posts that got my attention during the week. I center around topics AWS, DevOps, Architecture, AWS CDK, Data Engineering, Data Analytics and much more.

If you like my content follow me on my usual spots to hang around:

- <https://twitter.com/MartinMueller_>
- <https://www.linkedin.com/in/martinmueller88>
- <https://github.com/mmuller88>
- <https://dev.to/mmuller88>
- <https://martinmueller.dev>

## Getting started with Git and Github

<https://dev.to/mbugua70/getting-started-with-git-and-github-3mg>

Good roundup for what is Git and the most important commands. It would help you to get more familar with the Git CLI which make me for example very productive. Furthermore I recommend setting this alias:

```bash
alias ginit="git add --all && git commit -m "init" && git push"

gaddall() { git add --all && git commit -m "$1" && git push; }
alias gall="gaddall"
```

So with that I just need line ginit or gall for quickly adding the commit. That was a super productive boost for me.

## 17 Ridiculously Funny Programming Memes that Every Developer Can Relate To

<https://dev.to/muthuannamalai12/17-ridiculously-funny-programming-memes-that-every-developer-can-relate-to-2gg3>

A very good brain relax and it is super funny.

## Obsidian - An IDE for your Brain

<https://dev.to/envoy_/obsidian-an-ide-for-your-brain-1bn7>

I used Obsidian for some weeks and is really cool. But I figured that VS Code is kind of better when it come to writing / organizing my content. Probably combining both like VS Code for writing and Obsidian for viewing seems interesting.

## How to avoid AWS unintentional charges?

<https://www.internetkatta.com/how-to-avoid-aws-unintentional-charges>

Recommend to use "AWS Pricing Calculator" to evaluate your pricing model.

## Optimize your workloads for Sustainability

<https://globaldatanet.com/tech-blog/optimize-your-workloads-for-sustainability>

Super good roundup about sustainability with AWS. Explains the shared responsibility between AWS and customer and provides some very useful tips for how to reduce the resource footprint. Thanks to the author [David Krohn](https://globaldatanet.com/our-team/david-krohn).

## 🤡 AWS CDK 101 - 🤾‍♂ Using layers in Lambda functions and saving JSON to S3

<https://dev.to/aravindvcyber/aws-cdk-101-using-layers-in-lambda-functions-and-saving-json-to-s3-46fg>

Super interesting article about how and why to use Lamba Layers. TBH I always avoided them but that might change because of this post. Thanks to [Aravind V](https://dev.to/aravindvcyber).

## AWS Step Functions 101

<https://dashbird.io/blog/ultimate-guide-aws-step-functions/>

A good roundup about AWS Step Functions. It is very good if you want to dive deep into the topic. As I have a lot with Step Functions already the article is a bit long. But yeah a highlight really is that you can used typed AWS CDK to define your Step Functions. Thanks to the author Mariliis Retter.

## Post Messages To Slack Using AWS Lambda Function URLs

<https://dev.to/josuebustos/post-messages-to-slack-using-aws-lambda-function-urls-5f2a>

A nice in depth article about how to post messages to slack with using AWS Function URLs. Would be even cooler to create an AWS CDK construct to simplify that. Thanks to the author [Josue Bustos](https://dev.to/josuebustos)

...

## Terraform vs Pulumi vs Cloud SDKs - Keep It Simple, Silly

<https://www.youtube.com/watch?v=Z3hyqmCddXc>

This topic is super hot. Thanks to the creator [Michael Crilly](https://www.youtube.com/channel/UCp5CE3BD-fHc8rFqRJQklqA)

## Website to PDF using AWS Lambda Function URLs

<https://jobinbasani.com/2022/05/03/website-to-pdf-using-aws-lambda-function-urls/>

In this article the author creates via AWS CDK and JS library chrome-aws-lambda a Lambda which can transform a website to PDF. Very cool. Thanks to the author [Jobi Basani](https://jobinbasani.com/)

## Programmieren mit Python: Große Datenmengen verwalten mit vaex

Programming with Python: How to manage a huge amount of data with vaex

<https://www.heise.de/ratgeber/Python-Mit-vaex-grosse-Datenmengen-verwalten-7066766.html>

With Python Panda you can not process your data anymore when they become to big. The library vaex is solving that problem. Thanks to the author [odi](odi@ix.de)

## Pair Programming with a senior is invaluable

<https://dev.to/w3ndo/pair-programming-with-a-senior-is-invaluable-2fdo>

For me that topic is super important. I totally agree pair programming is invaluable. We have an unhealthy ratio between junior and senior engineers. So pair programming really helps to fix that. And in my opinion it is super helpful for the senior as well.

## TypeScript vs JavaScript: What's the difference?

<https://dev.to/educative/typescript-vs-javascript-whats-the-difference-n5m>

Super good summary for what is JavaScript and what TypeScript and why to favor one over the other. In future I will refer just to this article.

Thanks a lot to [Hunter Johnson](https://dev.to/huntereducative)

## Infrastructure-as-Code: Vierte Pulumi-Hauptversion verspricht Universal IaC

Translated: Infrastructure-as-Code: Fourth Pulumi-version promises universal IaC

<https://www.heise.de/news/Infrastructure-as-Code-Vierte-Pulumi-Hauptversion-verspricht-Universal-IaC-7076433.html>

Version 4 from Pulumi seems to make an interesting move with incorporating AWS CDK.

Thanks a lot to the author [map](map@ix.de)

## Cloud Pricing Comparison: AWS vs. Azure vs. Google Cloud Platform in 2022

<https://dev.to/castai/cloud-pricing-comparison-aws-vs-azure-vs-google-cloud-platform-in-2022-no2>

Interesting comparison between the three big cloud providers. In the article they use similar VMs from the different providers to compare those costs. That is a smart idea! As well they compared spot instances from the different providers.

Thanks a lot to the author []()

## Developer shortage? No, just bad interviews

<https://dev.to/jssantana/developer-shortage-no-just-bad-interviews-1cpa>

The author explains why most of the companies are hiring wrong. Just those whitboard kind of tests doesn't evaluate the skills of the developer. I totally agree and those kind of tests always bothered me.

Thanks a lot to the author [Jean Santana](https://dev.to/jssantana)

## AWS open source news and updates #111

<https://dev.to/aws/aws-open-source-news-and-updates-111-1dj3>

Here again where Ricardo presents exciting open source community projects. My favorites onces are:

- The [cloudfront-manager](https://github.com/hseera/cloudfront-manager). Juggling CloudFront distribution in AWS is always not easy regarding Invalidate, Enable, Disable and Delete. This tool looks very promising in helping you with that! https://dev.to/aws-builders/aws-cloudfront-manager-a-windows-utility-for-cloudfront-17o0 . Thanks a lot to the author [Harinder Seera ](https://dev.to/harinderseera)
- [amazon-cloudwatch-retention-period-setter](https://github.com/aws-samples/amazon-cloudwatch-retention-period-setter). This tool help you set the log retention period for CloudWatch logs per default. Otherwise they would stay in CloudWatch forever and accumulating costs. I usually prefer setting AWS CDK with the right properties to avoid that but yeah very often, I am lacy doing that so having something more globally like that would be awesome. https://aws.amazon.com/blogs/infrastructure-and-automation/reduce-log-storage-costs-by-automating-retention-settings-in-amazon-cloudwatch/. Thanks to author Mohamed Wali.

And finally thank you so much Ricardo for picking and presenting all those cherries I missed in this week. And dear reader please support [Ricardo Sueiras](https://dev.to/094459)! Man I would loved to meat you in AWS Summit Berlin but I have to stay behind here in south Portugal Albufeira on the beach at my holidays. Not that bad actually :P.

## Title

LINK

...

Thanks a lot to the author []()

## Title

LINK

...

Thanks a lot to the author []()

## Final Words

Thank you to the authors of those amazing posts. And thank you to the readers of the newsletter. When you like this format or know how to improve it please let me know :). Let's Build!

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
