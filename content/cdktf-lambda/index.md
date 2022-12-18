---
title: TypeScript Lambda mit cdktf
show: "no"
date: "2022-12-17"
image: "index.png"
tags: ["de", "2022", "aws", "cdktf"]
engUrl: https://martinmueller.dev/cdktf-lambda-eng
pruneLength: 50 #du
---

Hi,

In diesem Blog-Post möchte ich kurz erklären, was cdktf ist und wie man damit eine TypeScript-Lambda erstellen kann. Die Motivation dafür kam durch einen [StackOverflow-Beitrag](https://stackoverflow.com/questions/74740782/how-to-deploy-lambda-using-terraform-created-by-cdktf). Zunächst erkläre ich kurz, was cdktf überhaupt ist und wie man es initialisiert. Anschließend zeige ich die Lösung für die TypeScript-Lambda.

## Was ist cdktf?

Das Cloud Development Kit for Terraform (cdktf) ist ein Toolkit zum Erstellen und Verwalten von Cloud-Infrastruktur wie AWS oder Azure mit Terraform. Es ermöglicht es dir, die Infrastruktur mithilfe einer Programmiersprache wie TypeScript oder Python zu definieren.

## Setup cdktf

Den gesamten Code findest du in meinem Repository [hier](https://github.com/mmuller88/cdktf-lambda). Ich beschreibe aber noch kurz, wie das Repository erstellt wurde. Initialisiere dein cdktf-Repo mit:

```bash
cdktf init --template="typescript"
cdktf provider add "aws@~>4.0"
```

Optional kannst du noch Prettier und Linter hinzufügen. In den meisten meiner Projekte verwende ich diese, da sie mir ein schnelles Entwickeln ermöglichen, ohne dass ich mir Gedanken um die Formatierung machen muss.

Ich verwende das [Community Terraform Lambda Modul](https://github.com/terraform-aws-modules/terraform-aws-lambda), um die Lambda zu definieren. Es erlaubt mir, in nur wenigen Zeilen eine Lambda zu definieren, die mit einer Rolle konfiguriert wird und auch einfach um Policies erweitert werden kann. Das Coole ist, dass cdktf eine Type-Importierung unterstützt. Dafür muss einfach in der cdktf.json-Datei folgendes Modul hinzugefügt werden:

```json
"terraformModules": [
    {
      "name": "lambda",
      "source": "terraform-aws-modules/lambda/aws",
      "version": "~> 3.0"
    }
  ],
```

Anschließend wird der Befehl cdktf get ausgeführt:

```bash
cdktf get
```

Nun kann das Modul im cdktf-Code verwendet werden:

```ts
import { Lambda } from './../.gen/modules/lambda';
...
```

Falls die Lambda eigene Dependencies hat, müssen diese noch installiert werden mit:

```bash
cd src/lambda
npm install
```

Deploye den cdktf-Stack mit:

```bash
cdktf deploy
```

## Code

Die Lambda kann dann zum Beispiel in die main.ts integriert werden:

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

Ich benutze also das Custom Construct NodejsFunction, um den Code von TypeScript in JavaScript zu bundlen und der Lambda zu zeigen, wo sie den gebundelten JavaScript-Code finden kann. Das NodejsFunction Construct sieht so aus:

```ts
import { AssetType, TerraformAsset } from 'cdktf';
import { Construct } from 'constructs';
import { buildSync } from 'esbuild';
import * as path from 'path';

export interface NodejsFunctionProps {
  readonly path: string;
}

const bundle = (workingDirectory: string, entryPoint: string) => {
  buildSync({
    entryPoints: [entryPoint],
    platform: 'node',
    target: 'es2018',
    bundle: true,
    format: 'cjs',
    sourcemap: 'external',
    outdir: 'dist',
    absWorkingDir: workingDirectory,
  });

  return path.join(workingDirectory, 'dist');
};

export class NodejsFunction extends Construct {
  public readonly asset: TerraformAsset;
  public readonly bundledPath: string;

  constructor(scope: Construct, id: string, props: NodejsFunctionProps) {
    super(scope, id);

    const workingDirectory = path.resolve(path.dirname(props.path));
    const distPath = bundle(workingDirectory, path.basename(props.path));

    this.bundledPath = path.join(
      distPath,
      `${path.basename(props.path, '.ts')}.js`,
    );

    this.asset = new TerraformAsset(this, 'lambda-asset', {
      path: distPath,
      type: AssetType.ARCHIVE,
    });
  }
}
```

Wie zu sehen ist, bundelt esbuild den TypeScript Code zu JavaScript Code jedesmal wenn `cdktf deploy` ausgeführt wird.

## Fazit

TypeScript-Lambdas mit cdktf zu bauen bedarf etwas mehr Aufwand im Vergleich zu aws cdk TypeScript-Lambdas. Trotzdem hält sich dieser Aufwand in Grenzen und ich habe dir hier gezeigt, wie du es machen kannst. Falls du den Beitrag hilfreich fandest, lass es mich bitte wissen!

Ich liebe es, an Open-Source-Projekten zu arbeiten. Viele Dinge kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88). Wenn du meine Arbeit dort und meine Blog-Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

Und schau doch mal auf meiner Seite vorbei

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)