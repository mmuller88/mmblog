---
title: ACS Infrastruktur erstellen leichtgemacht mit AWS CDK
show: 'no'
date: '2020-07-26'
image: 'alfcdk.jpg'
tags: ['de', '2020', 'acs', 'alfresco', 'cdk', 'docker-compose']
engUrl: https://martinmueller.dev/alf-cdk-eng
pruneLength: 50
---

Hi Alfrescans.

Infrastruktur als Code ist in der DevOps schon länger beliebt. Als einer der ersten Vorreiter von IaC (Infrastructure as Code) ist AWS mit Cloudformation. Dazu müssen Cloudformation Templates in JSON oder YAML geschrieben werden. Das funktioniert sehr gut ist aber ein zeitaufwendiger und komplexer Prozess diese Templates zu schreiben.

Mit AWS CDK wurde eine neue Abstraktionsstufe über den Cloudformation Templates geschaffen, welches es so einfach wie noch nie möglich machen, die Infrastruktur für ein lauffähiges ACS bereitzustellen. In den nächsten Abschnitten erkläre ich was AWS CDK eigentlich ist und wie es helfen kann, Infrastruktur für ACS aufzubauen.

# Was ist AWS CDK?
CDK steht für Cloud Development Kit und ist ein Open Software Development Framework zum Modellieren und Verwalten von Cloudformation Ressourcen und damit AWS Infrastruktur. AWS CDK synthetisiert zu Cloudformation Templates. Das bedeutet, es werden aus dem CDK Code Cloudformation Templates erstellt. Eine sogenannte CDK App besteht dabei aus einem oder mehreren Cloudformation Stacks. Es unterstützt bekannte Sprachen wie Java, Python, JavaScript oder TypeScript. Für den weiteren Verlauf dieses Artikels verwende ich TypeScript.

# Warum ist CDK so toll?
Das tolle an CDK im TypeScript Flavor sind die Typendefinitionen welche ein zügiges vorankommen beim Entwickeln mit der IDEA ermöglicht, da es quasi die Dokumentation dank der Typen mit sich bringt. Ebenfalls werden durch die jahrelangen Erfahrungen mit Cloudformation bereits hervorragende Defaults gesetzt, welche Überschreibungen dieser Defaults selten nötig macht. CDK kümmert sich auch ootb. um den Upload des synthetisierten Cloudformation Template und ggf. Assets in ein S3. Ebenfalls ist das CDK Framework Open Source und falls man doch gerne etwas genauer hinschauen möchte wie CDK arbeitet, ist das einfach in GitHub möglich.

AWS CDK lässt sich also hervorragend verwenden die Infrastruktur für ein ACS 6.2 Deployment bereitzustellen. Nachfolgend erkläre ich die zwei Stacks Ec2 Stack und EKS Stack, welche kreiert mit CDK kreiert wurden.

# CDK Constructs
Constructs können entweder low level oder high level sein. Low level Constructs repräsentieren dabei eine Cloudformation Resource. High Level Constructs sind eine Kombination von mehreren low level Constructs. Die ganze CDK App repräsentiert dabei einen Tree an dessen Root die App selbst sind. Danach kommen die high level Constructs und als Blätter sind die low level Constructs. Interessant zu wissen, dass low level Constructs automatisch von Cloudformation Ressourcen generiert werden.

Ein gutes Beispiel dafür ist das high level Construct Vpc aus dem Package @aws-cdk/aws-ec2 welches eine Kombination aus Ressourcen ist wie Vpc, InternetGateway, Cidr oder VpC Iam Role. Die Erstellung des high level VPC Construct sieht folgendermaßen aus:

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

