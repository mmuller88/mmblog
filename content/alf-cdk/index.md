---
title: Infrastruktur für ACS leichtgemacht mit AWS CDK
show: 'no'
date: '2020-07-18'
image: 'hack.jpeg'
tags: ['de', '2020', 'acs', 'alfresco', 'cdk', 'docker-compose', 'nofeed']
engUrl: https://martinmueller.dev/alf-cdk-eng
pruneLength: 50
---

Hi Alfrescans.

Infrastruktur als Code ist in der DevOps schon länger beliebt. Als einer der ersten Vorreiter von IaC Infrastructure as Code war AWS mit Cloudformation. Dazu mussten Cloudformation Templates in JSON oder YAML geschrieben werden. Das funktionierte zwar sehr gut war aber ein zeitaufwendiger und komplexer Prozess diese Templates zu schreiben. 

Mit AWS CDK wurde eine neue Abstraktionsstufe über den Cloudformation Templates geschaffen, welches es so einfach wie noch nie möglich machen, die Infrastruktur für ein lauffähiges ACS bereitzustellen. In den nächsten Abschnitten erkläre ich was AWS CDK eigentlich ist und wie es helfen kann, Infrastruktur für ACS aufzubauen.

# Was ist AWS CDK?
CDK steht für Cloud Development Kit und ist ein Open Software Development Framework zum Modellieren und Verwalten von Cloudformation Resourcen und damit AWS Infrastruktur. Eine sogenannte CDK App besteht dabei aus einem oder mehreren Cloudformation Stacks. Es unterstützt bekannte Sprachen wie Java, Python, JavaScript oder TypeScript. Für den weiteren Verlauf dieses Artikels verwende ich TypeScript.

AWS CDK lässt sich also hervorragend verwenden die Infrastrucktur für ein ACS 6.2 Deployment bereitzustellen. Nachfolgend erkläre ich die zwei Stacks Ec2 Stack und EKS Stack, welche kreiert mit CDK kreiert wurden.

# CDK Constructs
Constructs können entweder low level oder high level sein. Low level Constructs repräsentieren dabei eine Cloudformation Resource. High Level Constructs sind eine Kombination von mehreren low level Constructs. Eine gutes Beispiel dafür ist das high level Construct Vpc aus dem Package @aws-cdk/aws-ec2 welches eine Kombination aus Resourcen ist wie Vpc, InternetGateway, Cidr oder VpC Iam Role. Die Erstellung des high level VPC Construct sieht folgendermaßen aus:

```TypeScript
import { Vpc } from '@aws-cdk/aws-ec2';
import { Stack, App} from '@aws-cdk/core';

class VpcStack extends Stack {
  constructor(app: App, id: string) {
    super(app, id);

    new Vpc(this, 'vpc'); // lediglich diese Zeile
  }
}

const app = new App();
new VpcStack(app, 'VpcStack');

app.synth();
```

Nur die Zeile ```new Vpc(this, 'vpc');``` ist nötig um ein komplettes public VPC zu definieren. Das Gleiche in einem Cloudformation Template würde and die 200 Zeilen kosten! Das wird ermöglicht dadurch das CDK extrem nützliche Default Einstellungen hat. Man merkt wie gut dieses Framework durch die Jahre lange Erfahrungen mit Cloudformation profitiert. Möchte man gerne ein private VPC erstellen muss nur ein drittes Parameter Objekt übergeben werden: 

```TypeScript
new Vpc(this, 'CustomVPC', {
    cidr: '10.0.0.0/16',
    maxAzs: 2,
    subnetConfiguration: [{
        cidrMask: 26,
        name: 'isolatedSubnet',
        subnetType: SubnetType.ISOLATED,
    }],
    natGateways: 0
});
```

# Ec2 Stack
Dieser Stack nutzt Docker Compose zur Orchestrierung der ACS Deployment Services. ...

* geringere Komplexität der Orchestrierung im Vergleich zu Kubernetes. Es wird keine Master Node benötigt. Perfekt für Dev
* allerdings keine extra features bzw. erhöhter Aufwand für self healing, Load Balancing, SSL Verschlüsselung

# EKS Stack
Im Gegensatz zum Ec2 Stack verwendet der EKS Stack Kubernetes zur Orchestrierung der ACS Deployment Services. 

* github.com/Alfresco/acs-community-deployment/helm ...
* 

# Zusammenfassung
AWS CDK ist ein spannendes Framework zur Kreierung von AWS Infrastrucktur. 

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>