---
title: CDK BitBucket Staging Pipeline Learnings (Teil 2)
show: 'no'
date: '2022-01-07'
image: 'bitbucket.jpg'
tags: ['de', '2022', 'bitbucket', 'aws', 'cdk', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/cdk-bitbucket-pipeline-2-eng
pruneLength: 50
---

Hi CDK folks.

Vor ein paar Monaten berichtete ich euch über mein spannendes Projekt eine voll funktionsfähige [CDK BitBucket Staging Pipeline](https://martinmueller.dev/cdk-bitbucket-pipeline) zu bauen. Seit dem ist viel passiert und wir haben die Pipeline weiter entwickelt.

## Probleme mit CDK Cross-Stack Referenzen

CDK Cross-Stack Referenzen sind CDK Outputs die einem anderen CDK Stack übergeben werden. Folgendes Beispiel:

```ts
/**
 * Stack that defines the bucket
 */
class Producer extends cdk.Stack {
  public readonly myBucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.myBucket = bucket;
  }
}

interface ConsumerProps extends cdk.StackProps {
  userBucket: s3.IBucket;
}

/**
 * Stack that consumes the bucket
 */
class Consumer extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: ConsumerProps) {
    super(scope, id, props);

    const user = new iam.User(this, 'MyUser');
    props.userBucket.grantReadWrite(user);
  }
}

const producer = new Producer(app, 'ProducerStack');
new Consumer(app, 'ConsumerStack', { userBucket: producer.myBucket });
```

Das Beispiel ist entnommen von https://docs.aws.amazon.com/cdk/api/v1/docs/aws-s3-readme.html#sharing-buckets-between-stacks . Du siehst hier sehr gut wie im Producer Stack die **myBucket** Variable erzeugt wird und wie der Consumer Stack darauf zugreift. Das ist eine CDK Cross-Stack Referenz. Und genau solche sind in unserem Projekt problematisch geworden.

Wenn num im Producer Stack etwas geändert wird was z.B. ein Löschen und anschließendes Neuerstellen der **myBucket** Variable zu folge hätte, würde Cloudformation mit einem Error antworten und ein Rollback veranlassen. Der Grund ist da der Consumer die Cross-Stack Referenz verwendet, kann diese nicht so ohne weiteres gelöscht werden. Solche und weitere Probleme haben uns das Entwickeln schwer gemacht.

Wir denken und hoffen aber nun eine gute Lösung gefunden zu haben. Zu einem haben wir die Anzahl der Stacks reduziert von ungefähr 7 auf 4. Die Neuzuordnung der Services in die 4 Stacks orientiert sich am DDD (Domain Driven Design). Das bedeutet alle Services die zu einer Domain gehören wie z.B. der React App werden zu einem Stack gebündelt. Davor war die Aufteilung eher zufällig und orientierte sich Anhand der AWS Services wie der LambdaStack oder der CognitoStack. Nun sind die Stacks nach ihren Domaine bestimmt und heißen ähnlich wie FrontendSiteStack, FrontendBackendStack und MLStack.

Diese neue Aufteilung hat die Anzahl der Cross-Stack Referenzen stark reduziert. So dass quasi nur noch wenige übrig geblieben sind die wir in den CommonStack ausgelagert haben. Der CommonStack dient allerdings als Parent Stack zu den drei anderen. Wenn nun nur Cross-Stack Referenzen zwischen Parent und Children Stacks herrschen, sollte das viel weniger Probleme verursachen als Referenzen zwischen Geschwister Stacks.

## Unabhängige Stacks

Die nächste Herausforderung war, dass die Entwickler es gerne möglich hätten die drei neuen Stacks FrontendSiteStack, FrontendBackendStack und MLStack unabhängig voneinander zu deployen. Bisher wurden alle drei immer gleichzeitig deployed.

Um dieses Problem haben wir uns für [Custom Variables](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/) entschieden. Custom Variables sind Variablen die bei Custom Pipelines beim Ausführen gesetzt werden können. Um nun die Stacks unabhänging voneinander deployen zu können, muss die Custom Pipeline mit den folgenden Variablen ausgeführt werden:

```yaml
custom:
  cdkDeploy:
    - variables:
        - name: deployFrontendSite
          default: false
        - name: deployFrontendBackend
          default: false
        - name: deployML
          default: false
```

Startet man die cdkDeploy Pipeline mit der BitBucket UI können die drei Variablen bei bedarf auf true geändert werden. Ein simples Bash Command checkt dann ob die Variable true ist oder nicht:

```yaml
script:
  - if [ "$deployFrontendSite" != true ]; then exit 0; fi 
```

Somit kann interaktiv über die Ausführung der Custom Pipeline und dem Setzen der Variablen der gewünschte Stack deployed werden. Very cool!

## Stage

Das Konzept einer Stage kann den CDK Code wesentlich übersichtlicher machen. Eine Stage fasst alle CDK Stacks zusammen die zu einer Stage we dev oder prod gehören. Hier ist ein Beispiel.

```ts
export class Stage {

  /**
     * A stage which is a collection of stacks.
     *
     */
  constructor(scope: core.Construct, props: StageStackProps) {

    const commonStack = new CommonStack(scope, props.stage + '-CommonStack', { stage: props.stage, env: props.env });

    new FrontendBackendStack(scope, props.stage + '-FrontendBackendStack', {
      stage: props.stage,
      domainName: commonStack.domainName,
      zone: commonStack.zone,
      vpc: commonStack.vpc,
      env: props.env,
      userPoolId: props.userPoolId,
    });

    new MLStack(scope, props.stage + '-MLStack', {
      stage: props.stage,
      domainName: commonStack.domainName,
      zone: commonStack.zone,
      vpc: commonStack.vpc,
      env: props.env,
      enableAlarms: props.enableLambdaAlarms,
    });
  }
}
```

Die Stage wird nun einfach in den main.ts importiert:

```ts
new Stage(app, { stage: 'dev', env: devEnv, userPoolId: 'us-west-2_3zgoE123' });
```

Durch die Verwendung einer Stage Wrapper Klasse haben wir unseren Code wesentlich übersichtlicher und einfacher wartbar gestaltet.

## What next?

Eine Staging Pipeline ist schonmal ein gut Anfang um effektiv und schnell neue Features zu entwickeln und in die Produktion zu bringen. Um allerdings noch schneller und vor allem unabhängiger von anderen Entwickler Teams entwickeln zu können, werden ephermal Deployments benötigt.

Ephermal Deployments bedeutet, dass bei jedem neuen Branch potentiell eine eine komplett neues CDK Deployment ausgespielt werden kann welches die Änderungen von dem Branch beinhaltet. Somit müssen sich die Entwickler z.B. die dev Umgebung nicht mehr teilen um neue Features auszuprobieren und zu testen. Ich bin mal gespannt wie wir das machen werden.

Unser React Frontend benötigt zur Buildzeit Backend Informationen die AWS Amplify typisch in einer config File gespeichert werden. Diese müssen mühselig per hand aktuell gehalten werden. Von daher wäre es cool wenn wir ähnlich wie bei der Amplify CLI es ermöglichen können, dass der Config File dynamisch vor dem Build gebaut werden kann. Unsere initiale Idee ist es, das mit AWS Api Gateway zu ermöglichen. Der Endpoint würde uns dann immer die aktuellen Backenddaten übermitteln und wir können diese als Config File speichern.

## Zusammenfassung

Es macht mir immer noch Spaß mit BitBucket Pipeline zu arbeiten. Damit lassen sich tolle CDK Deployment Pipelines bauen. In diesem Post habe ich beschrieben welche neuen Herausforderungen wir hatten und wie wir sie gelöst haben. Auch sehr freut mich das mittlerweile der Kunde auch selber in der Lage ist die CDK Pipeline zu benutzen und das auch vermehrt tut.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
