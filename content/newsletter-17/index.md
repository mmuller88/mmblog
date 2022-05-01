---
title: Weekly Newsletter from martinmueller.dev 2022/05/25-01
show: "yes"
date: "2022-05-01"
image: "diagram.png"
tags: ["eng", "2022", "newsletter"] #nofeed
pruneLength: 50 #ihr
---

In this weekly newsletter, I write a summary of posts that got my attention during the week. I center around topics AWS, DevOps, Architecture, AWS CDK, Data Engineering, Data Analytics and much more.

If you like my content follow me on my usual spots to hang around:

- <https://twitter.com/MartinMueller_>
- <https://www.linkedin.com/in/martinmueller88>
- <https://github.com/mmuller88>
- <https://dev.to/mmuller88>
- <https://martinmueller.dev>

## Using Obsidian

<https://dev.to/paratron/introducing-and-using-obsidian-3o17>

I use and love Obsidian already. It is a great tool to organize content extracted from posts, YouTube and more. And most cool of it is based on Markdown <3. I encourage you to try it!

Update: I figured that VS Code is probably as good as Obsidian for managing your content. Even better you can open multiple tabs in VS Code which you can't in Obsidian.

## What is WebAssembly and why it is a game-changer?

<https://dev.to/aryank21/what-is-webassembly-and-why-it-is-a-game-changer-21p4>

Webassembly or short WASM is super interesting. It advertises developers with execution speed compared to js solutions. For a greenfield project, I definitely want to try it. Super interesting as well is to get potentially closer to the hardware like perhaps IoT devices.

## Zero Cold Start for Lambda

<https://www.reddit.com/r/aws/comments/ud5fos/zero_cold_start_for_lambda/>

Super interesting discussion about zero cold starts for Lambda. That highlights the big conflict like serverless vs zero cold start Lambda. Zero cold starts are possible but not without trade-offs. Sure the customer wants that without trade-offs. That is really hard.

## How to speed up Lambda Functions

<https://www.freecodecamp.org/news/how-to-speed-up-lambda-functions/>

So Lambda hast different phases like init, invoke and shutdown. Initialization code should be put into the init phase which means outside of the lambda handler function.

## EKS Blueprints: IaC Modules for Production-Ready Kubernetes

<https://itnext.io/eks-blueprints-iac-modules-for-production-ready-kubernetes-48032d5ce88#2ee6-c02bad69ddca>

Super summarizing about the new-ish [AWS CDK EKS Blueprints](https://github.com/aws-quickstart/cdk-eks-blueprints). That topic seems very hot and very promising to be a nice abstraction on top of K8S. Unlucky I am more on the serverless-ish side so, I probably miss some cherries atm.

## Deploy Serverless Containerized NodeJs Apps on AWS ECS Fargate with AWS Copilot

<https://www.serverlessguru.com/blog/deploy-serverless-containerized-nodejs-application-on-aws-ecs-fargate>

Good roundup about what is AWS ECS, Fargate and Copilot. It made me curious to learn more about Copilot as it seems to have some cool CI/CD capabilities.

## Websocket with React

<https://dev.to/koladev/websocket-with-react-nodejs-and-docker-building-a-chat-application-3447>

Create a React-based chat using WebSockets. Uses Tailwindcss which is cool.

## 5 Useful TypeScript Features In VS Code

<https://dev.to/danielfy/5-useful-typescript-features-in-vs-code-4am>

Wow that will enhance my developing velocity O.O. Huge thanks to <https://twitter.com/danielfyhr>

## Input on my study path to step into DevOps

<https://www.reddit.com/r/devops/comments/uarh7i/input_on_my_study_path_to_step_into_devops/>

Nice advice for a DevOps Junior.

## AWS CDK v2.21.0 Release Highlights

<https://www.youtube.com/watch?v=GxXKJDYnpDY>

Release notes highlights from AWS CDK 2.21.0 from AWS Twitter presented from the AWS Hero @mattbonig.

## AWS CDK v2.22.0 Release Highlights

<https://www.youtube.com/watch?v=EyLFDt6uRiI>

## AWS Amplify Studio

<https://dev.to/aspittel/aws-amplify-studio-is-generally-available-5-new-features-to-checkout-4h0m>

AWS Amplify Studio is super interesting but I still miss some features like generating React TypeScript and Styled Components.

## Using Amplify UI Builder with your existing data

<https://dev.to/codebeast/using-amplify-studio-with-your-existing-data-5a1n>

Nice description of how to use Amplify Studio.

## Writing RFCs

<https://dev.to/wesen/quick-tip-tuesday-writing-rfcs-for-fun-and-profit-3bo>

Explains how important RFCs are

## Using Apollo Server on AWS Lambda with Amazon EventBridge for real-time, event-driven streaming

<https://aws.amazon.com/blogs/opensource/using-apollo-server-on-aws-lambda-with-amazon-eventbridge-for-real-time-event-driven-streaming/>

Amazing post about Apollo GraphQL and AppSync. Very cool is that it recommends CDK to do the infrastructure.

## Women IT specialists

<https://www.heise.de/news/IT-Spezialistinnen-dringend-gesucht-Unternehmen-hoffen-auf-mehr-Frauen-7066656.html>

Great topic about how to get more women in tech. It seems it would be useful to provide young girls earlier with information about IT jobs.

## Fine Details of AWS Lambda Function URL Feature

<https://engineering.teknasyon.com/fine-details-of-aws-lambda-function-url-feature-f3b65b894c5f>

...

## # How to control access to AWS resources based on AWS account, OU, or organization

<https://aws.amazon.com/blogs/security/how-to-control-access-to-aws-resources-based-on-aws-account-ou-or-organization/>

Explains how the new IAM condition key can be used for more fine granular set policies.

## How to Load Test Your Apps For Free By Going Serverless

<https://dev.to/aws-builders/how-to-load-test-your-apps-for-free-by-going-serverless-1cl2>

A very cool top-down description for how to load test your serverless deployments.

## Is DevOps in my environment possible?

<https://www.reddit.com/r/devops/comments/udj8s8/is_devops_in_my_environment_possible/>

Pretty cool discussion about how to introduce and what is DevOps

## How to configure ESLint, Prettier, Husky, Lint-staged into a React project with TypeScript and Tailwind CSS

<https://dev.to/ixartz/how-to-configure-eslint-prettier-husky-lint-staged-into-a-react-project-with-typescript-and-tailwind-css-4jp8>

Nice how-to for bringing those low-hanging fruits like eslint, prettier, husky and lint staged into your React project. I use lots of that in <https://github/senjuns/senjuns>.

## Exploitation and Prevention of common AWS Vulnerabilities

<https://csaju.com/blog/exploitation-and-prevention-of-common-aws-vulnerabilities/>

Give a nice roundtrip for how to prevent exploitation on the AWS services S3 and Lambda.

## Amazon Rekognition introduces Streaming Video Events to provide real-time alerts on live video streams

<https://aws.amazon.com/blogs/machine-learning/amazon-rekognition-introduces-streaming-video-events-to-provide-real-time-alerts-on-live-video-streams/>

Helping users to AI surveillance their backyard to protect their home. Aims for minimizing the false alerts.

## Final Words

Thank you to the authors of those amazing posts. And thank you to the readers of the newsletter. When you like this format or know how to improve it please let me know :). Let's Build!

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
