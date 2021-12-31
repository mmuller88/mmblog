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

Vor ein paar Monaten berichtete ich euch über mein spannendes Projekt eine voll funktionsfähige [CDK BitBucket Staging Pipeline](https://martinmueller.dev/cdk-bitbucket-pipeline) zu bauen. Seit dem ist viel passiert und wir haben die Pipeline weiter den Kundenwünschen angepasst. Zunächst will ich aber erst kurz zusammenfassen wie der Stand bisher war und dann die neuen Anforderungen beschreiben.

## Kurze Zusammenfassung

Genaue Details können im Post [CDK BitBucket Staging Pipeline](https://martinmueller.dev/cdk-bitbucket-pipeline) nachgelesen werden. Wir hatten uns also dazu entschlossen BitBucket Pipeline zu verwenden um eine CDK Staging Pipeline zu bauen.

## Probleme mit CDK Crossreferenzen

CDK Crossreferenzen sind CDK Outputs die einem anderen CDK Stack übergeben werden. Folgendes Beispiel:

...

* Wir hatten starke Probleme mit CDK Crossreferenzen
* Gelößt durch Reduzierung der Anzahl von den Stacks und einer besseren Aufteilung der Services in die jeweiligen Stacks gemäß DDD
* Haben nun 3 Stacks: FrontendSiteStack, FrontendBackendStack und MLStack

## Unabhängige Stacks

* Ein weiteres Problem war, dass diese 3 Stacks auch unabhängig voneinander in die jeweilige Stage deploybar sein sollten.
Bisher wurden immer alle 3 Stacks Deploye
* Gelößt durch custom pipeline variablen deployFrontendSiteStack, deployFrontendBackendStack und deploy MLStack

## Stage Konzept

* Viel redundanter Code im main.ts file e.g.

```ts
```

* Stage class eingeführt

## What next?

* ephermal deployments
* Lambda Rest API zum dynamischen pullen von CDK Backend Infos

## Zusammenfassung

Es macht mir immer noch Spaß mit BitBucket Pipeline zu arbeiten. Damit lassen sich tolle CDK Deployment Pipelines bauen. In diesem Post habe ich beschrieben welche neuen Herausforderungen wir hatten und wie wir sie gelößt haben. Auch sehr freut mich das mittlerweile der Kunde auch selber in der Lage ist die CDK Pipeline zu benutzen und das auch vermehrt tut.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>