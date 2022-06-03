---
title: Eine CDK BitBucket Staging Pipeline
show: 'no'
date: '2021-10-31'
image: 'bitbucket.jpg'
tags: ['de', '2021', 'bitbucket', 'aws', 'cdk'] #nofeed
engUrl: https://martinmueller.dev/cdk-bitbucket-pipeline-eng
pruneLength: 50
---

Seit einiger Zeit arbeite ich für einen Kunden mit sehr aufregenden AWS CDK Aufgaben. Der Kunde ist stark im Atlassian Ecosystem unterwegs. Zum hosten des Codes wird BitBucket verwendet. Nun will der Kunde stärker in den DevOps Bereich vordringen und seine AWS Deployments auch mit AWS CDK managen. Dafür soll die vorhandene AWS Infrastruktur in CDK übersetzt werden. Zusätzlich soll eine Staging Deployment-Pipeline die CDK Apps auf den Stages dev, qa und prod deployen. Gerne helfe ich da weiter :).

## Disclaimer

Auch wenn ich bereits sehr viel Erfahrung mit CDK habe (siehe [hier](https://martinmueller.dev/tags/cdk)), kenne ich mich so noch gar nicht mit BitBucket aus. Von daher weiß ich nicht ob mein Ansatz der ideale ist, aber zum Zeitpunkt des Schreibens dieses Artikels, funktioniert dieser ganz gut :).

Ich schreibe diesen Artikel hauptsächlich da ich keine anderen hilfreichen Posts oder Anweisungen gefunden habe, wie man vernünftig eine CDK Staging Deployment-Pipeline baut mit BitBucket. Falls du also vielleicht eine ähnliche Aufgabe hast, kann ich dir damit den Einstieg eventuell erleichtern.

## Welche Pipeline?

Nun stellte sich natürlich die frage wo soll die CDK Staging Deployment-Pipeline denn leben? Zu Auswahl standen AWS CodePipeline oder BitBucket's Pipeline.

## Vielleicht AWS CodePipeline?

Der Vorteil von AWS CodePipeline wäre das es dafür schon geniale AWS CDK Staging Pipeline Construct gibt wie z.B. der [CDK Pipeline](https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html) . Damit hätte man fast alles was das DevOps Herz begehrt z.B. eine Synth Action wobei aus CDK das Cloudformation template generiert wird und Deploy Actions die dann zu den jeweiligen Stages deployen. Auch mega genial von der CDK Pipeline sind die optionalen Actions die nach dem Deploy zu einer Stage ausgeführt werden können. Damit können z.B. Integrations Tests nach dem Deploy ausgeführt werden. Auch sehr schön ist, dass die Pipeline in TypeScript definiert ist und z.B. somit eine Dokumentation mitliefert und durch die Types einen gewissen Standard ja bereits schon vorgibt.

## Oder BitBucket's Pipeline?

Der Kunde verwendet bereits BitBucket's Pipeline zum Testen, Linten und dem Erstellen von Builds. Von daher wäre es unschön wenn der Kunde gezwungen wäre zwischen den zwei Pipeline Dashboards AWS CodePipeline und BitBucket's Pipeline hin und her zu schalten. Außerdem lassen sich prinzipielle ja alle Funktionen von der AWS CodePipeline und dem CDK Pipeline Construct ja quasi nach programmieren mit BitBucket's Pipeline.

Ein ziemlich cooles Feature welches AWS CodePipeline nicht hat, ist das Skippen von Steps falls das angegebene Subdirectory nicht geändert wurde. Hier ist ein Beispiel:

```yaml
- step:
    name: Synth CDK app
    condition:
      changesets:
        includePaths:
          - "bitbucket-pipelines.yml"
          - "devops/**"
    script:
      - echo "synth cdk app"
      ...
```

So ein cooles Feature vermisse ich bei AWS CodePipeline. Auch verwendet der Kunde ein Monorepo. Es sind also alle Projekte in einem BitBucket Repository. Das wäre auch sehr Nachteilig für AWS CodePipeline da dieses ja immer bei jedem Commit einen Pipeline Run auslösen würde.

Unter Berücksichtigung aller Vor- und Nachteile haben wir uns für BitBuckets's Codepipeline als CDK Staging Deployment-Pipeline entschieden.

## Ordnerstruktur

Wie bereits gesagt, der Kunde hat ein Monorepo und das möchte dieser natürlich beibehalten. Wir haben uns nun für die folgender Ordnerstruktur entschieden:

```bash
devops # Contains AWS CDK dependencies and CDK Apps
devops/${STAGE} # Contains stage specific scripts like bootstrap command
devops/${STAGE}/vpc # VPC CDK App
devops/${STAGE}/cognito # Cognito CDK App
devops/${STAGE}/website # S3 Website CDK App
...
```
STAGE ist entweder dev, qa oder prod .

Im **devops** Ordner befinden sich die AWS CDK dependencies. Via package.json werden alle benötigten CDK Libraries geladen z.B. :

```json
  "dependencies": {
    ...
    "@aws-cdk/aws-s3": "1.129.0",
    "@aws-cdk/aws-cloudfront": "1.129.0",
    "@aws-cdk/aws-cloudfront-origins": "1.129.0",
    "@aws-cdk/aws-s3-deployment": "1.129.0",
    ...
  }
```

Auch beinhaltet die devops/package.json ein Script zum bootstrap des Build AWS Accounts und des Synthetisierens. Der Build AWS Account ist der Account von wo aus die Stages verwaltet werden. Synthetisieren bezeichnet man den Prozess bei der die CDK App in ein oder mehrere Cloudformation Templates überführt wird:

```ts
"scripts": {
  ...
  "synth": "yarn build && yarn cdk synth",
  "bootstrap": "yarn build && yarn cdk bootstrap --trust 11111111,222222,3333333 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://44444444/us-east-1"
},
```

Der Bootstrap command erzeugt einen CDK Helper Stack im Build Account 44444444 und trusted allen Stages dev = 11111111, qa = 222222, prod = 3333333. Trusted meint hier das der CDK Helper Stack Role eine Cross Account Deploy Erlaubnis hinzugefügt wird. Damit kann der Build Account in die verschiedenen Stage Accounts deployen. Sehr wichtig ist auch, dass jeweils die Stage Accounts einen Bootstrap durchführen müssen. Der Bootstrap command befindet sich dann jeweils in devops/${STAGE}/package.json z.B. für dev:

```ts
"scripts": {
  ...
  "bootstrap": "yarn cdk bootstrap --trust 44444444 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://$11111111/us-east-1"
}
```

Wie man hier sieht muss auch umgekehrt der Stage Account z.b. dev=11111111 dem Build Account 44444444 trusten. Diese Bootstraps können etwas verwirrend sein, müssen aber zum Glück nicht oft durchgeführt werden. Ich empfehle trotzdem den Bootstrap Prozess gut zu dokumentieren in z.B. der Readme.md . Generell halte ich eine gute Dokumentation für sehr sehr hilfreich :).

## Beispiel VPC

In jeder Stage soll es ein VPC geben in der private Infrastruktur wie Postgres DBs deployed werden sollen. Jede Stage beinhaltet also ein VPC subdirectory devops/${STAGE}/vpc . Dort in einer main.ts befindet sich der CDK Code. Ich zeige das hier anhand von der dev Stage:

```ts
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../../components/vpc-stack';
const env = require('../package.json').env;

export const DevVpcStack = (app: cdk.App) => new VpcStack(app, `${env.stage}-VpcStack`, { env });
```

Da jede Stage einen VPC benötigt, macht es Sinn den gemeinsamen VPC CDK Code in eine shared Componente zu platzieren under dem Ordner devops/components :

```ts
export class VpcStack extends cdk.Stack {

  vpc: ec2.Vpc;

  constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'vpc', { maxAzs: 2 });
  }
}
```

In devops/src/main.ts wird dann das jeweilige VPC geladen:

```ts
import * as cdk from '@aws-cdk/core';
import { DevVpcStack } from '../dev/vpc/main';
import { ProdVpcStack } from '../prod/vpc/main';
import { SqaVpcStack } from '../sqa/vpc/main';
import { StagingVpcStack } from '../staging/vpc/main';

const app = new cdk.App();

// vpcs
const devVpc = DevVpcStack(app).vpc;
const sqaVpc = SqaVpcStack(app).vpc;
const stagingVpc = StagingVpcStack(app).vpc;
const prodVpc = ProdVpcStack(app).vpc;

...
```

Zugegeben die künstliche Aufteilung der Stages in devops/${STAGE}/vpc und anschließendem Zusammenführen in devops/src/main.ts ist etwas komisch und eventuell nicht ideal. Alternativ könnte auch einfach alles in devops/src/main.ts geschrieben werden. Wir erhoffen uns so aber eine bessere Übersichtlichkeit über die "einzelnen" CDK stacks.

## Bitbucket Pipeline

Die Bitbucket Pipeline durchläuft nun grob die folgenden Schritte. Zuerst werden parallel Tests durchlaufen und Builds gebaut. Unter den Builds sind z.B. auch verschiedene React Builds für die verschiedenen Stages. Danach wird der CDK synth mittels `yarn cdk synth` durchgeführt. Beim synth werden Assets wie z.B. die verschiedenen React Builds in S3 geuploaded:

```yaml
- step:
  name: Synth CDK app
  caches: 
    - node-custom
  condition:
    changesets:
      includePaths:
        - "bitbucket-pipelines.yml"
        - "devops/**"
  script:
    - export AWS_REGION=us-west-2
    - export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_BUILD
    - export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY_BUILD
    - cd devops
    - yarn synth
  artifacts:
    - devops/cdk.out/**
```

Nach dem synth kann nun die erste Stage dev die per CDK synthetisierten Cloudformation Templates anwenden. Dafür benutze ich z.B. diesen CDK Command:

```bash
yarn cdk deploy -a 'cdk.out/' dev-VpcStack --require-approval never
```

Der cdk.out Ordner wurde vorher beim CDK synth step als Artifact ausgewiesen und wird nun für die jeweiligen Stages (hier dev) und CDK stacks wiederverwendet. Der Pipeline yaml Code sieht folgendermaßen aus:

```yaml
- parallel:
    - step:
        name: Deploy vpc to dev
        caches: 
          - node-custom
        condition:
          changesets:
            includePaths:
              - "bitbucket-pipelines.yml"
              - "devops/**"
        script:
          - export AWS_REGION=us-west-2
          - export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_BUILD
          - export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY_BUILD
          - cd devops/dev/vpc && yarn deploy-cdk-stage
          - cd ../hasura && yarn deploy-cdk-stage
    - step:
        name: Diff qa
        caches: 
          - node-custom
        condition:
          changesets:
            includePaths:
              - "bitbucket-pipelines.yml"
              - "devops/**"
        script:
          - export AWS_REGION=us-west-2
          - export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_BUILD
          - export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY_BUILD
          - cd devops/qa && yarn diff
    - step:
        name: Approval deploy qa
        trigger: manual
        condition:
          changesets:
            includePaths:
              - "bitbucket-pipelines.yml"
              - "devops/**"
              - dashboard/**
        script:
          - echo "Deploy"
  - parallel:
        # qa stage simila looking to dev
```

Es wird also direkt in die dev Stage deployed. Dabei wird auch parallel ein diff zur nächsten Stage qa erzeugt. Um auch den qa deploy durchzuführen, muss via manual trigger beim **Approval deploy qa** step zugestimmt werden. Stimmt man zu läuft der ganze Prozess in qa analog zu dev ab.

## What next?

Im Sinne der Übersichtlichkeit fehlt uns noch eine Art Dashboard um die wichtigsten CfnOutput URLs anzuzeigen wie z.B. die Cloudfront Urls von den React Apps. Auch will man ja wissen welcher Commit bei dem jeweiligen Deploy verwendet wurde. Dafür würde sich sehr gut ein Dashboard eignen welches per Lambda die aktuellen Deployments sowie deren Commit ID herausfinden und wahrscheinlich auch direkt darstellen kann.

## Zusammenfassung

Mit BitBucket als Repository zu arbeiten, war mega cool. Es hat mir viel Spaß gemacht unter diesen Umständen eine CDK Staging Deployment-Pipeline zu bauen. Hier habe ich grob beschrieben wie diese Pipeline aussieht und was unsere Gründe waren diese Pipeline so zu bauen. Ob das gute Entscheidungen waren wird die Zukunft zeigen wenn der Kunde die Pipeline auch tatsächlich benutzt. Glaubst du wir haben etwas übersehen oder du hast Ideen was man besser machen kann? Dann schreibe mir doch bitte :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   