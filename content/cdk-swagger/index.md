---
title: AWS CDK Api Gateway mit Swagger
description: AWS CDK example mit Swagger für ein Api Gateway
show: 'no'
date: '2020-04-03'
image: 'swagger.png'
tags: ['de', '2020', 'aws', 'swagger', 'cdk', 'cfd', 'github', 'travis']
# engUrl: https://martinmueller.dev/cdk-example-eng
pruneLength: 50
---

Ahoi AWS'ler

Im letzten Post habe ich gezeigt wie [AWS CDK](https://martinmueller.dev/cdk-example) genutzt werden kann als willkommende Alternative zu YAML zur Infrastruckturbeschreibung. Während der Weiterentwicklung des CDK Beispiels von [Api Cors Lambda Crud DynamoDB](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb) ist mir ein schwieriges Problem begegnet. Wenn man AWS API Gateway nutzt, ist es praktisch zur Parameter Validierung wie zum Beispiel Query, Path Parameters in der URL oder gar Parameters im Body, Swagger Files zu verwenden. Was genau Swagger ist und wieso ich es so toll finde beschreibe ich im nächsten Absatz.

# Was ist Swagger
[Swagger](https://swagger.io/docs/specification/2-0/what-is-swagger/) ist eine YAML oder JSON Template Sprache zur Beschreibung von RESTful APIs . Folgend beschreibe ich was so super an Swagger ist. Erstens eigenen sich die Templates extrem gut als Dokumentation über die API selber, da aus dem Template eine gut aussehende HTML UI generiert werden kann, welche die API Endpoints sehr gut beschreibt. Eine solche UI ist im Titelbild dieses Blogposts zu sehen. Noch genialer ist die UI kann direkt zum Testen der Endpoints genutzt werden, also zum Senden und Empfangen von Requests und Responses. Viele API Schnittstellen, wie es auch AWS API Gateway eine ist, bieten es and die Parameter Validierung der Requests über Swagger Files zu machen. Was mit Parametervalidierung gemeint ist versuche ich anhand des folgenden Beispiels zu erklären:

```
parameters:
    - in: query
    name: userId
    description: Get items of that user
    required: true
    type: string
```

Hier ist ein Parameter vom Typ Query zu sehen sehen. Das bedeutet dieser würde in der URL in etwa so aussehen
```
http://<url>/items?userId=martin
```
Mit der Parametervalidierung kann ich dann bestimmte Eigenschaften des Parameters definieren, wie hier der name **userId** ob er required ist und welchen Typ der value haben soll, in unserem Fall als vom typ string.

Auch sehr mächtig ist die Eigenschaft, dass es möglich ist aus Swagger Files [Client Libaries zu generieren](https://swagger.io/tools/swagger-codegen/). Alfresco macht das zum Beispiel mit dem [API-Explorer](https://api-explorer.alfresco.com/api-explorer/) (Näheres auf [GitHub Api-Explorer](https://github.com/Alfresco/rest-api-explorer)) und [ADF](https://www.alfresco.com/abn/adf/) (oder [ADF JS Github](https://github.com/Alfresco/alfresco-js-api)). Dort wird zum Beispiel aus dem [Swagger File](https://github.com/Alfresco/rest-api-explorer/blob/master/src/main/webapp/definitions/alfresco-core.yaml) die eine JavaScript API Library erzeugt, welche als Wrapper für die API Requests genutzt werden kann und auch wird in [ADF Components Github](https://github.com/Alfresco/alfresco-ng2-components).

# AWS Api Gatway mit Swagger
Die ganzen Features vom vorherigen Abschnitt klingen schon sehr verlockend oder? Wie toll das auch AWS API Gateway is anbietet Swagger Files aus dessen Deployments zu [extrahiere](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-export-api.html) und zu importieren. Leider im Zusammenhang mit [AWS CDK](https://github.com/aws/aws-cdk), lassen sich extrahierte Swagger Files nicht so einfach wiedervewenden für dessen Beschreibung. Das größte Problem ist, dass wenn zum Beispiel ein Lambda geupdated wird, sich dan logischerweise auch dessen ARN verändert. Allerdings die vom API Gateway extrahierten Swagger Files verwenden genau diese ARNs wenn Lambda als Backendimplementierung für einen Endpoint benutzt wird. Und da sich die ARN ändert kann das nicht reflektiert werden rechtzeitig im CDK Deployment.

# Workaround
* zwei mal CDK deploy

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>