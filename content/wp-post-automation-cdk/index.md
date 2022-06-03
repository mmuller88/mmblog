---
title: Wordpress Beiträge automatisieren mit AWS CDK
show: 'no'
date: '2021-08-08'
image: 'wp-aws.jpg'
tags: ['de', '2021', 'github', 'docker', 'wordpress', 'cdk'] #nofeed
engUrl: https://martinmueller.dev/wp-post-automation-cdk-eng
pruneLength: 50
---

Hi Leute!

In meinem [letzten Post](https://martinmueller.dev/wordpress-with-docker) ging es darum wie ich ein Wordpress Deployment mit Docker und ein paar coolen Scripts, DevOps freundlicher gestalten kann. Heute soll es um eine andere spannende Aufgabe gehen. Undzwar möchte der Kunde, dass mittels AWS und beim Hochladen von Videos zu S3, automatisch neue Wordpress Beiträge erzeugt werden. Das klingt nach einer spannenden Aufgabe. In den nächsten Abschnitten beschreibe ich meine Lösung.

# Wordpress AWS Lösung

Wie oben beschrieben möchte ich, dass nach dem Video Upload zu S3 ein Wordpress Beitrag erstellt wird. Und natürlich soll das Video dann in dem Post eingefügt sein. Dafür brauche ich hauptsächlich die zwei AWS Services S3 und Lambda. Das Lambda muss dann so eingestellt werden, dass bei einem Upload zu S3 die Lambda Logik ausgeführt wird.

Das Lambda soll sich dann mittels SSH in die Wordpress Umgebung einloggen und per [WP CLI](https://developer.wordpress.org/cli/commands/post/create/) einen neuen Beitrag erstellen. Ich finde es ziemlich cool, dass Wordpress eine eigene CLI hat. Mit dieser kann ich dann z.B. einfach neue Beiträge erstellen.

Die Konfiguration der AWS Services mache ich mit AWS CDK. Den kompletten Code findet ihr in meinem Github Repo [hier](https://github.com/hacking-akademie/video-up)

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die eg. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.

Der Wordpress S3 Lambda Stack sieht nun folgendermaßen aus:

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

Bei der Lambda habe ich mich für das [NodeJsFunction Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-nodejs.NodejsFunction.html) entschieden weil es mit vielen Vorteilen kommt wie esbuild als Packagemanager und ich somit keine separate package.json für die Lambda erstellen muss da esbuild sich den benötigten Library Code aus der Haupt package.json zusammensucht.

Das ssh2 Modul für die Lambda muss allerdings als external Modul geladen werden. Das bedeuted einfach, dass esbuild hierfür nicht als packagemanager verwendet wird und das Modul komplett geladen wird.

Der Code für die Lambda Function wird im nächsten Abschnitt gezeigt und erklärt.

# Lambda
Die Lambda hat als Event Source den S3 Bucket und wird beim Erstellen von Objekten im S3 Bucket ausgeführt. Dann verbindet sich die Lambda mit dem Wordpress Hoster über SSH und erstellt einen Wordpress Beitrag mittels [WP CLI](https://developer.wordpress.org/cli/commands/post/create/).

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

  // DateiName: LektionID_KategorieID_Titel
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

Wie ihr sehen könnt verwende ich die NodeSSH Klasse vom node-ssh package um mich zu dem wordpress Hoster zu verbinden. Dann pare ich einige Informationen vom S3 Objekt Key wie dem Titel oder die Lektion. Am Schluss erstelle ich einfach mit der WP CLI die wordpress Beiträge.

# Zusammenfassung
Die Erstellung von Wordpress Beiträgen mittels AWS Services zu automatisieren ist einfach mega cool. Dafür habe ich einen kleinen AWS CDK Stack gebaut. Ich bin schon sehr gespannt was sich eventuell noch in Wordpress automatisieren lässt :). Habt ihr vielleicht eine Idee? Dann schreibt mir!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   