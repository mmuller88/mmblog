---
title: AWS CDK - PipelineApp - Eine Library für Staging Pipelines
show: 'no'
date: '2020-10-24'
image: 'staging.png'
tags: ['de', '2020', 'aws', 'cdk', 'nofeed']
engUrl: https://martinmueller.dev/cdk-pipeline-lib-eng
pruneLength: 50
---

Hi CDK Fans,

Das Bauen von AWS CDK Pipelines macht Spaß. Seit Mitte diesen Jahres (2020) gibt es sogar eine High Level CDK Pipeline welche viele Vorteile bringt wie self-mutate, ein vereinfachtes Cross-Account Deployment und eine bessere Abstraktion von den benötigten CodeBuild Projekten.

Ich habe eine [CDK Library](https://github.com/mmuller88/alf-cdk-app-pipeline) entwickelt die einige Probleme Lösen soll. Wenn auch ihr auf nur einer der folgenden Probleme stoßt, müsste ihr euch unbedingt den gesamten Post durchlesen :) :

* Maintaining der CDK Dependencies zwischen mehreren Repositories
* Wiederholung von Code für den Bau von CDK Apps nur um z.B. einen beliebigen Stack zu deployen
* Wiederholung von CDK Pipeline Code
* Vermissen eines einheitlichen CDK Pipeline Standards über z.B. einem Interface

In den nächsten Abschnitten geht es um diese allgemeine Library und wie ich diese Probleme löse. Zuerst beschreibe ich wozu man überhaupt eine Pipeline braucht. Dann erkläre ich genauer die Idee hinter der Library und zum Schluss zeige ich einige Beispiele meiner Projekte welche bereits die Library verwenden. 

Übrigens meine [CDK Library](https://github.com/mmuller88/alf-cdk-app-pipeline) kann direkt genutzt werden via npm depedency und erfordert kein npm Repository. Einfach die Dependency folgendermaßen angeben:

```JSON
 "dependencies": {
    "alf-cdk-app-pipeline": "github:mmuller88/alf-cdk-app-pipeline#v0.0.7",
    ...
 }
```

# Wozu überhaupt eine Pipeline?
In Zeiten von modernen DevOps Praktiken ist es wichtig Änderungen in der Produktion so schnell und einfach wie möglich durchzuführen. Idealerweise geschieht das basierend auf Git Code Commits und einer Staging Pipeline. Eine Staging Pipeline führt Anpassungen auf Stages aus.

In meiner Firma haben wir die vier Stages DEV, QA, PROD. Die DEV Stage ist als Entwicklungsumgebung für die Entwickler gedacht. Die QA Stage ist eine Testumgebung die möglichst ähnlich der PROD Umgebung ist. Und PROD selber ist natürlich die Produktionsumgebung welche aktiv von der Firma und unseren Kunden verwendet wird.

Zum besseren Verständniss benutze ich in den nächsten Abschnitten aber nur eine DEV, PROD Stage. Die PipelineApp Library lässt sich um beliebig viele Stages erweitern.

# Anforderungen
Meine CDK Pipeline Library soll einige Anforderungen erfüllen die nach Außen über ein Interface implementiert sind. Hier ist das Interface implementiert mit den **PipelineAppProps** für die **PipelineApp** Klasse in der Library:

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: 'alf-cdk-ui',
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
  },
  customStack: (scope, account) => {

    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        hostedZoneId: 'Z08...',
        domainName: 'i.dev.alfpro.net',
        certArn: 'arn:aws:acm:eu-central-1:123...:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c',
      }
       : // prod
      {
        hostedZoneId: 'Z003...',
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

In den nächsten Unterabschnitten erläutere ich genauer die einzelnen Properties.

## Git Repository
Die PipelineApp soll ihre Stages basierend auf Git Repositories deployen. Dafür ist es notwendig das Repository und den Branch zu definieren:

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: 'alf-cdk-ui',
  ...
```

Der **repositoryName** bezieht sich auf den Namen in meinem Repository auf Github z.B. https://github.com/mmuller88/alf-cdk-ui . Über die Pipeline wird mittels eines Tokens dieses Repository gepullt und als Source definiert.

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

Hier wird eine Liste von Stage Accounts übergeben in die die Pipeline die Stacks deployen wird. Zusätzlich wird mit dem **stage** property der Name der Stage festgelegt. Die Reihenfolge der Accounts bestimmt auch die Reihenfolge in der das Staging durchgeführt wird. In diesem Beispiel wird also zuerst die DEV Stage durchlaufen und dann Die PROD Stage.

Der Buildaccount definiert den Account indem die CDK Pipeline deployed werden soll.

```TypeScript
buildAccount: {
  id: '555...',
  region: 'eu-central-1',
},
```

In dem Build Account können auch wichtige Secret mit dem Secret Manager oder dem Parameter Store definiert werden wie z.B. das GitHub Token. In dem Pipeline Stack kann dann dort auf diese Secrets zugegriffen werden.

## Ein oder mehrere Stacks
Die Pipeline soll in der Lage sein ein oder mehrere Stacks zu deployen und in diesige zu integrieren. Die Stackdefinition soll dabei im jeweiligen Repository liegen und kann dann einfach der Library als Higher Order Function übergeben werden:

```TypeScript
customStack: (scope, account) => {

    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        hostedZoneId: 'Z08...',
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

Der hier aufgezeigte Stack befindet sich im [alf-cdk-ec2](https://github.com/mmuller88/alf-cdk-ec2) Repo mit alf-cdk-ec2-stack.ts als File. Der Stack wird in der app.ts zusammen mit der PipelineApp Library aufgerufen.

Dank der High Order Function können Account Informationen einfach als Parameter mittels **account** in den jeweiligen Stage Stack integriert werden.

# Library Beispiele
In diesem Abschnitt möchte ich einige Verbraucher der PipelineApp Library zeigen.

## Alf CDK UI React Frontend
Das erste Beispiel handelt von einem Frontend Stack welcher eine statische Website baut. Die Technologien die ich hier verwende sind React im TypeScript Flavor. Die statische Seite wird gehostet in einem S3 Bucket mit einer davor geschalteten Cloudfront Distribution.

Der gesamte Code ist auf GitHub [alf-cdk-ui](https://github.com/mmuller88/alf-cdk-ui). Im Rootverzeichniss befindet sich die React App. Im cdk folder sind alle relevanten CDK parts zu finden. Darunter das UIStack in ui-stack.ts Construct und die PipelineApp in app.ts. Die PipelineApp wird folgendermaßen aufgerufen:

```TypeScript
import { UIStack } from './ui-stack';
import { name } from './package.json';
import { PipelineApp } from 'alf-cdk-app-pipeline/pipeline-app';
import { sharedDevAccountProps, sharedProdAccountProps } from 'alf-cdk-app-pipeline/accountConfig';


// tslint:disable-next-line: no-unused-expression
new PipelineApp({
  branch: 'master',
  repositoryName: name,
  accounts: [
    {
      id: '123...',
      region: 'eu-central-1',
      stage: 'dev',
    },
    {
      id: '123...',
      region: 'us-east-1',
      stage: 'prod',
    },
  ],
  buildAccount: {
    id: '123...',
    region: 'eu-central-1',
  },
  customStack: (scope, account) => {
    const stageProps = {
      ...(account.stage === 'dev' ? {
        domainName: sharedDevAccountProps.domainName,
        acmCertRef: sharedDevAccountProps.acmCertRef,
        subDomain: sharedDevAccountProps.subDomain,
        hostedZoneId: sharedDevAccountProps.hostedZoneId,
        zoneName: sharedDevAccountProps.zoneName,
      } : { // prod stage
        domainName: sharedProdAccountProps.domainName,
        acmCertRef: sharedProdAccountProps.acmCertRef,
        subDomain: sharedProdAccountProps.subDomain,
        hostedZoneId: sharedProdAccountProps.hostedZoneId,
        zoneName: sharedProdAccountProps.zoneName,
      })
    };
    // console.log('echo = ' + JSON.stringify(account));
    return new UIStack(scope, `${name}-${account.stage}`, {
      stackName: `${name}-${account.stage}`,
      stage: account.stage,
      domainName: stageProps.domainName,
      acmCertRef: stageProps.acmCertRef,
      subDomain: stageProps.subDomain,
      hostedZoneId: stageProps.hostedZoneId,
      zoneName: stageProps.zoneName,
    })
  },
  buildCommand: 'make distcdk',
  manualApprovals: (account) => {
    return account.stage === 'dev' ? false : true;
  },
  testCommands: (_) => [
    // Use 'curl' to GET the given URL and fail if it returns an error
    'curl -Ssf $domainName',
    'echo done!!!',
  ],
});

```

Wie man hier sieht verwende ich für die zwei Stages dev und prod den gleichen Account. Es wäre auch möglich unterschiedliche Accounts zu verwenden. Es muss dann nur darauf geachtet werden das beim CDK Bootstrap befehl dem jeweiligen Account getrustet wird! Interessant ist das ich hier den default **buildCommand** überschreibe. Die Motivation dafür ist ein Finetuning bei der Builderstellung der React App um diesen schneller zu bekommen.

Der wohl interessanteste Bereich ist das **customStack** Property bzw. die High Order Function. Hier wird nämlich der Stack definiert welcher von der PipelineApp verwaltet werden soll. Das ist ziemlich cool weil so die Stack Definition im UI Repo bleiben kann ich aber nur trotzdem minimal Code für die PipelineApp Library importieren muss.

Ein wichtiger Punkt für die so definierten Stack wie z.B. der **UIStack**. Diese sind nur erlaubt die aws-cdk Dependencies wie z.B.:

```TypeScript
import { StackProps, Construct, CfnOutput, RemovalPolicy } from '@aws-cdk/core';
```

nur indirekt aus der PipelineApp Library laden. Das ist aber eher ein Vorteil als Nachteil da so nur noch die aws-cdk dependencies in der PipelineApp Library selbst verwaltet werden müssen. Und mit einer vernünftigen Tagging Strategie kann man aws-cdk Updateprobleme vermeiden!

Der Build Command kann optional auch überschrieben werden. Hier tue ich das zum Beispiel mit **make distcdk** . In den Projekten verwende ich Makefiles da diese hervorragend sind zum kapseln von Commands. Mit Makefiles habe ich auch eine schöne Übersicht von den möglichen und gewünschten Commands.

Am Schluss wird über das **testCommands** Property noch ein Erreichbarkeitstest durchgeführt. Der Parameter $domainName wurde im Stack so definiert:

```TypeScript
this.domainName = new CfnOutput(this, 'domainName', {
  value: route.domainName,
});
this.cfnOutputs['domainName'] = this.domainName;
```

Diese Notation muss so eingehalten werden, damit die PipelineApp Library nachdem Stack Deployment die Stack Output Variablen wiederfinden kann.

## Alf CDK Ec2 Backend
Das nächste Beispiel befindet sich in Github auf [alf-cdk-ec2](https://github.com/mmuller88/alf-cdk-ec2). Hier kreiere ein Alfresco Deployment basierend auf Docker Compose, Ec2 und CDK als Infrastrucktur Orchestrierer. Näheres könnte ihr gerne im Blog Post [ACS Infrastruktur erstellen leichtgemacht mit AWS CDK](https://martinmueller.dev/alf-cdk) nachlesen.

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
  ],
  buildAccount: {
    id: '123...',
    region: 'eu-central-1'
  },
  customStack: (scope, account) => {
    // console.log('echo = ' + JSON.stringify(account));
    const tags = JSON.parse(process.env.tags || '{}');

    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        hostedZoneId: process.env.hostedZoneId || 'Z08...',
        domainName: process.env.domainName || 'i.dev.alfpro.net',
        certArn: process.env.certArn || 'arn:aws:acm:eu-central-1:123...:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c',
      }
       : // prod
      {
        hostedZoneId: process.env.hostedZoneId || 'Z003...',
        domainName: process.env.domainName || 'i.alfpro.net',
        certArn: process.env.certArn || 'arn:aws:acm:us-east-1:123...:certificate/09d5c91e-6579-4189-882b-798301fb8fba',
      })
    };

    return new AlfCdkEc2Stack(scope, `${name}-${account.stage}`, {
      env: {
        account: account.id,
        region: account.region,
      },
      gitRepo: process.env.gitRepo || 'alf-cdk-ec2',
      tags,
      customDomain: {
        hostedZoneId: alfCdkSpecifics.hostedZoneId,
        domainName: alfCdkSpecifics.domainName,
        certArn: alfCdkSpecifics.certArn,
      },
      stackName: process.env.stackName || `itest123`,
      stage: account.stage,
    })
  },
  testCommands: (account) => [
    `aws ec2 get-console-output --instance-id $InstanceId --region ${account.region} --output text`,
    'sleep 180',
    `curl -Ssf $InstancePublicDnsName && aws cloudformation delete-stack --stack-name itest123 --region ${account.region}`,
  ],
};

// tslint:disable-next-line: no-unused-expression
new PipelineApp(pipelineAppProps);
```

In diesem Beispiel wird nur ein Staging Account definiert

## Alf CDK Backend
Das nächste Beispiel befindet sich auch in Github [alf-cdk](https://github.com/mmuller88/alf-cdk). Es ist ein sehr umfangreicher Stack bestehend aus Cognito, API GW, Lambdas, StepFunction, DynamoDB und mehr. Auch erstellt dieser Stacks andere CDK Stacks mittels einer Lambda Funktion.

```TypeScript
import { name } from './package.json';
import { PipelineApp, PipelineAppProps } from 'alf-cdk-app-pipeline/pipeline-app';
import { AlfInstancesStack, AlfInstancesStackProps, alfTypes } from './lib/alf-instances-stack'
import { sharedDevAccountProps, sharedProdAccountProps } from 'alf-cdk-app-pipeline/accountConfig';

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
      region: 'us-east-1',
      stage: 'prod',
    },
  ],
  buildAccount: {
    id: '123...',
    region: 'eu-central-1'
  },
  customStack: (scope, account) => {
    // values that are differs from the stages
    const alfCdkSpecifics = {
      ...(account.stage === 'dev' ? {
        domain: {
          domainName: `api.${sharedDevAccountProps.zoneName.slice(0,-1)}`,
          zoneName: sharedDevAccountProps.zoneName,
          hostedZoneId: sharedDevAccountProps.hostedZoneId,
          certificateArn: `arn:aws:acm:us-east-1:${account.id}:certificate/f605dd8c-4ae3-4c1b-9471-4b152e0f8846`
        },
        createInstances: {
          enabled: true,
          imageId: 'ami-0ea3405d2d2522162',
          minutes: 5,
          maxPerUser: 2,
          maxInstances: 3,
          domain: {
            domainName: `i.${sharedDevAccountProps.zoneName.slice(0,-1)}`,
            hostedZoneId: 'Z0847928PFMOCU700U4U',
            certArn: `arn:aws:acm:eu-central-1:${account.id}:certificate/d40cd852-5bbf-4c1d-9a18-2d96e5307b4c`,
          }
        },
        swagger: {
          domain: {
            domainName: sharedDevAccountProps.domainName,
            certificateArn: sharedDevAccountProps.acmCertRef,
          }
        },
        auth: undefined,
      } : { // prod stage
        domain: {
          domainName: `api.${sharedProdAccountProps.zoneName.slice(0,-1)}`, // 'api.alfpro.net',
          zoneName: sharedProdAccountProps.zoneName,
          hostedZoneId: sharedProdAccountProps.hostedZoneId,
          certificateArn: `arn:aws:acm:us-east-1:${account.id}:certificate/62010fca-125e-4780-8d71-7d745ff91789`
        },
        createInstances: {
          enabled: false,
          imageId: 'ami-01a6e31ac994bbc09',
          minutes: 45,
          maxPerUser: 2,
          maxInstances: 50,
          domain: {
            domainName: `i.${sharedProdAccountProps.zoneName.slice(0,-1)}`,
            hostedZoneId: 'Z00371764UBVAUANTU0U',
            certArn: `arn:aws:acm:eu-central-1:${account.id}:certificate/4fe684df-36da-4516-bd01-7fcc22337dff`,
          }
        },
        swagger: {
          domain: {
            domainName: sharedProdAccountProps.domainName,
            certificateArn: sharedProdAccountProps.acmCertRef,
          }
        },
        auth: {
          cognito: {
            userPoolArn: `arn:aws:cognito-idp:us-east-1:${account.id}:userpool/us-east-1_8c1pujn9g`,
            scope: 'aws.cognito.signin.user.admin'
          }
        },
      }),
    }
    // console.log('echo = ' + JSON.stringify(account));
    const alfInstancesStackProps: AlfInstancesStackProps = {
      environment: account.stage,
      env: {
        region: account.region,
        account: account.id
      },
      stage: account.stage,
      stackName: `${name}-${account.stage}`,
      domain: alfCdkSpecifics.domain,
      createInstances: {
        enabled: alfCdkSpecifics.createInstances.enabled,
        imageId: alfCdkSpecifics.createInstances.imageId,
        alfTypes,
        automatedStopping: {
          minutes: alfCdkSpecifics.createInstances.minutes
        },
        allowedConstraints: {
          maxPerUser: alfCdkSpecifics.createInstances.maxPerUser,
          maxInstances: alfCdkSpecifics.createInstances.maxInstances,
        },
        domain: alfCdkSpecifics.createInstances.domain,
      },
      executer: {
        rate: 'rate(1 minute)'
      },
      swagger: {
        file: 'templates/swagger_validations.yaml',
        domain: {
          domainName: alfCdkSpecifics.swagger.domain.domainName,
          subdomain: 'openapi',
          certificateArn: alfCdkSpecifics.swagger.domain.certificateArn,
        }
      },
      auth: alfCdkSpecifics.auth,
    };

    return new AlfInstancesStack(scope, `${name}-${account.stage}`, alfInstancesStackProps);
  },
  manualApprovals: (account) => {
    return account.stage === 'dev' ? false : true;
  },
  testCommands: (account) => [
    ...(account.stage==='dev'? [
      `npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json`,
      'echo done! Delete all remaining Stacks!',
      `aws cloudformation describe-stacks --query "Stacks[?Tags[?Key == 'alfInstanceId'][]].StackName" --region ${account.region} --output text |
      awk '{print $1}' |
      while read line;
      do aws cloudformation delete-stack --stack-name $line --region ${account.region};
      done`,
    ] : []),
  ],
};

