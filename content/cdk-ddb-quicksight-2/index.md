---
title: AWS DynamoDB Analysen mit QuickSight und AWS CDK - Zu große Tabellen
show: 'no'
date: '2021-04-17'
image: 'long-table.jpg'
tags: ['de', '2021', 'projen', 'cdk', 'aws', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/cdk-ddb-quicksight-2-eng
pruneLength: 50
---

Hi.

In meinem [letzten Blogpost](https://martinmueller.dev/cdk-ddb-quicksight) habe ich über spannende Arbeiten mit AWS Athena und AWS QuickSight berichtet. Wenn ihr Analysen von kleinen AWS DynamoDB Tabellen machen wollt, sollte alles reibungslos funktionieren. Mit klein meine ich eine relativ geringe Anzahl von Spalten in der Tabelle. 

Mir passierte es nämlich das bei der Verarbeitung der [TAKE2](https://www.take2.co/) Daten, dass benötigte Spalten für QuickSight garnicht angezeigt wurden. Nun ist die Anzahl der Spalten in den TAKE2 Daten mit mehr als 700 alles andere als klein! Wie ich das Problem gelöst habe und sogar mit AWS CDK in Code gießen konnte, erfahrt ihr in den nächsten Abschnitten.

# Lösung
Also nochmal kurz zusammengefasst. Die DynamoDB Tabelle ist viel zu groß und der Lambda [AthenaDynamoDBConnector](https://github.com/awslabs/aws-athena-query-federation/blob/master/athena-dynamodb) ist nicht mehr vernünftig in der Lage alle Spalten zu erkennen. Zum Glück haben die Programmierer des Connectors diesen Fall mitbedacht und eine Möglichkeit eingebaut gezielt Spalten mit deren Namen und Typen definieren zu können.

Die genauen Anweisungen stehen auch im [repo](https://github.com/awslabs/aws-athena-query-federation/tree/master/athena-dynamodb#setting-up-databases--tables-in-glue). Kurz gesagt muss eine AWS Glue Database erstellt werden. Der Connector kann dann anhand der dort definierten Spalten die gewünschten Spalten erkennen.
# AWS CDK
...

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>