---
title: AWS CDK Let's build a Platform - Frontend
show: 'no'
date: '2020-09-06'
image: 'frontend.png'
tags: ['de', '2020', 'aws', 'react', 'cdk']
engUrl: https://martinmueller.dev/cdk-platform-frontend-eng
pruneLength: 50
---

Hi CDK Fans,

Da ich die tolle Gelegenheit habe bei dem Bau einer Platform für meine Firma [unimed.de](https://unimed.de) zu helfen, will ich euch erklären wie das aussieht. Zurzeit arbeiten wir an einer spannenden Platform zum effizienten Speichern und Auffinden von internen Daten. Meine Hauptverantwortlichkeit liegt dabei in der AWS Infrastruktur.

Unser DevOps Team möchte soviel wie möglich in AWS auslagern. Für die Verwaltung der Ressourcen in AWS nutzen wir AWS CDK. AWS CDK ist ein Framework zur Erstellung und Anwendung von Cloudformation Templates. Dabei kann man zwischen gängigen Programmiersprachen auswählen. Wir haben uns für TypeScript entschieden da auch unser Frontend in TypeScript geschrieben ist und den Vorteil der starken Typendefinition mit sich bringt ohne dabei gefühlt viel an Flexibilität zu verlieren. Wenn du mehr über AWS CDK wissen möchtest empfehle ich dir meine anderen Posts hier in meinem Blog wie z.B. [cdk-example](https://martinmueller.dev/cdk-example).

Das eben erwähnte Frontend ist mit React im TypeScript Flavour implementiert. Ich plane eine mehrteilige Serie über "AWS CDK Let's build a Platform' und in dieser Folge geht es speziell um das Frontend.

# React Frontend
Wie schon erwähnt unser Frontend is eine React Browser App im TypeScript Flavor. Sie nutzt das Material Design wo immer es möglich ist. Die Authentifizierung läuft über Keycloak welches an unser firmeninternes Active Directory angeschlossen ist. Nach dem Eingeben der Zugangsdaten kann direkt nach relevanten Daten gesucht und Neue eingefügt werden. Die static App wird mit ```npm run build``` in den Ordner build gebaut.

An dieser Stelle möchte ich einen Schwank auf die Infrastruktur machen. Die React Browser App ist eine Static Web App und um diese mittels AWS werden einige AWS Ressourcen benötigt. Diese möchte ich im nächsten Abschnitte Auflisten und wie sie mittel CDK verwaltet werden können.

# CDK Stack
Zur Darstellung der static React App wird ein S3 Bucket benötigt, welcher als static Web App Bucket dient:

```TypeScript
const bucket = new AutoDeleteBucket(this, props.domainName, {
  bucketName: `${props.subDomain}.${props.domainName}`,
  websiteIndexDocument: 'index.html',
  websiteErrorDocument: 'index.html',
  removalPolicy: core.RemovalPolicy.DESTROY,
});
```

Ich verwende ein CDK Highlevel Construct mit Namen [AutoDeleteBucket](https://www.npmjs.com/package/@mobileposse/auto-delete-bucket) welcher sich bei Bedarf selbst löschen kann. Das normale [S3Bucket Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-s3.Bucket.html) kann die Löschung des Buckets nur durchführen wenn keine Daten in diesem Enthalten sind. Der AutDeleteBucket löscht also erst alle in im enthaltenen Daten und entfernt sich dann selbst. Dieses flexible Verhalten ist durchaus nützlich für Buckets die lediglich als static Web App Container dienen sollen. Der Name des static Web App Buckets ```bucketName: ${props.subDomain}.${props.domainName}``` wird üblicherweise nach der Domain vergeben z.B. www.example.com .

Der S3 Bucket speichert das statische Build und wird mit Cloudfront verbunden:

```TypeScript
const cloudFrontOAI = new OriginAccessIdentity(this, 'OAI', {
  comment: `OAI for ${props.domainName} website.`,
});

const cloudFrontDistProps: CloudFrontWebDistributionProps = {
  aliasConfiguration: {
      acmCertRef: props.acmCertRef,
      names: [ `${props.subDomain}.${props.domainName}` ],
      sslMethod: SSLMethod.SNI,
      securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
  },
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource: bucket,
        originAccessIdentity: cloudFrontOAI,
      },
      behaviors: [{ isDefaultBehavior: true }],
    },
  ],
  errorConfigurations: [
    {
      errorCode: 404,
      errorCachingMinTtl: 60,
      responseCode: 200,
      responsePagePath: "/index.html"
    }
  ]
};

const cloudfrontDistribution = new CloudFrontWebDistribution(
  this,
  `${props.subDomain}.${props.domainName}-cfd`,
  cloudFrontDistProps
);
```

Cloudfront ist ein Cloud Distribution Network (kurz: CDN) von AWS welches die static Web Apps überall auf der Welt in den jeweiligen Regionen cashed. Somit wird die Latency während des Ladens auf ein Minimum gehalten.

Um nun selbst den static Web App Build in den S3 Bucket zu laden musst noch ein BucketDeployment Construct erstellt werden:

```TypeScript
new BucketDeployment(this, `DeployApp-${new Date().toString()}`, {
  sources: [Source.asset("../build")],
  destinationBucket: bucket,
  distribution: cloudfrontDistribution,
  distributionPaths: ['/'],
});
```

Auch wird hier im BucketDeployment der Pfad zur Invalidierung der Cloudfront Distribution angegeben. Das sorgt dann für ein Neuladen des Cashes sofern eine neue App deployed wird. Der static Web App build Ordner enthält das Build der React App und wurde vorher mit ```npm run build``` erstellt.

Weiterhin wird eine Route 53 Record Resource benötigt um eine Custom Domain (z.B. www.example.com) auf den Cloudfront Endpoint zu zeigen um ein die static Web App mittels URL aufrufbar zu machen:

```TypeScript
const zone = HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
new ARecord(this, 'SiteAliasRecord', {
  recordName: `${props.subDomain}.${props.domainName}`,
  target: AddressRecordTarget.fromAlias(new CloudFrontTarget(cloudfrontDistribution)),
  zone
});
```

Und hier ist noch der gesamte Code:

```TypeScript
import { StackProps, Construct } from '@aws-cdk/core';
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import {
  CloudFrontWebDistribution,
  CloudFrontWebDistributionProps,
  OriginAccessIdentity,
  SSLMethod,
  SecurityPolicyProtocol
} from '@aws-cdk/aws-cloudfront';
import { ARecord, AddressRecordTarget, HostedZone } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
// @ts-ignore
import codedeploy = require('@aws-cdk/aws-codedeploy');
// @ts-ignore
import lambda = require('@aws-cdk/aws-lambda');
// @ts-ignore
import core = require('@aws-cdk/core');


export interface FrontendStackProps extends StackProps {
  stage: string;
  acmCertRef: string;
  domainName: string;
  subDomain: string;
}

export class FrontendStack extends core.Stack {

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    const bucket = new AutoDeleteBucket(this, props.domainName, {
      bucketName: `${props.subDomain}.${props.domainName}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: core.RemovalPolicy.DESTROY,
    });

    const cloudFrontOAI = new OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${props.domainName} website.`,
    });

    const cloudFrontDistProps: CloudFrontWebDistributionProps = {
      aliasConfiguration: {
          acmCertRef: props.acmCertRef,
          names: [ `${props.subDomain}.${props.domainName}` ],
          sslMethod: SSLMethod.SNI,
          securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
      },
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: cloudFrontOAI,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      errorConfigurations: [
        {
          errorCode: 404,
          errorCachingMinTtl: 60,
          responseCode: 200,
          responsePagePath: "/index.html"
        }
      ]
    };

    const cloudfrontDistribution = new CloudFrontWebDistribution(
      this,
      `${props.subDomain}.${props.domainName}-cfd`,
      cloudFrontDistProps
    );

    new BucketDeployment(this, `DeployApp-${new Date().toString()}`, {
      sources: [Source.asset("../build")],
      destinationBucket: bucket,
      distribution: cloudfrontDistribution,
      distributionPaths: ['/'],
    });

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
    new ARecord(this, 'SiteAliasRecord', {
      recordName: `${props.subDomain}.${props.domainName}`,
      target: AddressRecordTarget.fromAlias(new CloudFrontTarget(cloudfrontDistribution)),
      zone
    });
  }
}
```

# Pipeline
Wir deployen die static React App mittels einer Staging Pipeline. Das bedeutet die App durchläuft die verschieden Stages Dev, QA und Prod. Alle Stages sind separierte Accounts. Somit erreicht man eine erhöhte Sicherheit durch Trennung der Ressourcen. Der Dev Account wird zum testen neuer Features genutzt. Die QA Umgebung dient als nächste Stage.

Ich würde gerne etwas ausführlicher über unsere Staging Pipeline im nächsten Teil der Serie berichten.

# Zusammenfassung
Eine Plattform mittels AWS zu bauen ist aufregend und macht Spaß. Die komplette Infrastruktur als Code zu haben ist extrem Vorteilhaft. Es ermöglicht ein ausgeklügeltes Staging von zum Beispiel einer Dev Environment nach QA und dann nach Prod. Des Weiteren dient der Code als Dokumentation über was genau in AWS Deployed wurde und wird. Es ist auch viel weniger fehleranfällig als alles manuelle zusammenklicken zu müssen.

Hier habe ich euch den ersten Teil meiner "AWS CDK Let's build a Platform" Reihe vorgestellt. Ich erkläre welche Ressourcen unsere static Web App in AWS benötigt und wie diese mittels CDK verwaltet werden. Im nächsten Teil werde ich ausführlicher über unsere Staging Pipeline sprechen die quasi überall wiederverwendet wird um CDK Apps durch die verschiedenen Stages Dev, QA und Prod zu schleusen. Ich hoffe euch hat der Artikel gefallen und wenn ihr fragen habt, schreibt mir doch einfach.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>