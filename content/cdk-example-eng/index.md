---
title: AWS CDK Tutorial with Travis Deployment
description: AWS CDK example with Travis Deployment
date: '2020-03-29'
image: 'cloud.jpg'
tags: ['eng', '2020', 'aws', 'lambda', 'cdk', 'cfd', 'github', 'travis', 'postman']
gerUrl: http://martinmueller.dev/cdk-example
pruneLength: 50
---

Ahoy AWS folks

For a private project I have been working on an AWS CDK example in the past few days. AWS offers a range of great [AWS CDK examples](https://github.com/aws-samples/aws-cdk-examples). The experience I had was so good that I decided to write a blog post about it. I was fortunate to work with CloudFormation very early in my AWS career. It was a lot of fun and amazing to experience infrastructure as code at first hand. Now there seems to be a new kid on the block called AWS CDK (Cloud Development Kit), which can preferably being used as a language to describe the infrastructure in AWS. CDK promises to be a welcome alternative to CloudFormation, instead of writing rather complex YAML, the CDK supports programming languages ​​such as Java, Python, JS or Typescript to define the infrastructure. I think that's a great idea because if you are using like already Typescript to write your Lambdas, you can use it as well for CDK.
My example code [CDK Example Repo](https://github.com/mmuller88/cdk-example) is on GitHub. So feel free to use it. In the next sections I will briefly describe the steps I took to create that Repo.

# The Requirements
If you want to try AWS CDK, you need an AWS account. You also need AWS CLI credentials that allows your deployment to use resources in your AWS account. Usually you create an [IAM User](https://docs.aws.amazon.com/de_de/IAM/latest/UserGuide/id_users_create.html#id_users_create_cliwpsapi). It is important that you save the access data, i.e. the access key ID and the secret access key. These will later be required in the deployment.
The AWS example uses NPM as the package manager. That means it takes care of the dependencies such as the aws-cdk which is installed with the following command:

```
npm install -g aws-cdk
```

NPM is available [here](https://nodejs.org/en/download/).

# Prepare the Git Repo
So now lets start. First we create our GitHub repository which is still completely empty. For me I called it **cdk-example**. Then the [AWS CDK Examples](https://github.com/aws-samples/aws-cdk-examples) repo should be forked and checked out locally. With the intention that we can do cherry picking more easily this way and simply copy over example code to our repository.

If you look at the AWS CDK Examples Repository you might are a bit overwhelmed of the choices. I myself can recommend the examples from the Typescript category because they are many and Typescript seems to be becoming increasingly popular. I also recommend starting with the [Api Cors Lambda Crud DynamoDB](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb) Example because it already contains a lot of AWS services like API Gateway, Lambda and DynamoDB. That example is a simple CRUD storage which is backed up with DynamoDB. +

It's best not to change the existing source code and first try to get it working. I myself had a little difficulty. The example has a missing dependency. The NPM uuid library, which is used to generate IDs, is missing. To do this, change to the src/ directory and execute the following commands:

```
npm init
npm install uuid
```

The code also needs to be adjusted a bit, as the uuid has changed somewhat with the versions. Alternatively, you can simply copy from my [published GitHub Repo](https://github.com/mmuller88/cdk-example). In the next section we will get the example up and running.

# Manually Deploying CDK
In the previous section we have prepared the repo so far, now of course we want to deploy it! Since we have our deployment in AWS, it must be ensured that the access credentials are set correctly. In the **This is required** we have already received the credentials. There are different ways to make these credentials available to your build. The automated deployment in Travis, explained in the next section, works with environment variables. For manual deployment it is more convenient to create the credentials in the aws config folder. simply insert the following files:

~/.aws/conf and ~/.aws/credentials too! For Windows users simply use your user folder instead of the ~. Write done the following content:

```
[default]
aws_access_key_id = AKI ...
aws_secret_access_key = for you ...
region = eu-west-2
```

You should choose a region that is close to you and offers a lot of functionality. I am from Germany and the Frankfurt Region is more close, that region is often behind with new features, I chose the London region eu-west-2.

Now switch to the repo and execute the following commands:

```
npm install -g aws-cdk
npm install
npm run build
```

The npm install commands are loading the dependencies and just needed to be executed rarely. The run build command, however, whenever changes have been made. An interesting fact is that it converts the TypeScript files into JavaScript files. Since TypeScript is a superset of JavaScript, you do not have to reinvent TypeScript tooling and simply use the existing JavaScript tooling out there. Anyway take care and not get confused about those generated JS files. You might apply changes there and wondering why it is not reflected in the build, as I did.

Next, CDK must be configured so that it knows which account and which region to use. I don't understand why CDK cannot generate this from the AWS folder. Then CDK can be deployed:

```
cdk bootstrab aws//{account}/{region}
cdk deploy
```

Also interesting with:

```
cdk synth > cfn.yaml
```

Can you look at the generated CloudFormation template.

# Automation with Travis
The manual effort for deployment certainly is still low, but this will change as complexity increases. So I had great experiences to automate as much of it as possible. And now imagine how cool it is to change the production environment with just a push to master. I describe a little foretaste of what this could look like exactly here. Also, I would like to say again that you could look at my Travis definition here [CDK Example Repo](https://github.com/mmuller88/cdk-example/blob/master/.travis.yml).

What I do there in Travis is explained quite simply. I just do the manual deploy steps from the previous section in Travis. Since Travis has my AWS credentials in the form of encrypted environmental variables, I allow it to be manipulated in my AWS account resources. The following environmental variables were required: AWS\_ACCESS\_KEY\_ID, AWS\_ACCOUNT\_NUMBER, AWS\_DEFAULT\_REGION, AWS\_SECRET\_ACCESS\_KEY, CDK\_DEFAULT\_ACCOUNT, CDK\_DEFAULT\_REGION.

Just not having to do the manual deployment anymore may not seem very useful at first glance, but believe me, it's worth it! After the CDK deployment is finished, Postman tests are then carried out in the form of requests and response validations. I will describe more about this in the next section.

# Stack Testing with Postman
I think everyone knows about [Postman](https://www.postman.com/automated-testing) now the days. It is a glorious tool for testing APIs that work with requests and responses. In my case it is a REST API using AWS API Gateway. In my GitHub repository I have put together a small collection of requests and response tests, which Postman calls collections. These can then simply be used with the CLI [Newman](https://github.com/postmanlabs/newman) to execute the collections created with Postman. Of course, Newman must then be installed on the build machine beforehand. In my repo I do this via NPM in package.json. Simply run the following command:

```
npm install newman
```

The creative process of writing collections is firstly you cerate a new collection in Postman and than you write request. The request runs against the REST API and returns a response. The response can then be validated. Postman offers a wide range of options for validating responses. So you can easily compare the status code in the response with an expected value, compare other expected values, create variables for next requests and much more. A tip from me, try to keep the amount of tests low.

# Summary
AWS quite new CDK is a great tool for creating AWS infrastructure. It is amazing that you can write in the same language that you would use for your Lambdas. Combined with automatic deployment and testing like with Travis, changes to a possible productions stack are easy and make fun. I also believe that this means that there is no need or less need to test Lambdas locally. If you need help with your AWS CDK project, don't hesitate to ask me or the helpful [CDK Gitter community](https://gitter.im/awslabs/aws-cdk).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

  