// tslint:disable-next-line: no-unused-expression
new PipelineApp(pipelineAppProps);
```

Wie ihr seht ist das ein sehr umfangreicher Stack mit vielen Eingangs Properties. In Zukunft werde ich diesen riesen Stack eventuell etwas mehr runterbrechen. Dieses Beispiel ist in erster Linie interessant da es am Schluss ein umfangreiches Testen mit Postman und der AWS CLI macht. Das Property **testCommands** führt also für die DEV Stage Postman Tests aus mit:

```
npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json`
```

Dann löscht es alle womöglich verbliebenen CDK Stacks die durch die Tests entstanden sind mit:

```
aws cloudformation describe-stacks --query "Stacks[?Tags[?Key == 'alfInstanceId'][]].StackName" --region ${account.region} --output text |
awk '{print $1}' |
while read line;
  do aws cloudformation delete-stack --stack-name $line --region ${account.region};
done`,
```

# Zusammenfassung
CDK Codepipelines sind super cool. Allerdings auch super kompliziert bzw. komplex. Diese ganze Komplexität möchte man nicht jedesmal aufs neue bewältigen müssen nur um Stacks in eine Stagingpipeline zu pressen. Es sollte also eine gute Abstraktion zu diesen Stagingpipelines geben.

In diesem Artikel habe ich eine solche Abstraktion in Form einer Library vorgestellt. Ich betreibe damit bereits einige CDK Stacks, welche hier zum vorgestellt wurden.

Diese Library kann bisher nur auf Repositories in meinem Github Account zugreifen. Es wäre möglich die Library allgemeiner zu gestalten um auf beliebige Git Repositories zugreifen zu können. Wenn ihr das als nützlich anseht, sagt mir Bescheid. Jetzt bin ich aber neugierig. Was haltet ihr von meiner PipelineApp Library? Was kann ich verbessern? Lasst es mich wissen.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>