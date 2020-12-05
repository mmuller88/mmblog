---
title: ALPS API kombiniert mit AWS CDK <3
show: 'no'
date: '2020-12-11'
image: 'swagger.png'
tags: ['de', '2020', 'aws', 'swagger', 'cdk', 'cfd', 'github', 'travis', 'nofeed']
engUrl: https://martinmueller.dev/alps-cdk-eng
pruneLength: 50
---

Hi 

* AWS bietet viele API Technologien an. Rest Api, Graph QL, MQTT
* Haben Vor- und Nachteile z.B. Graph QL definition von queries. Rest Api einfach zu implementieren und zu dokumentieren
* Mit ALPS werden die APIs austauschbar und einfacher implementierbar und man hat die frei Wahl. Super cool
* Was ALPS API ist und wie ich es mit AWS CDK kombiniert habe in den nächsten Abschnitten
...

# ALPS API
* Specifikation einer abstrakten API über OpanAPI, GraphQL, SOAP

# AWS CDK ALPS constructs
* 
* Publish nach NPM und PYPI

## CDK ALPS REST API Construct Library
* AWS API Gateway

## CDK ALPS Graph QL API Construct Library
* AWS Appsync

## CDK Demo Deployment
* Nutzen der zwei Libraries

# Use Cases
* Sichere Migration von z.B. REST API zu Graph QL
* Bessere Abstraction der API Definition da die ALPS spec von dem Domainenexperten erstellt werden. Da simple und nur Domainenwissen enthällt

# Zusammenfassung
...

* Next steps

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>