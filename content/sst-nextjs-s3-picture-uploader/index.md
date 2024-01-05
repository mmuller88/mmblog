---
title: Create a Next.js Server Component S3 Picture Uploader with SST
show: "tes"
date: "2024-01-03"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=sst&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=sst&state=visitor"
tags: ["eng", "2024", "aws", "sst", "nextjs"] #nofeed
# engUrl: https://martinmueller.dev/sst-nextjs-s3-picture-uploader
pruneLength: 50
---

I recently started exploring [SST](https://github.com/sst/sst) as an alternative to my favorite full-stack set consisting of [Projen](https://github.com/projen/projen), [AWS CDK](https://github.com/aws/aws-cdk), and React. I have been thoroughly impressed with the experience so far. In this article, I will demonstrate how to create a Next.js App Router S3 Picture Uploader using SST.

## SST

[SST](https://github.com/sst/sst) is a powerful framework that simplifies the development of serverless applications. It offers a straightforward and opinionated approach to defining serverless apps using TypeScript. Built on top of AWS CDK, SST handles the complexity of setting up your serverless infrastructure automatically. SST is an open-source framework and is completely free to use.

SST offers a variety of powerful constructs, including the NextjsSite construct. In the following section, I will provide more details about the NextjsSite construct, which greatly simplifies the process of deploying your frontend.

## NextjsSite

The [NextjsSite](https://docs.sst.dev/constructs/NextjsSite) construct allows you to effortlessly create and manage [open-next](https://github.com/sst/open-next), which is a great alternative for hosting Next.js on Vercel. Being defined within an SST App, you can easily integrate other AWS services, making it incredibly powerful. However, if you're using the latest and most advanced features of Next.js, such as Server Components with the Next.js App Router, you may encounter some challenges.

## Server Components

Server Components are a new way to build with Next.js. They allow you to write parts of your application using React components that are served from the server. This approach offers several advantages, such as faster page loading and simplified setup without the need to manage client states with useState, useEffect, and similar hooks. However, working with Server Components may require adjusting your workflow and learning new concepts.

## S3 Picture Uploader

In this section, I will demonstrate how to create an S3 picture uploader using the Next.js App Router and SST. We will utilize the NextjsSite construct to create the Next.js App Router and the S3 construct to create the S3 Bucket.

You can find all the code in my [GitHub Repository](https://github.com/mmuller88/sst-nextjs-s3-picture-uploader).

### Initialize SST NextjsSite

All the steps are taken from the official [SST guide](https://docs.sst.dev/start/nextjs).

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

Before deploying to your AWS Account, ensure that you have set up the correct credentials. I recommend using the AWS Identity Service to obtain temporary AWS CLI credentials, but you can also set up IAM User credentials or profiles. Once you have the credentials in place, run the following command:

```bash
npx sst deploy
```

Ensure that the AWS deployment is successful! View your CloudFront SiteUrl shown in the SST Output. Voila! You now have a running Next.js application on AWS with open-next 🤯. Let's take a closer look at what has been deployed in our AWS account because it's quite extensive!

To inspect the resources created by SST, go to the AWS Console and navigate to CloudFormation. Click on the newly created stack to view the details. You will find a set of helper Lambda Functions, the Lambda Function and Lambda URL for the Server Component, a CloudFront Distribution, and an S3 bucket that serves the static Next.js files.

### Add S3 Picture Uploader

Ok let's go! We need to add an S3 bucket where we can upload the pictures to. Go to the `sst.config.ts` file and add a Bucket:

```ts
import { SSTConfig } from "sst"
import { Bucket, NextjsSite } from "sst/constructs"

export default {
 config(_input) {
  return {
   name: "sst-nextjs-s3-picture-uploader",
   region: "us-east-1",
  }
 },
 stacks(app) {
  app.stack(function Site({ stack }) {
   const bucket = new Bucket(stack, "public")
   const site = new NextjsSite(stack, "site", {
    permissions: [bucket],
    bind: [bucket],
   })

   stack.addOutputs({
    SiteUrl: site.url,
   })
  })
 },
} satisfies SSTConfig
```

The `permissions: [bucket]` property gives the NextjsSite read and write access for the S3 bucket. With `bind: [bucket]` You can use SST node variables in your React code like `Bucket.public.bucketName`. Let's update the page.tsx for adding the upload button and S3 AWS SDK upload code. You might need to run `npm run dev` so that the SST node variable `Bucket.public.bucketName` gets recognized.

```tsx
import { Bucket } from "sst/node/bucket"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export default async function Home() {
 async function upload(data: FormData) {
  "use server"

  const file: File | null = data.get("file") as unknown as File
  if (!file) {
   throw new Error("No file uploaded")
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const client = new S3Client({ region: "us-east-1" })

  const command = new PutObjectCommand({
   Bucket: Bucket.public.bucketName,
   Key: file.name,
   Body: buffer,
   ACL: "public-read",
  })

  await client.send(command)

  console.log(`Uploaded ${file.name} to S3`)

  return { success: true }
 }

 return (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
   <form action={upload}>
    <input name="file" type="file" accept="image/png, image/jpeg" />
    <button type="submit">Upload</button>
   </form>
  </main>
 )
}
```

Do you see how seaminess we can sneak in the AWS SDK s3 upload code? For me, that is mind-blowing if you like to compare it with a client-side variant where you couldn't do that so easily without exposing your AWS API credentials. But as server components are server side we are saved. It offloads a lot of complexity. Super cool!

Let's deploy that! For more convenience let's add a new command in the package json `"deploy": "sst deploy",`. Now run:

```bash
npm run deploy
```

Open the CloudFront SiteUrl. Now click on the upload button and check if you can see the file in S3.

BTW. for faster development you could also run locally with `npm run dev` but make sure to load your AWS CLI credentials before which allowing access to the S3 Bucket.

## Conclusion

I'm still super flashed at how nicely SST is orchestrating the frontend with the backend. In this post, I described how you can start with SST and how to create an S3 picture uploader. I hope you learned something new. If you liked my post or want to correct me please reach out to me :).

I am passionate about contributing to Open Source projects. You can find many of my projects on [GitHub](https://github.com/mmuller88) that you can already benefit from.

If you found this post valuable and would like to show your support, consider supporting me back. Your support will enable me to write more posts like this and work on projects that provide value to you. You can support me by:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Pateron](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

<a href="https://martinmueller.dev"><img src="https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg" alt="drawing" width="400"/></a>
