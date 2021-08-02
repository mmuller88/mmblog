---
title: Wordpress Beiträge automatisieren mit AWS CDK
show: 'no'
date: '2021-08-08'
image: 'docker-wordpress.png'
tags: ['de', '2021', 'github', 'docker', 'wordpress', 'cdk', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/wp-post-automation-cdk-eng
pruneLength: 50
---

Hi Leute!

In meinem [letzten Post](https://martinmueller.dev/wordpress-with-docker) ging es darum wie ich das Wordpress Deployment mit Docker und ein paar coolen Scripts DevOps freundlicher gestalten kann. Heute soll es um eine andere spannende Aufgabe gehen. Undzwar möchte der Kunde gerne, dass mittels AWS und beim Hochladen von Videos zu S3 automatisch neue Wordpress Beiträge erzeugt werden. Das klingt nach einer spannenden Aufgabe. In den nächsten Abschnitten beschreibe ich meine Lösung.


* Letzter Post ging um Wordpress und wie ich das Setup gestaltet habe
* Kunde möchte gerne automatisiert Wordpress Beiträge erstellt haben wenn ein Video in S3 hochgeladen wird
* Verwende AWS CDK für S3 Bucket, Lambda und Lambda Event, NPM Simple-SSH
...

# Wordpress AWS Lösung

Wie oben beschrieben möchte ich dass nach dem Video Upload zu S3 eine Wordpress Beitrag erstellt wird. Dafür brauche ich hauptsächlich die zwei AWS Services S3 und Lambda. Das Lambda muss dann so eingestellt werden, dass bei einem Upload zu S3 die Lambda Logik ausgeführt wird. 

Das Lambda soll sich dann mittels SSH in die Wordpress Umgebung einloggen und per [WP CLI](https://developer.wordpress.org/cli/commands/post/create/) neue Beiträge erstellen. Ich finde es ziemlich cool, dass Wordpress eine eigene CLI hat um auf den Wordpress Server zuzugreifen und coole Sachen zu machen wie z.B. das Erstellen von Beiträgen.

Die Konfiguration der AWS Services mache ich mit AWS CDK.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die z.B. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.


Der Wordpress S3 Lambda Stack sieht nun folgendermaßen aus:

```ts
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';
import * as lambdajs from '@aws-cdk/aws-lambda-nodejs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { CustomStack } from 'aws-cdk-staging-pipeline/lib/custom-stack';
import * as statement from 'cdk-iam-floyd';

export interface UploadBucketStackProps extends cdk.StackProps {
  readonly stage: string;
}

export class UploadBucketStack extends CustomStack {
  constructor(scope: cdk.Construct, id: string, props: UploadBucketStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'hacklab-videos', {
      bucketName: 'hacklab-videos',
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

Bei der Lambda habe ich mich für das [NodeJsFunction Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-nodejs.NodejsFunction.html) entschieden weil die einfach mit vielen Annähmlichkeiten kommt wie z.B. esbuild als Packagemanager und ich somit keine separate package.json für die Lambda bauen muss da esbuild sich den benötigten Libary Code aus der Haupt package.json zusammensucht.

Das ssh2 Modul für die Lambda muss allerdings als external Modul geladen werden. Das bedeuted einfach, dass esbuild hierfür nicht als packagemanager verwendet wird und das Modul komplett geladen wird.

* mit AWS CDK geschrieben AWS TAG
* GitHub Repo Setup mit Projen PROJEN TAG
* S3 Upload triggerd Lambda. Lambda SSH in WP Umgebung und für wp CLI aus.

# Lambda
* Lambda wird ausgelöst wenn Upload in S3
* Connected sich zu Wordpress Hoster (Raidbox) mittels ssh (Simple-SSH)

# Zusammenfassung
Die Erstellung von Wordpress Beiträgen mittels AWS Services zu automatisieren ist einfach mega cool. Dafür habe einen kleinen AWS CDK Stack gebaut. Ich bin schon sehr gespannt was sich eventuell noch in Wordpress automatisieren lässt :). Habt ihr vielleicht eine Idee? Dann schreibt mir!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>