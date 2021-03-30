---
title: AWS DynamoDB Analysen mit QuickSight
show: 'no'
date: '2021-04-01'
image: 'pipeline.png'
tags: ['de', '2021', 'projen', 'cdk', 'aws', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/cdk-appsync-eng
pruneLength: 50
---

Hi.

AWS DynamoDB ist eine extrem performante und skalierbare NoSQL Datenbank. Durch das fehlen eines Schemas können Daten, in DynamoDb Items genannt, extrem flexibel sein. Das erlaubt auch eine Art evolutionäre Weiterentwicklung der Items indem einfach neue Spalten angelegt werden können.

Das ganze hat aber einen Haken. Dadurch, dass wir uns nicht mehr in der Welt der relationalen Daten befinden, können wir keine relationalen Operationen mehr ausführen wie Joins. Nun fragst du dich warum sollte ich Joins ausführen können, die haben uns doch schon genervt bei den relationalen Datenbanken? Wir können Joins zum Beispiel bei Analysen gebrauchen. Ich versuche das zu erklären anhand von Analysen eines Shops:

Top X verkauften Produkte im Zeitraum von t1 bis t2 grouped by Geschlecht

In unserem Beispiel befinden sich die User und die verkauften Produkte jeweils in ihrer eigenen DynamoDB Tabelle und sind indirekt über eine userId verbunden. Denkbar wäre aber auch dass sich beide in der gleichen Tabelle, aber in unterschiedlichen Datensätzen bzw. Rows befinden. DynamoDB erlaubt keine Joins und somit können wir keine Beziehung zwischen verkauften Produkt und dem Geschlecht herstellen.

Die Lösung für das Problem ist AWS Athena, QuickSight, Lambda und S3. Mit einer Lambda können wir die DynamoDB Items als flache JSON File in ein S3 speichern und lassen Athena darauf zugreifen. QuickSight kann dann Athena als Datenengine benutzen um Joins, Analysen und Dashboards zu erstellen. Wie das alles geht erkläre ich in den nächsten Abschnitten.

# AWS DynamoDB
[AWS DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) ist eine gemanagte NoSQL Datenbank mit sehr guter Performance und Skalierung. Durch das managen der Datenbank von AWS entfällen aufwendige Administrative Aufgaben wie Installation oder Wartung. DynamoDB besitzt auch tolle Backup Features wie on demand oder Point-in-Time recovery. 

In DynamoDB müssen die eingefügten Daten keinem festdefiniertem Schema folgen wie in etwa bei relationen Datenbanken. Das ist super flexibel und sehr nützlich, kann aber auch zu Problemen wie Unübersichtlichkeit oder Inkonsistenzen bei den Spaltennamen führen. Von daher empfehle ich nur bestimmte Spalten in der Tabelle zuzulassen. Das kann z.B. erreicht werden durch eine Schemavaldierung im Api Gateway.

# AWS Athena
...
# AWS QuickSight
AWS QuickSight ist ein Service zum Erstellen und Analysieren von Visualisierungen der Kundendaten. Die Kundendaten können dabei in AWS Services liegen wie S3, RedShift oder wie in unserem Fall in DynamoDB. Zum Erstellen der Visualisierungen benutzt der Entwickler eine SQL ähnlich Query Language.

QuickSight kann zum jetzigen Zeitpunkt noch nicht direkt Daten von DynamoDB einlesen und es muss ein kleiner Zwischenschritt gemacht werden. Die DynamoDB Daten müssen in einem S3 Bucket z.B. als JSON exportiert werden. Dann kann QuickSight die sich im S3 befindenden Daten einlesen.

Um die Daten in den S3 Bucket zu schieben eignet sich der Ansatz eine AthenaDynamoDBConnector Lambda zu verwenden. Näheres darüber findest du im nächsten Abschnitt.

# AthenaDynamoDBConnector Lambda
* https://github.com/awslabs/aws-athena-query-federation/blob/master/athena-dynamodb/athena-dynamodb.yaml

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die z.B. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.

Mit AWS CDK kann ich einen hohen Automatisierungsgrad bei der Erstellung des DynamoDB QuickSight Deployment erreichen. Dabei werden die benötigten AWS Ressourcen und dessen Konfigurationen schön als Code definiert und dann einfach ausgeführt.

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