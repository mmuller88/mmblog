---
title: The Alfresco Provisioner
show: 'no'
description: About the Closed Beta of my CDK Backend
date: '2020-05-05'
image: 'prov.png'
tags: ['eng', '2020', 'acs', 'alfresco', 'docker', 'docker-compose', 'ec2', 'swagger', 'cdk']
gerUrl: https://martinmueller.dev/alf-provisioner
pruneLength: 50
---

Hi Alfrescans.

Have you ever installed Alfresco on an AWS Ec2 instance? Maybe even with Docker Compose? Even though Docker has made installing Alfresco easier, it is still a lot of work! First af all you have to create an Ec2 instance. To do this, you have to log into AWS, select an Ec2 type and start it. Then connect it there, install Docker and then you have to do an Alfresco Docker Compose installation. How great would it be if we had a Managed Service that did all this for us for us?

Good news! That's exactly what I've been working on in the past few weeks. As a result of my work, all you will have to do in the future is to enter the desired Ec2 type and choose the Alfresco Docker Compose Deployment and the Alfresco Provisioner does the rest and installs Alfresco for you! This allows everyone to quickly and easily create Alfresco backends for themselves and their community. In the next sections, I will explain in more details how it works and which technologies I used.

# For Whom?
I see a clear need for the Alfresco Provisioner amongst smaller groups who could profit from the use of Alfresco products I already have a good real life example from my local area. I am a member of a little church community. Now the church community would like to modernize, also towards digitalisation. For example, videos of church services are uploaded to YouTube or pictures taken end up somewhere in Dropbox. Community projects are mainly planned only on pen and paper, because of the right digital tools are simply missing. I see Alfresco products being able to help a group like my church community to manage content more efficiently. You are also likely to know groups such as clubs in your area that could benefit from Alfresco.

The rapid provision of the Alfresco backend for such communities could also help with the mandatory digitalisation during the corona crisis. It should be avoided as much as possible to exchange real documents from person to person or to work on them face to face together. I would like to do my part to help with the pandemic and maybe the Alfresco Provisioner is a possibility.

It will be challenging to keep the costs as low as possible and to pass on the cost advantages of the cloud to the user in the best possible way. A few ideas that I already have in this regard are the use of Reserved Instances, Spot Instances, S3 as object storage, Pay as you go for the Alfresco instances and the possibility to use your own Ec2 instances.

Another possibility would be to create the Docker Compose and use easily expandable backends for demo purposes and thus show potential users what Alfresco products are capable of.

# Technologies
The Alfresco Provisioner uses a variety of modern technologies. I describe them below in the categories - backend, frontend, and DevOps Pipeline.

## Backend
The Alfresco instances are operated with the help of Docker Compose, which I created with the [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer). These then run on AWS Ec2 instances. The use of Ec2 instances for an Alfresco backend has become very common. However, I make this creation of the instances as dynamic and simple as possible. I have created an AWS Api GateWay which is autonomously able to start, stop and terminate Ec2 instances using API requests from the user.

