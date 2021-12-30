---
title: CDK BitBucket Staging Pipeline Learnings (Teil 2)
show: 'no'
date: '2022-01-07'
image: 'bitbucket.jpg'
tags: ['de', '2022', 'bitbucket', 'aws', 'cdk', 'nofeeds'] #nofeed
engUrl: https://martinmueller.dev/cdk-bitbucket-pipeline-2-eng
pruneLength: 50
---


* Erster [Post](https://martinmueller.dev/cdk-bitbucket-pipeline)
* Kurze Zusammenfassung
* Viel passiert und viel gelernt
* Wir hatten starke Probleme mit CDK Crossreferenzen
* Gelößt durch Reduzierung der Anzahl von den Stacks und einer besseren Aufteilung der Services in die jeweiligen Stacks gemäß DDD
* Haben nun 3 Stacks: FrontendSiteStack, FrontendBackendStack und MLStack
* Ein weiteres Problem war, dass diese 3 Stacks auch unabhängig voneinander in die jeweilige Stage deploybar sein sollten.
Bisher wurden immer alle 3 Stacks Deploye
* Gelößt durch custom pipeline variablen deployFrontendSiteStack, deployFrontendBackendStack und deploy MLStack
* Stage class eingeführt

## What next?

...

## Zusammenfassung

...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>