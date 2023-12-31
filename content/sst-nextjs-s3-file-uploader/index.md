---
title: Create a NextJs Server Component S3 File Uploader with SST
show: "no"
date: "2024-01-02"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=sst&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=sst&state=visitor"
tags: ["eng", "2024", "aws", "sst", "nextjs", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/sst-nextjs-s3-file-uploader
pruneLength: 50
---

* basically all infra code like for the nextJs construct, S3 or Lambda and React code is living next to each other in the src folder. Which makes it super easy to work with
* the SST initialization is super easy and an amazing experience compared to all my other experiences so far like using Projen to setup AWS CDK and NextJS.
* I'm super pumped to work further with SST to make my clients happy and first of all make myself happy :)

I just started to try [SST](https://github.com/sst/sst) as an alternative for my favorite fullstack set consisting of like [Projen](https://github.com/projen/projen), [AWS CDK](https://github.com/aws/aws-cdk) and React. I'm totally amazed by the experience so far. In this article I will show you how to create a NextJs App Router S3 Picture Uploader with SST.

## SST

[SST](https://github.com/sst/sst) is a framework that makes it easy to build serverless apps. It provides a simple, powerful, and opinionated way to define serverless apps using TypeScript. SST is built on top of AWS CDK and AWS SAM, and it automatically handles the complexity of wiring up your serverless infrastructure. SST is open source and free to use.

SST comes with a bunch of cool constructs like the NextJsSite construct.

## NextJsSite

It is a construct that allows you to seamingless create and manage [open-next](https://github.com/sst/open-next) which is a great alternative when hosting NextJs on Vercel. As it is already defined within a SST App you easily can wire in other AWS Services which makes it totally awesome! Though if you use the newest and wildest features from NextJS you might run into problem. One of those newer features are the Server Components with the NextJs App Router.

## Server Components

Server Components are a new way to build with Next.js. They allow you to write parts of your application using React components that run on the server. That comes with a lot of advantages like faster page loading and an easier setup as you don't need to worry about like client states with the use of useState, useEffect and so on. But it comes with its own challenges as you can't easily keep doing the same workflow as you are used to when being client site. That is still a tough learning for me but I'm getting there.

## S3 Picture Uploader

Here I'm showing you how you can do a S3 Picture Uploader with the NextJs App Router and SST. I'm using the NextJsSite construct to create the NextJs App Router. Then I'm using the S3 construct to create the S3 Bucket.

### Initialize SST NextJsSite

https://docs.sst.dev/start/nextjs

```bash
npx create-next-app@latest
```

Mainly choose the defaults. Then switch to the app folder and open it via VS Code.

```bash
cd <SST_PROJECT>
code .
```

Now run:

```bash
npx create-sst@latest
npm install
```

For deploying it to your AWS Account make sure you have setup the correct credentials! I personally like to use the AWS Identity Service to get temporary AWS CLI credentials but you can as well setup IAM User credentials or profiles. Then run:

```bash
npx sst deploy
```

Make sure the AWS deployment is successful! Access your SiteUrl like https://d2dfhtn2rm9je8.cloudfront.net . Bam you have running NextJs on AWS with open-next 🤯. So come one and lets inspect what just got deployed for us in our AWS account because it is a lot! Go to AWS Console and Cloudformation and click on the new created stack. Inspect the resources. You can see a bunch of helper Lambda Functions. The Lambda Function and Lambda Url for the Server Component. The CloudFront Distribution and a CloudFront Function. Though I'm not sure for what the CloudFront Function is. An S3 bucket to serve the static nextJs files.

### Add S3 File Uploader

...
* https://ethanmick.com/how-to-upload-a-file-in-next-js-13-app-directory/


## Conclusion

...

I am passionate about contributing to Open Source projects. You can find many of my projects on [GitHub](https://github.com/mmuller88) that you can already benefit from.

If you found this post valuable and would like to show your support, consider supporting me back. Your support will enable me to write more posts like this and work on projects that provide value to you. You can support me by:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Pateron](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