After the instance is started, the user receives a url that brings him to the Alfresco backend. A number of lambdas, step functions, dynamo DB tables and S3 buckets also work behind the Api Gateway to make them possible. All of this is written with infrastructure as code in the AWS CDK. I use TypeScript as the programming language for the CDK and the Lambdas. I began to love TypeScript during this project and it enables me to develop the Alfresco Provisioner very quickly. A Swagger file is also created using CDK, which is used as the UI and client library for the front end. I have more detailed information on how to seamlessly integrate Swagger / OpenApi in CDK [described in this article](https://martinmueller.dev/cdk-swagger-eng).

## Frontend
The frontend is still very modest compared to the backend. This is partly due to the fact that I still have a lot to learn in the frontend area, but also because the backend is developing quickly and I don't want to readjust UI components every time. My choice of technologies are React and TypeScript. React impresses with a rich selection of beautiful components and TypeScript is an ingenious language. To briefly describe TypeScript it only takes the best out of Java and JavaScript. What I like most on TypeScript is the usage of Types. This serves as documentation and I create order in the rather typeless jungle of JavaScript. TypeScript's zero handling or undefined handling is also great.

In addition, I decided to use the OpenAPI UI Explorer as my UI. This simply has the great advantage that the UI components are only rendered based on the Swagger file and I don't have to do it myself. Quasi automatically generated components. You can find out more from my previous posts and on the Swagger UI page in [GitHub](https://github.com/swagger-api/swagger-ui) and on [Swagger.io](https://swagger.io/tools/swagger-ui/)

## DevOps Pipeline
By DevOps Pipeline I mean the process from implementing new features to bringing those into production. There is a huge variety for archiving that!. In general, however, it has been set to be automated as much as possible. I have achieved a very high degree of automation in my pipeline. I just have to push to the master branch, then a test stack is set up and postman tests are carried out against the API GateWay. If the tests were successful, the production stack will be updated automatically. I can easily influence this behavior in the code itself by setting the following variables:

```YAML
env:
  destroyBefore: true
  deploy: true
  updateProduction: true
  destroyAfter: true
```

I also use AWS CDK which allows me to define the test and production stack using TypeScript. More about this can be found in my previous post [CDK Multistack](https://martinmueller.dev/cdk-multistack-eng) or [CDK in general](http://martinmueller.dev/cdk-example-eng). I find Travis and AWS CDK a brilliant combination

# How does it work?
The provisioning of the Alfresco instances takes place via the REST API. The user logs in to the website of the managed service, then receives an OAUTH token and can then use it to create new Alfresco instances, call up and change old ones. By using the OpanAPI UI Explorer, the user can explore the very detailed information on how to use the REST API, i.e. which parameters in the requests and response are to be set or expected.

Below I list how the body in the POST request is for creating a new instance:
```JSON
{
 "userId": "alfresco",
 "alfType": {
  "ec2InstanceType": "t2.large",
  "gitRepo": "alf-ec2-1",
 },
 "customName": "Alf Backend 1"
}
```

The **userId** is just the username in the system and **customName** a nickname for the Alfresco backend created with the provisioner. **AlfType** describes the type of Alfresco backend. This consists of the type Ec2 VM **ec2InstanceType** and an Alfresco Docker Compose Repository **gitRepo**. The GitHub repository is on my account and private. I currently only support one github repo:

**alf-ec-1**: ACS 6.2 Community, ACA

All components were installed with the [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer). Of course, this offer is planned to be expanded widely in the future. It would also be conceivable to use Alfresco Git repositories from other users who are not from my GitHub realm. You just have to meet a certain standard and then there is nothing to be said against it.

A detailed description of all REST endpoints as well as their requests and response parameters can be found on the Alfresco Provisioner UI page.

# Planned Features
Already many features are planned, which enable the user to save money, facilitate the handling of Alfresco products and make the backend more secure. The user should be able to stop and start the instances. If the instance is stopped, the user no longer has to pay for the computer, but only for the storage or possibly no longer. An extension for the automatic creation of backups would also be useful. For this I will look at Tony's interesting work with [Alfresco BART](https://github.com/toniblyx/alfresco-backup-and-recovery-tool). This would also make it easier to upgrade to other alfTypes. At the moment I have made good progress by writing a tool in Go that can create backups. Now the only thing missing is the possibility to import them back into Alfresco.

No HTTPS has yet been set up for the proxy of the instances. I plan to use the certificates provided by Let's Encrypt. For this you simply have to create a Docker Companion, which takes over the certificate management. It should also be possible to have the certificates renewed automatically before expiry. So far only ACS Community is set up, but I plan to offer other Alfresco products such as ACS Enterprise or APS. I'm also thinking about an onboarding layer for ACA.

Another useful feature would be if the user can simply redirect the url instance to his own domain url.

# Closed Alpha
I will soon make the Alfresco Provisioner available to the public. For that I thought to organize a closed alpha first. Interested people can try out the Alfresco Instance Provisioner and provide feedback and more. 

If you are interested, write to me and I will then create your access accounts. All I need is the email address and the desired user name. I don't have a specific launch date for the Closed Alpha yet, but I am confident that I will do it in May.

## More about the Alfresco Products
To give you a quicker 

# From a Personal Perspective
What I like most about this project is the fact that most of the implementation, testing, development and documentation is done or supported using the Swagger definition. This goes from the validation of the request parameters, implementation of the REST interface, documentation, visualization with Swagger UI and automated tests in Postman. I love the approach with the Swagger definition, which I can preview using the Swagger plugin in Visual Studio Code, to use for almost everything. For sure, that's the future of server implementations.

Furthermore, I'm just still overwhelmed with what a single developer is able to do with AWS CDK, especially in the TypeScript flavor. I have already described my enthusiasm for [CDK](http://martinmueller.dev/cdk-example-eng) here and do not want to repeat it here. Please catch up.

# Summary
What started as a simple AWS CDK experiment quickly developed into a great new service that I called the Alfresco Provisioner. This makes it easy to provide Alfresco backends that were developed with Docker Compose. In the closed alpha phase I cordially invite you to use the service.

# Kudos
A big thank you to the [AWS CDK Community in Gitter](https://gitter.im/awslabs/aws-cdk). I have rarely seen a community so in love with technology.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>