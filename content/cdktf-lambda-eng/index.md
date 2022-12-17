---
title: TypeScript Lambda with cdktf
show: "yes"
date: "2022-12-17"
image: "index.png"
tags: ["eng", "2022", "aws", "cdktf"]
engUrl: https://martinmueller.dev/cdktf-lambda
pruneLength: 50 #du
---

Hi,

In this blog post, I want to briefly explain what cdktf is and how you can use it to create a TypeScript Lambda. The motivation for this came from a [StackOverflow post](https://stackoverflow.com/questions/74740782/how-to-deploy-lambda-using-terraform-created-by-cdktf).

## What is cdktf?

The Cloud Development Kit for Terraform (cdktf) is a toolkit for building and managing cloud infrastructure like AWS or Azure with Terraform. It allows you to define the infrastructure using a programming language like TypeScript or Python.

## Setup cdktf

You can find all the code in my repository [here](https://github.com/mmuller88/cdktf-lambda). However, I'll briefly describe how the repository was created. Initialize your cdktf repo with:

```bash
cdktf init --template="typescript"
cdktf provider add "aws@~>4.0"
```

Optionally you can add prettier and linter. In most of my projects I use these because they allow me to develop quickly without having to worry about formatting.

I use the [Community Terraform Lambda Module](https://github.com/terraform-aws-modules/terraform-aws-lambda) to define the lambda. It allows me to define a lambda in just a few lines that is configured with a role and can also be easily extended with policies. The cool thing is that cdktf supports a type import. To do this, simply add the following module to the cdktf.json file:

```json
"terraformModules": [
    {
      "name": "lambda",
      "source": "terraform-aws-modules/lambda/aws",
      "version": "~> 3.0"
    }
  ],
```

Then the command cdktf get is executed:

```bash
cdktf get
```

Now the module can be used in the cdktf code:

```ts
import { lambda } from './../.gen/modules/lambda';
...
```

If lambda has its own dependencies, they still need to be installed with:

```bash
cd src/lambda
npm install
```

Deploy the cdktf stack with:

```bash
cdktf deploy
```

## Code

The lambda can then be integrated into main.ts, for example:

```ts
import { NodejsFunction } from './constructs/nodejs-function';

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const code = new NodejsFunction(this, 'code', {
      path: path.join(__dirname, 'lambda/filter-aurora.ts'),
    });

    new Lambda(this, 'FilterAuroraEventsLambda', {
      functionName: 'filter-aurora',
      handler: 'filter-aurora.handler',
      runtime: 'nodejs14.x',
      sourcePath: code.bundledPath,
      timeout: 15 * 60,
      attachPolicyStatements: true,
      policyStatements: {
        kms: {
          effect: 'Allow',
          actions: ['*'],
          resources: ['*']
        },
        s3: {
          effect: 'Allow',
          actions: ['s3:*'],
          resources: ['*'],
        },
      },
    });
  }
}

const app = new App();
new MyStack(app, 'cdktf-lambda');
app.synth();
```

So I use the custom construct NodejsFunction to bundle the code from TypeScript into JavaScript and show the lambda where to find the bundled JavaScript code.

## Conclusion

Building TypeScript lambdas with cdktf requires a bit more effort compared to aws cdk TypeScript lambdas. Still, that effort is kept in check and I've shown you how to do it here. If you found the post helpful, please let me know!

Ich liebe es, an Open-Source-Projekten zu arbeiten. Viele Dinge kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88). Wenn du meine Arbeit dort und meine Blog-Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen:

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
