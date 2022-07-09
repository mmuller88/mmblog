---
title: Catch AWS Lambda Timeouts 
show: "no"
date: "2022-07-10"
image: "splash.jpeg"
tags: ["de", "2022", "aws", "nofeed"] #nofeed
engUrl: https://martinmueller.dev/cdk-lambda-timeout-eng
pruneLength: 50 #du
---

Ahoi,

AWS Lambda ist wohl einer der berühmtesten wenn nicht der berühmteste compute Service von AWS. Tatsächlich ist Lambda auch mein Lieblingsservice von AWS, da es sehr einfach und unkompliziert das Implementieren der Businesslogik ermöglicht. Schon ein paar mal hatte ich allerdings das Problem, dass das Timeout der Lambda zu gering war und somit der Code nicht komplett ausgeführt wurde. Diesen Fehler zu debuggen oder zu catchen war auch oft anstrengend und nervig. Eine gute Lösung für mich war es die Lambda Duration Metrics zu nutzen um einen Alarm zu definieren.

```ts
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as lambdajs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

const exampleLambda = new lambdajs.NodejsFunction(this, 'ExampleLambda', {
    timeout: core.Duration.seconds(10),
});

new timeoutAlarm - new cw.Alarm(this, 'TimeoutAlarm') {
    metric: exampleLambda.metricDuration({ statistic: 'max' }),
    threshold: exampleLambda.timeout?.toMilliseconds() ?? 1,
    evaluationPeriods: 1,
}

const topic = new sns.Topic(
    this,
    `ErrorTopic`
);
topic.addSubscription(
    new subscriptions.EmailSubscription('alice@bob.com')
);
timeoutAlarm.addAlarmAction(
    new actions.SnsAction(topic)
);
```

Wie du hier sehen kannst, wird am Anfang eine einfach Lambda JS Function erstellt. Übrigens das lambdajs.NodejsFunction Construct unterstützt auch TypeScript. Dann wird der Timeout Alarm definiert der die Duration Metrik und den Timeout Value von der Lambda benutzt zu Konfiguration.

Danach wird eine Error Topic erstellt über die mittels einer EmailSubscription der ausgelöste Alarm per Email weitergeleitet wird.

## Vorteile

Der Vorteil der Lösung ist, dass der Code der Lambda nicht extra angepasst werden muss und das Problem somit auf Infrastruktur Level bzw. AWS CDK Level gelöst wird. Diese Lösung lässt sich genauso auf andere Lambda Sprachen wie Python oder Java anwenden.

## Fazit

Das catchen von Lambda Timeouts ist nervig. Mit ein wenig AWS CDK Code und der Lambda Duration Metrik ist das Problem schnell gelöst.

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
