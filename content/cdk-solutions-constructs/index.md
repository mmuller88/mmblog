---
title: Infrastruktur Optimieren mit CDK Solutions Constructs Teil I.
show: 'no'
date: '2020-06-28'
image: 'cdkpattern.png'
tags: ['de', '2020', 'aws', 'lambda', 'cdk', 'github']
engUrl: https://martinmueller.dev/cdk-solutions-constructs-eng
pruneLength: 50
---

Ahoi AWS'ler

Kürzlich wurden die ersten [CDK Solution Constructs](https://github.com/awslabs/aws-solutions-constructs) released. Sie versprechen ein neues Abstraktionslevel für CDK Constructs indem sie oft genutzte Cloudformation Patterns in eigene CDK Constructs zusammenfassen. Zum Beispiel wenn ein API GateWay mit einem Lambdaproxy verwendet werden soll, kann dafür das [aws-apigateway-lambda Solution Construct](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-apigateway-lambda) verwendet werden.

Ein toller [AWS Blogpost](https://aws.amazon.com/blogs/aws/aws-solutions-constructs-a-library-of-architecture-patterns-for-the-aws-cdk/) demonstriert die Kombination zweier solcher Solution Constructs sehr gut. Weiterhin versprechen die CDK Solution Constructs sich am [well-architected Framework](https://aws.amazon.com/architecture/well-architected/) zu orientieren, um so zum Beispiel die fünf Pillars Operational Excellence, Security, Reliability, Performance Efficiency und Cost Optimization best möglichst mit in das CDK Deployment einzubeziehen. Das und die Einsparung an CDK Codezeilen hat mich dazu bewegt zu untersuchen ob mein [Alfresco Provisioner CDK Deployment](https://martinmueller.dev/alf-provisioner) von einigen CDK Solution Constructs profitieren könnten. In den nächsten Abschnitten beschreibe ich ein CDK Solution Pattern as ich erfolgreich in mein Deployment einbauen konnte.

# AWS DynamoDB Stream to Lambda 
Dieses Pattern, auch zu sehen in [Github](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-dynamodb-stream-lambda), beschreibt das oft verwendete Vorhaben eine DynamoDB Tabelle bei Änderungen in den Items mittels eines Streams ein Lambda aufzurufen um ggf. auf Änderungen wie Erstellen, Editieren oder Löschen reagieren zu können. Ein Beispiel dafür könnte sein, wenn das Item aus der Tabelle gelöscht wird, kann es woanders kostengünstiger persistiert werden.

In mein Deployment verwende ich es direkt um die EC2 instanzen gemäß der Wunschkonfiguration in der Tabelle abzubilden. Soll nun zum Beispiel die EC2 Instanz gestoppt wird nur noch **stopped** in die **expectedStatus** Spalte der Tabelle geschrieben. Soll die Instanz wieder gestartet werden reicht die Änderung auf **running**. Soll die Instanz komplett gelöscht werden, kann das Item einfach gelöscht werden und das gestreamte Lambda sorgt dafür, dass die Instanz gelöscht wird.

Meine vorherige Lösung sah dafür die alleinige Verwendung von StepFunction vor, aber Streams dafür zu benutzen ist wesentlich vorteilhafter und spart darüber hinaus viele Zeilen Code. Auch finde ich toll, dass das Pattern den Stream weg abstrahiert und ich mir nur noch Gedanken um die Tabelle und das Lambda machen muss.

# Zusammenfassung
Die CDK Solution Constructs sind tolle Pattern die die Erstellung der AWS Infrastruktur massiv vereinfacht und dabei sogar das well-architected Framework mitbeachtet. Nächste Woche will ich versuchen das nächste Pattern [Cloudfront S3](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-cloudfront-s3) zu integrieren. Seit gespannt!

Mit großer Spannung verfolge ich die Entwicklungen der CDK Solution Constructs. Habt ihr schon Erfahrungen gemacht mit CDK oder sogar schon mit den CDK Solution Constructs? Wenn ja für was? Falls ihr Fragen oder Anregungen habt, lasst es mich wissen.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>