---
title: AWS CDK Multistacks für Test und Produktion
description: AWS CDK Multistacks Verwendung für Test und Produktion
show: 'no'
date: '2020-04-18'
image: 'cloud.jpg'
tags: ['de', '2020', 'aws', 'lambda', 'cdk', 'production', 'github', 'travis']
# engUrl: https://martinmueller.dev/cdk-multistack-eng
pruneLength: 50
---

**UNDER CONSTRUCTION**

Hi AWS Fans,

* CDK ist super als infrastruktur Code. Was ist das? Siehe letzten post
* Test und Produktion Stacks

# Prerequisites
* AWS ACC ...
* GitHub

# Multistacks
* Was ist nen Multistack.
* Beispiel

# Test Stack
* Kurz lebende Resourcen zum Geld sparen.

# Produktions Stack
* Andere Regions im gleich account. Aufpassen Regions manchmal unterschiedlich.
* Anderer Account für Produktion

# DevOps Pipeline
* AWS ClouFormation super geeignet da Stack updates selbständig durchgeführt werden. Im Fall von Fehler automatisch reverted. Muss aber ehrlich sein mein Projekt bisher noch nicht in einer wirklich Produktion.
* Commit to master oder feature branch triggers update / creation
* Zuerst Test Stack creation dann Tests dann evtl. Manuelle Bestätigung dann Produktion update

# Zusammenfassung
* CDK Multistack super!

# Questions: 
Multistack von CDK oder von CloudFormation? 

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>