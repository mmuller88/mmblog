---
title: AWS Cloudformation deploying mit Lambda
show: 'no'
date: '2021-06-07'
# image: 'version-prs.png'
tags: ['de', '2021', 'projen', 'cdk', 'aws'] #nofeed
engUrl: https://martinmueller.dev/aws-deploy-cfn-with-lambda-eng
pruneLength: 50
---

Hi Leute!

Ich arbeite zurzeit an einem spannenden Projekt bei dem es möglich sein soll flexibel über eine API, Ec2 Instanzen zu erstellen. Diese Instanzen sollen dann dem Kunden zu Übungszwecken zur Verfügung gestellt werden. Die Instanzen sollen dabei für den Kunden angepasst werden, also ein bestimmtes Setting haben wie dem Ec2 Typen, ein paar spezielle Tags und einiges mehr.

Das Deployment der Ec2 Instanzen soll möglichst kostengünstig durch Lambdas geschehen. Vor ca einem Jahr hatte ich schonmal ein ähnliches Projekt gemacht bei dem dynamisch Ec2 Instanzen für ein Alfresco Deployment erzeugt werden. [Alfresco Provisioner](https://martinmueller.dev/alf-provisioner-eng)

Wie sich möglichst dynamisch und auch extrem einfach wartbar die Ec2 Instanzen mit AWS CDK über eine API wie Api Gateway oder Appsync deployen lassen, erkläre ich in den nächsten Abschnitten.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die z.B. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.

Im nächsten Abschnitt fasse ich kurz die Anforderungen für das dynamische Ec2 Deploying über eine API zusammen.

# Anforderungen
Die Ec2 Instanzen sollen dynamisch über eine API wie AWS ApiGateway, welches ein REST API implementiert oder AWS AppSync, welches ein GraphQL implementiert, deploybar sein. Dabei sollen gewisse Tags wie UserId oder VmType an die Ec2 Instanz geheftet werden. Damit lassen sich die Ec2 Instanzen dann wieder leicht auffinden und z.B. in einem React Frontend anzeigen.

Für die Verwaltung, also Erstellung, Löschung und Update der zur Ec2 Instanz gehörenden Resourcen, soll mit Cloudformation (kurz: CFN) geschehen. Cloudformation ist ein praktischer AWS Service zur Verwaltung von solchen Resourcen. Somit kann der Ec2 Stack einfach erstellt, angepasst oder gelöscht werden. Ein weiterer Vorteil für die Verwendung von CFN ist, dass sich so dieser Teil auch separat von Rest wie der API testen lässt. Ich habe dafür sogar eine eigene Staging Pipeline erstellt [Stating Lib](https://martinmueller.dev/cdk-pipeline-lib).

Für die Erstellung der CFN Templates möchte ich AWS CDK verwenden, da die Verwendung von CDK die Erstellung und Wartung des Ec2 Stacks extrem erleichtert.

Das von CDK synthetisierte Ec2 CFN Template soll durch eine Lambda deployed werden.

# Problem
Leider ist AWS CDK alleine nicht für diesen Use Case geschaffen. Das Hauptproblem ist, dass die CFN Parameter nicht flexibel sein können und nach der Synth Phase die Parameter festgeschrieben wurden. Dieser Nachteil könnte umgangen werden indem man immer einen kompletten deploy mit Context Parametern z.B.
 ```
 cdk deploy -c userId=Alice -c vmType=2
 ```
 macht. Das ist aber sehr unpraktisch da es sehr viel Build time beansprucht und jedes mal ein neues CFN Template quasi erzeugt wird.

Um dieses Problem zu lösen habe ich mich entschieden Cloudformation direkt zu benutzen. Denn CFN hat das schöne Feature der Parameter. Bei jedem CFN Deployment können also Parameter spezifiziert werden um z.B. den Namen der Ec2 Instanz anzupassen. Genau das wonach ich gesucht habe.

# Lösung
Ich verwende also CDK für den Ec2 Stack und dem Lambda welches den Ec2 Stack dynamisch deployen soll. Fangen wir mal mit dem Lambda an:

```ts
const cdkSchedulerLambda = new lambdajs.NodejsFunction(this, 'scheduler', {
  entry: `${path.join(__dirname)}/lambda/scheduler.ts`,
  bundling: {
    commandHooks: {
      afterBundling(inputDir: string, outputDir: string): string[] {
        return [`cp ${inputDir}/cfn/ec2-vm-stack.template.json ${outputDir} 2>/dev/null`];
      },
      beforeInstall(_inputDir: string, _outputDir: string): string[] {
        return [];
      },
      beforeBundling(_inputDir: string, _outputDir: string): string[] {
        return [];
      },
    },
  },
  logRetention: logs.RetentionDays.ONE_DAY,
  environment: {},
  timeout: core.Duration.minutes(15),
});
```

Ich verwende hier die [LambdaJS](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-nodejs-readme.html) Variante. Diese hat den Vorteil dass ich die Lambda **scheduler.ts** direct in TypeScript definieren kann und das Construct selbstständig diese in JS convertiert und in AWS hochlädt. Das ist als ein toller Grad von Abstraktion. Und mit dem afterBundling webhook kann ich das CFN Template schonmal in die Lambda hochladen. Somit muss ich nicht kompliziert mit einem anderen Storage wie S3 oder EFS arbeiten.

Als nächstes schauen wir uns mal die **scheduler.ts** an:


```ts
// eslint-disable-next-line import/no-extraneous-dependencies
import { readFileSync } from 'fs';
import * as lambda from 'aws-lambda';

import * as AWS from 'aws-sdk';
import { Ec2 } from './query-ec2';

const cfn = new AWS.CloudFormation();

export async function handler(event: lambda.DynamoDBStreamEvent) {
  console.debug(`event: ${JSON.stringify(event)}`);

  if (event.Records.length !== 1) {
    console.debug('event not valid! Exactly one record allowed!');
    return 'failed';
  }

  let newImage: Ec2 | null = null;
  if (event.Records[0].dynamodb?.NewImage) {
    newImage = AWS.DynamoDB.Converter.unmarshall(event.Records[0].dynamodb.NewImage) as Ec2;
  } else {
    console.debug('no NewImage existing');
  }

  let oldImage: Ec2 | null = null;
  if (event.Records[0].dynamodb?.OldImage) {
    oldImage = AWS.DynamoDB.Converter.unmarshall(event.Records[0].dynamodb.OldImage) as Ec2;
  } else {
    console.debug('no OldImage existing');
  }

  const templateBody = readFileSync('./ec2-vm-stack.template.json', 'utf-8');
  console.debug(`templateBody: ${JSON.stringify(templateBody)}`);

  if (newImage) {
    console.debug('Having NewImage so creating or updating');
    const createStackParams: AWS.CloudFormation.Types.CreateStackInput = {
      StackName: `stack-${newImage.userId ?? 'noUserId'}-${newImage.vmType ?? '-1'}`,
      TemplateBody: templateBody,
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
      Parameters: [{
        ParameterKey: 'userIdParam',
        ParameterValue: newImage.userId,
      }, {
        ParameterKey: 'vmTypeParam',
        ParameterValue: newImage.vmType.toString(),
      }],
    };
    console.debug(`createStackParams: ${JSON.stringify(createStackParams)}`);
    try {
      const createStackResult = await cfn.createStack(createStackParams).promise();
      console.debug(`createStackResult: ${JSON.stringify(createStackResult)}`);
    } catch (error) {
      console.debug(`Creating failed with this error: ${JSON.stringify(error)}`);
      const updateStackResult = await cfn.updateStack(createStackParams).promise();
      console.debug(`updateStackResult: ${JSON.stringify(updateStackResult)}`);
    }
    return 'success';
  } else {
    if (oldImage) {
      console.debug('Having no NewImage but OldImage so deleting!');
      const deleteStackParams: AWS.CloudFormation.Types.DeleteStackInput = {
        StackName: `stack-${oldImage.userId ?? 'noUserId'}-${oldImage.vmType ?? 'noVmType'}`,
      };
      console.debug(`deleteStackParams: ${JSON.stringify(deleteStackParams)}`);
      const deleteStackResult = await cfn.deleteStack(deleteStackParams).promise();
      console.debug(`deleteStackResult: ${JSON.stringify(deleteStackResult)}`);
      return 'deleted';
    }
  }
  return 'failed';
};
```

Dadurch dass ich ein DynamoDBStreamEvent als Input verwenden, verkompliziert es etwas den Code. Prinzipiell wichtig sind aber diese Zeilen:

```ts
const templateBody = readFileSync('./ec2-vm-stack.template.json', 'utf-8');

const createStackParams: AWS.CloudFormation.Types.CreateStackInput = {
      StackName: `stack-${newImage.userId ?? 'noUserId'}-${newImage.vmType ?? '-1'}`,
      TemplateBody: templateBody,
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
      Parameters: [{
        ParameterKey: 'userIdParam',
        ParameterValue: newImage.userId,
      }, {
        ParameterKey: 'vmTypeParam',
        ParameterValue: newImage.vmType.toString(),
      }],
    };
    console.debug(`createStackParams: ${JSON.stringify(createStackParams)}`);
    try {
      const createStackResult = await cfn.createStack(createStackParams).promise();
      console.debug(`createStackResult: ${JSON.stringify(createStackResult)}`);

      ...
```

Hier wird also das CFN Template aus der Datei ec2-vm-stack.template.json geladen und mittels AWS SDK **createStack** applied.

Bleibt also nur noch die ec2-vm-stack.template.json. Wie erzeuge ich diese? Well es ist wie bereits gesagt auch ein CDK Stack. Allerdings benutzt dieser CFN parameters als Input für **userIdParam** und **vmTypeParam**. Und hier ist der code für den Ec2 Stack:

```ts
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { CustomStack } from 'aws-cdk-staging-pipeline/lib/custom-stack';
import { KeyPair } from 'cdk-ec2-key-pair';
import * as statement from 'cdk-iam-floyd';

export interface Ec2StackProps extends cdk.StackProps {
  readonly stage: string;
}
export class Ec2Stack extends CustomStack {
  constructor(scope: cdk.Construct, id: string, props: Ec2StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      isDefault: true,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'sg', {
      vpc: vpc,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

    const userData = ec2.UserData.forLinux();
    userData.addCommands(`
#!/bin/bash
yum update -y
yum install -y httpd.x86_64
systemctl start httpd.service
systemctl enable httpd.service
echo “Hello World” > /var/www/html/index.html
    `);

    const userIdParam = new cdk.CfnParameter(this, 'userIdParam', {
      default: 'noUserId',
    });

    const vmTypeParam = new cdk.CfnParameter(this, 'vmTypeParam', {
      default: '-2',
    });

    const identifier = `${userIdParam.value.toString() ?? 'noUserId'}-${vmTypeParam.value.toString() ?? '-1'}`;

    const instance = new ec2.Instance(this, 'instance', {
      instanceName: `vm-${identifier}`,
      instanceType: new ec2.InstanceType('t2.micro'),
      vpc,
      securityGroup,
      keyName: 'mykey',
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData,
    });

    cdk.Tags.of(instance).add('Owner', 'Hacklab');
    cdk.Tags.of(instance).add('UserId', userIdParam.value.toString());
    cdk.Tags.of(instance).add('VmType', vmTypeParam.value.toString());

    instance.addToRolePolicy(new statement.Ec2().allow().toDescribeVolumes().toDetachVolume()
      .toAttachVolume().toCreateTags().toDescribeTags().toTerminateInstances().toDeleteSecurityGroup().toDescribeInstances().toStopInstances());

  }
}

```

Interessant ist, dass ich die CFN Parameter **userIdParam** und **vmTypeParam** verwende für den dynamischen Anteil des Ec2 Stacks. Wird der Stack nun als über die Lambda erzeugt, bekommt z.B. die Ec2 Instanz die beiden Tags UserId und VmType mit den Werten der CFN Parameter.

# Zusammenfassung
Ec2 Instanzen mittels CFN und Lambdas zu erzeugen ist ne coole Sache. Mit CDK lässt sich alles also die Lambda, die API und der Ec2 Stack sehr leicht formulieren und erweitern. Super cool ist auch, dass es mit CFN sehr leicht ist andere Ressourcen in Zukunft mit dazuzuholen. So will ich z.B. in Zukunft eventuell auch einen S3 Bucket für das Deployment bereitstellen. Ich hoffe der Beitrag hat euch gefallen und vielleicht sogar geholfen. Habt ihr Fragen? Schreibt mir :) !

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>