Nur die Zeile ```new Vpc(this, 'vpc');``` ist nötig um ein komplettes public VPC zu definieren. Das Gleiche in einem Cloudformation Template würde 200 Zeilen lang sein! Das wird ermöglicht dadurch das CDK extrem nützliche Default Einstellungen besitzt. Man merkt wie gut dieses Framework durch die Jahre lange Erfahrungen mit Cloudformation profitiert. Möchte man gerne ein private VPC erstellen muss nur ein drittes Parameter Objekt übergeben werden:

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
Der Code ist public und im meinem [GitHub Repo](https://github.com/mmuller88/alf-cdk-ec2). Das ACS Deployment wurde mit dem [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) generiert und nutzt Docker Compose zur Orchestrierung der ACS Deployment Services. In dem File index.ts ist die CDK App definiert. Falls bisher noch keine CDK Apps deployed wurden muss vorher der CDK Toolkit Stack in der Ziel Region erstellt werden mit:

```
cdk bootstrap aws://<ACCOUNT-NUMBER>/<REGION>
```

Anschließend wird der Stack wird mit dem folgenden Befehl deployed:

```
npm run build && cdk deploy
```

Wenn alles geklappt hat, sollte die Alfresco Content App kurz ACA auf der public DNS Url erreichbar sein. Z.B.: ec2-34-201-46-76.compute-1.amazonaws.com . Diese Url kannst du direkt aus dem AWS Browser bekommen im EC2 Bereich oder du könntest eine Output Ressource für diese schreiben.

Die CDK App kreiert einen Cloudformation Stack welcher eine Ec2 Instanz hinter einem Application Loadbalancer deployed. Anschließend wird der ACS Deploy Code, der auch im gleichen Repo enthalten ist, auf die Ec2 Instanz kopiert und ACS gestartet. Docker Compose dient dabei als Container Orchestrierer.

Für einfach Entwicklerumgebungen ist das ideal, da sich Docker Compose Templates schnell erstellen lassen und einfach erweiterbar sind. Will man nun aber ein produktionsähnlicheres ACS Deployment erstellen, sollte Kubernetes als Container Orchestrierer verwendet werden.

# EKS Stack
EKS steht für Elastic Kubernetes Service und stellt bei Nutzung eine Kubernetes Masternode bereit. Auch werden die Ec2 Workernodes konfiguriert. Im Gegensatz zum Ec2 Stack verwendet der EKS Stack Kubernetes zur Orchestrierung der ACS Deployment Services. Es gibt bereits einige gute Beispiele wie mit CDK ein EKS Deployment erstellt werden kann. [Hier](https://github.com/mmuller88/alf-cdk-eks) findet ihr meinen GitHub Code. Zur Erstellung des Clusters werden folgende Properties benötigt:

```TypeScript
const eksCluster = new Cluster(this, 'Cluster', {
  clusterName: this.stackName,
  mastersRole: eksClusterAdmin,
  vpc: vpc,
  kubectlEnabled: true,  // we want to be able to manage k8s resources using CDK
  defaultCapacity: 0,  // we want to manage capacity our selves
  version: KubernetesVersion.V1_17,
});
```

Ich überschreibe den vom CDK generierten Clusternamen mit **clusterName**, da dieser nicht leserfreundlich ist. Die **masterRole** erlaubt meinem IAM User Admin Zugriff zum Cluster. Die Workernode wird dann wie folge definiert:

```TypeScript
const onDemandASG = new AutoScalingGroup(this, 'OnDemandASG', {
  vpc: vpc,
  role: workerRole,
  minCapacity: 1,
  maxCapacity: 1,
  instanceType: new InstanceType('t2.large'),
  machineImage: new EksOptimizedImage({
    kubernetesVersion: '1.17',
    nodeType: NodeType.STANDARD  // without this, incorrect SSM parameter for AMI is resolved
  }),
  updateType: UpdateType.ROLLING_UPDATE
});
```

Um Alfresco per URLs erreichbar zu machen, muss noch der Ingress mit definiert werden. Ich verwende dafür einen Nginx Ingress in AWS Flavour:

```TypeScript
new HelmChart(this, 'NginxIngress', {
  cluster: eksCluster,
  chart: 'nginx-ingress',
  repository: 'https://helm.nginx.com/stable',
  namespace: 'kube-system',
  values: {
    'rbac': {
      'create': true
    },
    'controller': {
      'scope': {
        'enabled': true,
        'namespace': acsNamespace
      },
      'config': {
        'force-ssl-redirect': true,
        'server-tokens': false
      },
      'service': {
        'targetPorts': {
          'https': 80
        },
        'annotations': {
          'service.beta.kubernetes.io/aws-load-balancer-backend-protocol': 'http',
          'service.beta.kubernetes.io/aws-load-balancer-ssl-ports': 'https',
          'service.beta.kubernetes.io/aws-load-balancer-ssl-cert': awsCertArn,
          'external-dns.alpha.kubernetes.io/hostname': `${acsNamespace}.eks.alfpro.net`,
          'service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy': awsCertPolicy
        },
        'publishService': {
          'enabled': true
        }
      }
    }
  }
})
```

Nach erfolgreichen deployen mit

```
npm run build && cdk deploy
```

erscheint der folgende Output:

```
 ✅  AcsEksCluster

Outputs:
AcsEksCluster.ClusterConfigCommand43AAE40F = aws eks update-kubeconfig --name AcsEksCluster --region us-east-1 --role-arn arn:aws:iam::1111122223333:role/AcsEksCluster-eksClusterAdminE955DB57-1H9KJVEE241KS
AcsEksCluster.ClusterGetTokenCommand06AE992E = aws eks get-token --cluster-name AcsEksCluster --region us-east-1 --role-arn arn:aws:iam::1111122223333:role/AcsEksCluster-eksClusterAdminE955DB57-1H9KJVEE241KS
```

Der aws eks update-config command kann genutzt werden um zu dem Cluster zu connecten und Cluster Konfigurationen mittel kubectl anzuwenden.

## Helm 3 Issue
Leider sind bis zum jetzigen Zeitpunkt noch keine der ACS Charts also Community und Enterprise mit Helm 3 kompatibel. Das bedeuted wir können nicht den existierenden HelmChart CDK Constructor verwenden um ACS zu installieren. Alternativ muss also ACS per Helm 2 installiert werden.

# Zusammenfassung
AWS CDK ist ein spannendes Framework zur Erstellung von Alfresco Infrastruktur in AWS. CDK synthetisiert zu Cloudformation Templates es müssen also bestehende CI CD Pipelines kaum oder garnicht verändert werden. Dabei ist der Gewinn bei der Verwendung von CDK riesig. Z.B. die Typendefinition verhindert Bugs schon im Editor. Viele Zeilen Code werden gespart und es muss kein oder kaum YAML getemplated werden. Für mich ist CDK der nächste logische Schritt für IaC in AWS. Es gibt mittlerweile sogar die ersten Bemühungen CDK auch in das [Terraform](https://github.com/hashicorp/terraform-cdk/) Ökosystem zu integrieren, was ich sehr spannend finde. Schreibt mir eure Erfahrungen mit CDK :)!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>