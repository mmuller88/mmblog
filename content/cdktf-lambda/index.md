---
title: TypeScript Lambda mit CDKTF
show: "no"
date: "2022-12-11"
image: "lambda.png"
tags: ["de", "2022", "aws", "cdktf" "nofeed"] #nofeed
engUrl: https://martinmueller.dev/cdktf-lambda-eng
pruneLength: 50 #du
---

Hi,

In diesem Blog Post möchte ich kurz erklären was cdktf ist und wie damit eine TypeScript Lambda erstellt werden kann. Die Motivation dafür kam durch einen [StackOverflow Beitrag](https://stackoverflow.com/questions/74740782/how-to-deploy-lambda-using-terraform-created-by-cdktf).

## Was ist cdktf

Das Cloud Development Kit for Terraform (cdktf) ist ein Toolkit zum Erstellen un managen von Cloud Infrastruktur wie AWS oder Azure mit Terraform. Es erlaubt dir die Infrastruktur mittels einer Programmiersprache wie TypeScript oder Python zu definieren.

## Setup cdktf

Den gesamten Code findest du in meinem Repository [hier](https://github.com/mmuller88/cdktf-lambda). Ich beschreibe aber noch nachfolgend kurz wie das Repository erstellt wurde. Initialisiere dein cdktf repo mit:

```bash
cdktf init --template="typescript"
cdktf provider add "aws@~>4.0"
```

* Prettier und Linter hinzufügen
* Adding Lambda module from community

```bash
cdktf get
```

Falls die Lambda eigene Dependencies hat müssen diese noch installiert werden mit:

```bash
cd src/lambda
npm install
```

Deploye den cdktf stack mit:

```bash
cdktf deploy
```

## Code

Die Lambda kann dann zum Beispiel in die main.ts so integriert werden:

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
          resources: ['*'],
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

Ich benutze also das custom construct __NodejsFunction__ to bundle the code from TypeScript yo JavaScript and point the Lambda where to find the bundled JavaScript code.

## Fazit

TypeScript Lambdas mit cdktf zu bauen bedarf etwas mehr Aufwand verglichen zu aws cdk TypeScript Lambdas. Trotzdem hält sich dieser Aufwand in Grenzen und ich habe dir hier gezeigt wir du es machen kannst. Falls du den Beitrag hilfreich fandest, lass es mich doch bitte wissen :)!

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
