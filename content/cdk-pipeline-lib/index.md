---
title: AWS CDK - PipelineApp - Eine Library für Staging Pipelines
show: 'no'
date: '2020-10-18'
image: 'api-gw.png'
tags: ['de', '2020', 'aws', 'cdk', 'nofeed']
engUrl: https://martinmueller.dev/cdk-pipeline-lib-eng
pruneLength: 50
---

Hi CDK Fans,

Das Bauen von AWS CDK Pipelines macht Spaß. Seit Mitte diesen Jahres (2020) gibt es sogar eine Level 2 CDK Pipeline welche viele Vorteile bringt wie self-mutate, ein vereinfachtes Cross-Account Deployment und eine bessere Abstraktion von den benötigten CodeBuild Projekten. Hier ist ein empfehlenswerter Blogpost über die neue [CdkPipeline](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/).

Privat und beruflich habe ich schon viele CDK Pipelines erstellt und viel gelernt. Was mich dabei nervt, ist dass sich viel Code wiederholt, jedesmal wenn ich eine neue Pipeline schreibe. Von daher böte es sich doch an eine allgemeine Library für die ganzen Pipelines zu schreiben.

In den nächsten Abschnitten geht es um diese allgemeine Library. Zuerst beschreibe ich wozu man überhaupt eine Pipeline braucht. Dann erkläre ich genauer die Idee hinter der Library und zum Schluss zeige ich einige Beispiele meiner Projekte welche bereits die Library verwenden.

# Wozu überhaupt eine Pipeline
In Zeiten von modernen DevOps Praktiken ist es wichtig Änderungen in der Produktion so schnell und einfach wie möglich durchzuführen. Idealerweise geschieht das basierend on Git Code Commits und einer Staging Pipeline. Eine Staging Pipeline führt Anpassungen auf Stages aus.

In meiner Firma haben wir die drei Stages DEV, QA und PROD. Die DEV Stage ist als Entwicklungsumgebung für die Entwickler gedacht. Die QA Stage ist eine Testumgebung die möglichst ähnlich der PROD Umgebung ist. Und PROD selber ist natürlich die Produktionsumgebung welche aktiv von der Firma und unseren Kunden verwendet wird.

# Anforderungen
Meine CDK Pipeline Library soll einige Anforderungen erfüllen die nach Außen über ein Interface implementiert sind. Hier ist das Interface implementiert mit den **PipelineAppProps** für die **PipelineApp** Klasse in der Library:

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: name,
  accounts: [
    {
      id: '123...',
      region: 'eu-central-1',
      stage: 'dev',
    },
    {
      id: '987...',
      region: 'eu-central-1',
      stage: 'prod',
    },
  ],
  buildAccount: {
    id: '555...',
    region: 'eu-central-1',
    stage: 'build',
  },
  customStack: (scope, account) => {

    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        hostedZoneId: 'Z0847928PFMOCU700U4U',
        domainName: 'i.dev.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:123...:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c',
      }
       : // prod
      {
        hostedZoneId: 'Z00371764UBVAUANTU0U',
        domainName: 'i.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:987...:certificate/4fe684df-36da-4516-bd01-7fcc22337dff',
      })
    }

    return new AlfCdkEc2Stack(scope, `${name}-${account.stage}`, {
      env: {
        account: account.id,
        region: account.region,
      },
      gitRepo: 'alf-ec2-1',
      tags,
      customDomain: {
        hostedZoneId: alfCdkSpecifics.hostedZoneId,
        domainName: alfCdkSpecifics.domainName,
        certArn: alfCdkSpecifics.certArn,
      },
      stackName: 'itest12',
      stage: account.stage,
    })
  },
  testCommands: (_) => [
    'sleep 240',
    `curl -Ssf $InstancePublicDnsName && aws cloudformation delete-stack --stack-name itest123 --region ${account.region}`,
  ],
};

// tslint:disable-next-line: no-unused-expression
new PipelineApp(pipelineAppProps);
```

Die gesamte Library wird als Dependendy im package.json geladen:
```JSON
 "dependencies": {
    "alf-cdk-app-pipeline": "github:mmuller88/alf-cdk-app-pipeline#v0.0.7",
    ...
 }
```
In den nächsten Unterabschnitten erläutere ich genauer die einzelnen Properties.

## Verwalten von Stages
Es soll möglich sein zu spezifischen AWS Accounts in der jeweiligen Stage zu connecten. Die Spezifikation über den Account und der Stage soll als Parameter mitgegeben werden. Ich entwickelte das folgende Interface:

```TypeScript
accounts: [
    {
      id: '123..',
      region: 'eu-central-1',
      stage: 'dev',
    },
    {
      id: '987...',
      region: 'eu-central-1',
      stage: 'prod',
    },
  ],
```

Hier wird eine Liste von Stage Accounts übergeben in die die Pipeline die Stacks deployn wird. Zusätzlich wird mit dem **stage** property der Name der Stage festgelegt. Die Reihenfolge der Accounts bestimmt auch die Reihenfolge in der das Staging durchgeführt wird. In diesem Beispiel wird also zuerst die DEV Stage durchlaufen und dann Die PROD Stage.

## Buildaccount
Der Buildaccount definiert den Account indem die CDK Pipeline deployed werden soll.

```TypeScript
buildAccount: {
  id: '555...',
  region: 'eu-central-1',
  stage: 'build',
},
```

Hier können auch wichtige Secret definiert werden wie z.B. das GitHub Token. Es bietet sich auch an in diesem Account ggf. die CodeCommits Repositories anzulegen und zu verwalten.

## Ein oder mehrere Stacks
Die Pipeline soll in der Lage sein ein oder mehrere Stacks zu deployn und in die Pipeline zu integrieren. Die Stackdefinition soll dabei im jeweiligen Repository liegen und kann dann einfach der Library als Higher Order Function übergeben werden:

```TypeScript
customStack: (scope, account) => {

    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        hostedZoneId: 'Z0847928PFMOCU700U4U',
        domainName: 'i.dev.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:981237193288:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c',
      }
       : // prod
      {
        hostedZoneId: 'Z00371764UBVAUANTU0U',
        domainName: 'i.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:981237193288:certificate/4fe684df-36da-4516-bd01-7fcc22337dff',
      })
    }

    return new AlfCdkEc2Stack(scope, `${name}-${account.stage}`, {
      env: {
        account: account.id,
        region: account.region,
      },
      gitRepo: 'alf-cdk-ec2',
      tags,
      customDomain: {
        hostedZoneId: alfCdkSpecifics.hostedZoneId,
        domainName: alfCdkSpecifics.domainName,
        certArn: alfCdkSpecifics.certArn,
      },
      stackName: 'itest12',
      stage: account.stage,
    })
  },
```

Der hier aufgezeigte Stack befindet sich im Repo https://github.com/mmuller88/alf-cdk-ec2 mit alf-cdk-ec2-stack.ts als File. Der Stack wird in der app.ts zusammen mit der PipelineApp Library aufgerufen. 

Dank der High Order Function können Account Informationen einfach als Parameter mittels **account** in den jeweiligen Stage Stack integriert werden.

# Library Beispiele
...

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>