---
title: AWS DynamoDB Analysen mit QuickSight
show: 'no'
date: '2021-04-01'
image: 'pipeline.png'
tags: ['de', '2021', 'projen', 'cdk', 'aws', 'nofeed']
engUrl: https://martinmueller.dev/cdk-appsync-eng
pruneLength: 50
---

Hi.

* Analyse von DynamoDB daten schwierig da sie sich nicht querien lassen wie z.B. Relationale Daten
* Lösung ist das flattening in ein S3 Bucket. Dabei werden DDB daten als JSON Files in S3 gespeichert. Anschließend querien mit QuickSight

# DynamoDB
* dokument store
* daten in flexiblem format abspeichern ohne Schemavorgabe
* extrem perfomant und scalable. Sehr klevere Partitionierungs Strategie

# QuickSight
* what is quicksight
* needs a lot permissions. can do manually or with aws cdk
* analyse, dashboards erstellen

# AWS CDK
...

# AWS CDK Stack
...

# Probleme
* AthenaDynamoDBConnector Lambda kann nicht mit AWS CDK einfach deployed werden. Es benutzt AWS SAM zum deployen. Das einfachste zurzeit is es manuell zu tun. 

* QuickSight DataSets sind nicht Cloudformation unterstützt. As well it would be possible to create a DataSet AWS CDK Custom Construct with using CDK Custom Resource and https://docs.aws.amazon.com/quicksight/latest/APIReference/API_Operations.html to automate the creation of the DataSet. For now it will be created manually
# Ausblick
...

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>