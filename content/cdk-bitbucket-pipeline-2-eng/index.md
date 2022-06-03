---
title: CDK BitBucket Staging Pipeline Learnings (Part 2)
date: '2022-01-07'
image: 'bitbucket.jpg'
tags: ['eng', '2022', 'bitbucket', 'aws', 'cdk'] #nofeed
gerUrl: https://martinmueller.dev/cdk-bitbucket-pipeline-2
pruneLength: 50
---

Hi CDK folks.

A few months ago I told you about my exciting project to build a [CDK BitBucket Staging Pipeline](https://martinmueller.dev/cdk-bitbucket-pipeline-eng). Since then, a lot has happened and we have continued to develop the pipeline.

## Problems with CDK cross-stack references

CDK cross-stack references are CDK outputs passed as input to another CDK stack. Here is an example:

```ts
/**
 * Stack that defines the bucket
 */
class Producer extends cdk.Stack {
  public readonly myBucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.myBucket = bucket;
  }
}

interface ConsumerProps extends cdk.StackProps {
  userBucket: s3.IBucket;
}

/**
 * Stack that consumes the bucket
 */
class Consumer extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ConsumerProps) {
    super(scope, id, props);

    const user = new iam.User(this, 'MyUser');
    props.userBucket.grantReadWrite(user);
  }
}

const producer = new Producer(app, 'ProducerStack');
new Consumer(app, 'ConsumerStack', { userBucket: producer.myBucket });
```

The example is taken from https://docs.aws.amazon.com/cdk/api/v1/docs/aws-s3-readme.html#sharing-buckets-between-stacks . You can see very well how the **myBucket** variable is created in the producer stack and how the consumer stack accesses it. This is a CDK cross-stack reference. And exactly those became problematic in our project.

If num changes something in the producer stack that would result in deleting and then recreating the **myBucket** variable, Cloudformation would respond with an error and cause a rollback. The reason is that since the consumer uses the cross-stack reference, it cannot be easily deleted. Such and other problems have made development difficult for us.

But we think and hope that we have found a good solution. First, we have reduced the number of stacks from about 7 to 4. The reallocation of services into the 4 stacks is now based on DDD (Domain Driven Design). This means that all services that belong to a domain, such as the React app, are bundled into one stack. Before, the division was rather random and based on the AWS services such as the LambdaStack or the CognitoStack. Now the stacks are assigned according to their domains and are called FrontendSiteStack, FrontendBackendStack and MLStack.

This new division has greatly reduced the number of cross-stack references. So that virtually only a few are left which we have outsourced to the CommonStack. However, the CommonStack serves as the parent stack to the other three. If now only cross-stack references between parent and children stacks exist, this should cause much less problems than references between sibling stacks.

## Independent Stacks

The next challenge was that the developers would like to be able to deploy the three new stacks FrontendSiteStack, FrontendBackendStack and MLStack independently. Until now, all three were always deployed at the same time.

To solve this problem, we decided to use [Custom Variables](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/). Custom Variables are variables that can be set on Custom Pipelines during execution. To be able to deploy the stacks independently of each other, the custom pipeline must be executed with the following variables:

```yaml
custom:
  cdkDeploy:
    - variables:
        - name: deployFrontendSite
          default: false
        - name: deployFrontendBackend
          default: false
        - name: deployML
          default: false
```

If you start the cdkDeploy pipeline with the BitBucket UI you can change the three variables to true if needed. A simple bash command then checks if the variable is true or not:

```yaml
script:
  - if [ "$deployFrontendSite" != true ]; then exit 0; fi 
```

So interactively by executing the custom pipeline and setting the variables the desired stack can be deployed. Very cool!

## Stage

The concept of a stage can make the CDK code much cleaner. A stage groups all CDK stacks that belong to a stage like dev or prod. Here is an example.

```ts
export class Stage {

  /**
     * A stage which is a collection of stacks.
     *
     */
  constructor(scope: core.Construct, props: StageStackProps) {

    const commonStack = new CommonStack(scope, props.stage + '-CommonStack', { stage: props.stage, env: props.env });

    new FrontendBackendStack(scope, props.stage + '-FrontendBackendStack', {
      stage: props.stage,
      domainName: commonStack.domainName,
      zone: commonStack.zone,
      vpc: commonStack.vpc,
      env: props.env,
      userPoolId: props.userPoolId,
    });

    new MLStack(scope, props.stage + '-MLStack', {
      stage: props.stage,
      domainName: commonStack.domainName,
      zone: commonStack.zone,
      vpc: commonStack.vpc,
      env: props.env,
      enableAlarms: props.enableLambdaAlarms,
    });
  }
}
```

The stage is now simply imported into the main.ts:

```ts
new Stage(app, { stage: 'dev', env: devEnv, userPoolId: 'us-west-2_3zgoE123' });
```

By using a stage wrapper class, we have made our code much cleaner and easier to maintain.

## What next?

A staging pipeline is already a good start to effectively and quickly develop new features and bring them into production. However, to develop even faster and more independent from other development teams, ephermal deployments are needed.

Ephermal Deployments means that with each new branch potentially a completely new CDK Deployment can be played out which contains the changes of the branch. So the developers don't have to share the dev environment anymore to test new features. I am curious to see how we will do this.

Our React frontend requires backend information at build time that is stored in a config file typical of AWS Amplify. These have to be laboriously kept up to date by hand. Therefore, it would be cool if we could enable the config file to be built dynamically before the build, similar to the Amplify CLI. Our initial idea is to enable this with AWS Api Gateway. The endpoint would then always send us the current backend data and we can save it as a config file.

## Summary

I still enjoy working with BitBucket Pipeline. It can be used to build great CDK deployment pipelines. In this post I described what new challenges we had and how we solved them. I'm also very happy that the customer is now able to use the CDK pipeline themselves and is doing so more and more.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

 
