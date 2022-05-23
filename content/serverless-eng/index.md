---
title: What is Serverless?
show: "yes"
date: "2022-05-24"
# image: "title.png"
tags: ["eng", "2022", "aws", "serverless"] #nofeed
gerUrl: https://martinmueller.dev/serverless
pruneLength: 50 #ihr
---

To clear up a possible misunderstanding right away! Serverless does not mean that there are no more servers! On the contrary! Cloud providers such as AWS, which offer serverless, have many servers worldwide. In the image below you can see the currently available AWS regions. This means in all these places in the world AWS has at least two data centers.

![regions](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/serverless/regions.jpeg)

Such a data center itself is a huge building with a lot of server technology.

![servercenter](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/serverless/servercenter.png)

Now and in the following, I would like to explain for each section using S3 and Lambda as an example.

S3 is an AWS service that can be used as object storage.

Lambda is also an AWS service that can be used for compute. This is usually used to implement the business logic of the cloud application.

## Why Serverless?

\*\*Less complexity. As a cloud developer, I no longer have to worry about managing (hardware and software) the servers. So I can focus more directly on the business logic of my application in the cloud.
With S3, as a developer, I can easily store data using the S3 API. With Lambda, I can define the business logic directly as code, e.g. TypeScript or Python, and pass it to the Lambda API. The AWS Lambda service then takes care of the rest. I don't need to worry about any OS related stuff like with Ec2 for example.

**Better scalability**. Serverless offerings scale automatically by default. So any number of objects can be stored in S3 without the developer having to adjust the volume as with [AWS EBS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AmazonEBS.html), for example. Lambda can also scale almost arbitrarily. If the demand to execute the business logic increases, even multiple Lambda instances are started to ensure timely processing. If no execution of the respective business logic is needed, no Lambda instances are started.

**Cost optimization**. Already by the previous point over the better scalability it can be assumed that thereby cost savings can result to possible alternatives. But this is not always the case and it is difficult to compare costs of serverless with alternatives. Therefore, I will not discuss cost optimization in this article. I will only say that I personally like to use the serverless offerings from AWS, as this leads to very low costs, especially in the initial phase.

## But how does serverless work?

If you're convinced by the reasons why Serverless works, you might be wondering how it works?

Like all AWS service offerings, communication with Serverless services like S3 and Lambda works via HTTP/S API. This means that HTTP requests can be made for creation and modification. The S3 API can be found in the documentation [here](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html) and for the Lambda API [here](https://docs.aws.amazon.com/lambda/latest/dg/API_Reference.html).

Now surely the developer doesn't have to bother with HTTP requests and can alternatively use quasi API wrappers like the AWS CLI or AWS SDK in different programming languages like TypeScript or Python. An even better and by me preferred alternative is AWS CDK which m

## What do I like about Serverless?

The great thing about Serverless for me is that it's a great abstraction and makes developing in the cloud super easy. So I am specifically able to implement my customers' wishes and requirements for their cloud project.

## Summary

In this article, I explained to you what Serverless is and why I think it's so great. However, I firmly believe that serverless is not the end of cloud abstractions. I recently joined a company called [Monada](https://www.linkedin.com/company/monadahq/about/) that is aiming to do just that. We want to create an even better abstraction than Serverless to make working with the cloud even more awesome. If you have any feedback on this article please let me know :)! Let's build!

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Or

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
