---
title: ALPS API kombiniert mit AWS CDK <3
show: 'no'
date: '2020-12-11'
image: 'swagger.png'
tags: ['de', '2020', 'aws', 'swagger', 'cdk', 'cfd', 'github', 'travis', 'nofeed']
engUrl: https://martinmueller.dev/alps-cdk-eng
pruneLength: 50
---

Hi :).

AWS bietet viele spannende API Technologien an. Solche sind z.B. das AWS API Gateway welches eine Implementation einer REST API ist oder AWS Appsync was eine GRAPH QL API implementiert.

Jeder dieser AWS API implementationen hat seine Vor- und Nachteile. Z.B. kann die Erstellung von Appsync schneller von der Hand gehen als das API Gateway, allerdings wird es dann wieder komplizierter bei der Erstellung von Queries and das Graph QL. Zugegeben ich kenne mich zu wenig aus um die Vor- und Nachteile der verschieden API Implementation in AWS gegeneiner auszuwägen, aber das muss ich jetzt auch nicht mehr!

Mit meiner aufregenden Arbeit mit ALPS in Kombination mit AWS CDK, kann ich die API frei auswählbar machen oder sogar gegeneinander austauschen und das alles auf Grundlage von einer ALPS Spezifikation (kurz Spec).

Was genau eine ALPS Spec ist und wie daraus mit Hilfe von AWS CDK komplette APIs wie Api Gateway oder Appsync erstellt werden können, erkläre ich euch in den nächsten Abschnitten.

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