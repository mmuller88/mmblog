---
title: Refurbish a Java Spring App in AWS - The Hallo Casa Journey
show: "no"
date: "2023-08-27"
image: "index.jpg"  
tags: ["eng", "2023", "aws", "docker", "java", "cdk", "nofeed"] #nofeed
pruneLength: 50
---

A fresh start can be daunting, especially when it comes to revamping an existing Java Spring application. This was my journey with the Hallo Casa real estate platform, and here's how we took it from deployment nightmares to smooth, cloud-based operations.

## Introducing Hallo Casa

[Hallo Casa](https://hallocasa.com) is a dynamic Real Estate Platform designed to make property dealings seamless.

My motivations to work on Hallo Casa are that I had the chance to contribute to the development of a powerful product. My expertise in AWS could be applied effectively.
Working with a co-founder who was not only business-savvy but also had a knack for generating compelling content in the real estate area. He has his own podcast https://blog.hallocasa.com/podcasts/. Make sure to check it out!

## The Deployment Dilemma

In the beginning, our deployment process could only be described as patchwork:

Setting up Maven, Tomcat, and MySQL locally.
Creating a war file and then SSHing into an EC2 VM to transfer it.
Manually restarting the Tomcat server each time.
Our NextJS frontend wasn't much different. We had to SSH into our EC2 VM and manually run “npm start”.
And to make matters a bit more convoluted, our frontend was in BitBucket while the backend resided in AWS CodeCommit.

## Deploying the New and Improved Way

Here’s how I revamped our deployment:

### Shifting to GitHub

Migrated from AWS CodeCommit and BitBucket to GitHub.
Leveraged GitHub Actions for test builds and introduced a [PR AI reviewer](https://github.com/anc95/ChatGPT-CodeReview) for efficiency.

### Dockerization

Deployed our configuration as code, which is both clean and manageable. With docker-compose, local development became hassle-free. Gone were the days of setting up Maven, Tomcat, and MySQL locally.
Further utilized this to feed AWS ECS, making deployments consistent. Additionally health checks were introduced to ensure that the application is up and running. If the health check fails, the application will restart and in most cases that fixes the problem.

### CDK Pipelines

Implemented a CI/CD staging pipeline that first deploys changes onto QA and subsequently to PROD. Ensured robustness by integrating testing with Postman. We setup a dedicated AWS account for each stage, ensuring clear demarcation and management.

![Pipeline](https://github.com/mmuller88/mmblog/blob/master/content/aws-spring/pipeline.png)

### DB Migration with Flyway

Adopted Flyway to empower our Java App to manage the database, eliminating the need to provide access to the database for schema modifications.

![dbmigration](https://github.com/mmuller88/mmblog/blob/master/content/aws-spring/dbmigration.png)

### Monitoring Metrics

Introduced plenty of metrics to monitor our backend. For an informed decision on crucial metrics, I sought advice from ChatGPT about the most essential metrics for a Java application.
Our revamped production setup went live on 01/08/23, and the migration was seamless.

![Monitoring](https://github.com/mmuller88/mmblog/blob/master/content/aws-spring/monitoring.png)

## Reflecting on the Journey

The refurbishment of Hallo Casa reaffirmed several beliefs:

Docker is a lifesaver. The portability and consistency it brings to applications are unparalleled. CI/CD is a game-changer. It automates manual tasks and ensures faster, reliable deliveries. AWS CDK is powerful. It simplifies cloud resource provisioning and management. CDK Pipelines streamline deployments. With it, managing multiple stages of deployment becomes a breeze. One revelation that stood out was how the lines between infrastructure and application seemed blurred in our setup. And this convergence was a positive one, indicating tight integration and consistency.

The Hallo Casa journey is a testament to the power of continuous learning, adaptation, and innovation. Our users now enjoy a more robust platform, and we can sleep better at night, knowing that our deployment is smoother than ever. If you have a Java application which needs a bit polishing, reach out to me!

I hope you enjoyed this post and I look forward to seeing you in the next one.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on the:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
