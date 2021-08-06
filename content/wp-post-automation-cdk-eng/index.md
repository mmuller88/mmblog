---
title: Wordpress Posts automated with AWS CDK
show: 'no'
date: '2021-08-08'
image: 'wp-aws.jpg'
tags: ['eng', '2021', 'github', 'docker', 'wordpress', 'cdk'] #nofeed
gerUrl: https://martinmueller.dev/wp-post-automation-cdk
pruneLength: 50
---

Hi Folks!

My [last post](https://martinmueller.dev/wordpress-with-docker-eng) was about how to make a wordpress deployment more DevOps friendly using Docker and some cool scripts. Today I want to talk about another exciting task. Namely, the customer wants new wordpress posts to be created automatically using AWS and uploading videos to S3. This sounds like an exciting task. In the next few paragraphs, I'll describe my solution.

# Wordpress AWS solution

As described above, I want a wordpress post to be created after the video upload to S3. For this I mainly need the two AWS services S3 and Lambda. The Lambda then needs to be set to run Lambda logic when uploading to S3.

The Lambda should then log into the wordpress environment via SSH and create a new post via [WP CLI](https://developer.wordpress.org/cli/commands/post/create/). I think it's pretty cool that wordpress has its own CLI. I can then use this to easily create new posts, for example.

The configuration of the AWS services I do with AWS CDK. You can find the complete code in my Github repo [here](https://github.com/hacking-akademie/video-up)

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) is an open source framework for creating and managing AWS resources. By using languages familiar to the developer such as TypeScript or Python, the Infrastructure as Code is described. In doing so, CDK synthesizes the code into AWS Cloudformation Templates and can optionally deploy them right away.

AWS CDK has been experiencing a steady growth of enthusiastic developers since 2019 and already has a strong and helpful community that is eg. very active on [Slack](https://cdk-dev.slack.com). There is of course much more to say about AWS CDK and I recommend you explore it. Drop me a line if you have any questions.

The wordpress S3 Lambda stack now looks like this:

```ts
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';
import * as lambdajs from '@aws-cdk/aws-lambda-nodejs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as statement from 'cdk-iam-floyd';

export interface UploadBucketStackProps extends cdk.StackProps {
  readonly stage: string;
}

export class UploadBucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: UploadBucketStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'my-videos', {
      bucketName: 'my-videos',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const lambda = new lambdajs.NodejsFunction(this, 'upload-trigger', {
      bundling: {
        externalModules: [
          'ssh2',
        ],
        nodeModules: [
          'ssh2',
        ],
      },
    });

    lambda.addToRolePolicy(new statement.Secretsmanager().allow().toGetSecretValue());

    lambda.addEventSource(new S3EventSource(bucket, {
      events: [s3.EventType.OBJECT_CREATED],
    }));
  }
}
```

For the Lambda I decided to use the [NodeJsFunction Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-nodejs.NodejsFunction.html) because it comes with many advantages like esbuild as package manager and I don't have to create a separate package.json for the Lambda because esbuild picks the needed library code from the main package.json.

The ssh2 module for the lambda has to be loaded as an external module though. This simply means that esbuild is not used as package manager for this and the module is loaded completely.

The code for the lambda function is shown and explained in the next section.

# Lambda
The Lambda has as event source the S3 bucket and is executed when objects are created in the S3 bucket. Then the Lambda connects to the wordpress hoster via SSH and creates a wordpress post using [WP CLI](https://developer.wordpress.org/cli/commands/post/create/).

```ts
import * as lambda from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { NodeSSH } from 'node-ssh';

var secretsmanager = new AWS.SecretsManager();

export async function handler(event: lambda.S3CreateEvent) {
  console.debug(`event: ${JSON.stringify(event)}`);

  const record = event.Records[0];

  const sshKey = await (await secretsmanager.getSecretValue({ SecretId: 'sshkey' }).promise()).SecretString;

  const ssh = new NodeSSH();
  await ssh.connect({
    host: 'mywordpresshoster.com',
    username: 'wp',
    privateKey: sshKey,
  });

  const objectKey = event.Records[0].s3.object.key;
  const videoLink = `https://${record.s3.bucket.name}.s3.${record.awsRegion}.amazonaws.com/${objectKey}`;

  // eg. 001_41_Das-ist-die-erste-Lektion.mp4
  // Kategorien: 41 - Grundlagen

  const fileName = objectKey.split('.')[0]; // eg. 001_kategorie1_Das-ist-die-erste-Lektion
  const videoFormat = objectKey.split('.')[1]; // eg. mp4
  videoFormat;
  const splittedFilename = fileName.split('_');
  const lection = Number(splittedFilename[0]); // eg. 1
  const category = Number(splittedFilename[1]); // eg. 41
  category;
  const title = splittedFilename[2].replace(/-/g, ' '); // eg. Das ist die erste Lektion


  console.debug(`video info: ${lection} ${category} ${title} ${videoFormat}`);

  const wpContent = `[vc_row][vc_column][vc_column_text]

Lektion ${lection}: ${title}

[/vc_column_text][us_separator][vc_column_text]

Here will be some content ...

<video poster="PATH-TO-STILL-IMAGE" controls="controls" controlsList=”nodownload” width="640" height="360">
    <source src="${videoLink}" type="video/mp4">
</video>

`;

  const wpCommand = `wp post create --post_title='${title}' --post_categories='${category}' --post_content='${wpContent}'`; // category?

  await ssh.execCommand(wpCommand/*, { cwd:'/var/www' }*/).then(result => {
    console.log('STDOUT: ' + result.stdout);
    console.log('STDERR: ' + result.stderr);
  });
};
```

As you can see I use the NodeSSH class from the node-ssh package to connect to the wordpress hoster. Then I pare some information from the S3 object key like the title or the lesson. At the end I just create the wordpress posts with the wp cli.

# Summary
Automating the creation of wordpress posts using AWS services is just mega cool. I built a small AWS CDK stack for this purpose. I'm already very excited about what else can possibly be automated in wordpress :). Do you have any ideas? Then write me!

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>