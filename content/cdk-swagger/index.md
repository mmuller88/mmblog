---
title: AWS CDK Api Gateway mit Swagger
description: AWS CDK example mit Swagger für ein Api Gateway
date: '2020-04-04'
image: 'swagger.png'
tags: ['de', '2020', 'aws', 'swagger', 'cdk', 'cfd', 'github', 'travis']
engUrl: https://martinmueller.dev/cdk-swagger-eng
pruneLength: 50
---

Ahoi AWS'ler und Swagger Fans

Im letzten Post habe ich gezeigt wie [AWS CDK](https://martinmueller.dev/cdk-example) genutzt werden kann als willkommende Alternative zu YAML als Infrastruckturbeschreibung. Während der Weiterentwicklung des CDK Beispiels von [Api Cors Lambda Crud DynamoDB](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb) ist mir ein Problem beim Umgang mit Swagger Files begegnet. Aber erstmal will ich erklären was die Swagger Definition überhaupt ist. Auch sei gesagt, dass seit 2018 die neue Version von Swagger OpenApi heißt. Wenn man AWS API Gateway nutzt, ist es praktisch zur Parameter Validierung wie zum Beispiel dem Query, Path und den Body Parameter, Swagger Files zu verwenden. Was genau Swagger ist und wieso ich es so toll finde beschreibe ich im nächsten Absatz.

# Was ist Swagger
[Swagger](https://swagger.io/docs/specification/2-0/what-is-swagger/) ist eine YAML oder JSON Template Sprache zur Beschreibung von RESTful APIs. Folgend beschreibe ich was super an Swagger ist. Erstens eigenen sich die Templates extrem gut als Dokumentation über die API selber, da aus dem Template eine schick aussehende HTML UI generiert werden kann, welche die API Endpoints sehr gut beschreibt. Eine solche UI ist im Titelbild dieses Blogposts zu sehen. Noch genialer ist die UI kann direkt zum Testen der Endpoints genutzt werden, also zum Senden und Empfangen von Requests und Responses. Viele API Schnittstellen, wie es auch AWS API Gateway eine ist, bieten es and die Parameter Validierung der Requests über Swagger Files zu machen. Was mit Parametervalidierung gemeint ist versuche ich anhand des folgenden Beispiels zu erklären:

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

Auch cool ist, [Postman](https://www.postman.com/automated-testing) bietet eine Importierfunktion für Swagger Files. Dann wird daraus gleich eine Collections erzeugt. Das ist sehr praktisch, wenn man anfangen möchte die Requests in Postman zu schreiben.

# AWS Api Gatway mit Swagger
Die ganzen Features vom vorherigen Abschnitt klingen schon sehr verlockend oder? Wie toll das auch AWS API Gateway es anbietet, Swagger Files aus dessen Deployments zu [extrahieren](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-export-api.html) und zu importieren. Leider im Zusammenhang mit [AWS CDK](https://github.com/aws/aws-cdk), lassen sich extrahierte Swagger Files nicht so einfach wiederverwenden für dessen Beschreibung. Das größte Problem ist, dass wenn zum Beispiel ein Lambda geupdated wird, sich dan logischerweise auch dessen ARN ändert. Allerdings die vom API Gateway extrahierten Swagger Files verwenden genau diese ARNs wenn Lambda als Backendimplementierung für einen Endpoint benutzt wird. Und da sich die ARN ändert sind diese outdated im swagger file. Nachfolgend ist ein Swagger Snippet und dort sieht man die Arn über die ich spreche hinter dem **uri** keyword.

```YAML
paths:
  /items:
    get:
      responses:
        '200':
          description: Ok
          content: {}
        '401':
          description: Authorization information is missing or invalid
          content: {}
      x-amazon-apigateway-integration:
        uri: >-
          arn:aws:apigateway:[secure]:lambda:path/2015-03-31/functions/arn:aws:lambda:[secure]:[secure]:function:ApiLambdaCrudDynamoDBExam-getAllItemsFunction0B7A9-1KKCGIJ01C3NI/invocations
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
      parameters:
        - $ref: '#/parameters/alfUserIdParam'
      x-amazon-apigateway-request-validator: Validator
```

Das AWS CDK weiß über dieses Problem bescheid und es ist auf der Roadmap. So hoffentlich wenn du diesen Beitrag ließt ist der folgende Workaround nicht mehr notwendig. Zur Vollständigkeit liste ich hier die related Issues auf:

https://github.com/aws/aws-cdk/issues/723
https://github.com/aws/aws-cdk/issues/1461


# Workaround
Um des Problem zu lösen habe ich mein Travis so konfiguriert, dass CDK zweimal deployed wird. Beim ersten Deploy wird kein Swagger File benutzt und beim zweiten wird dann ein geniertes Swagger File verwendet. Wirklich interessant ist wie ich an das generierte Swagger File komme. Folgend versuche ich den Prozess zu beschreiben, aber bitte schaut auch in [meinem GitHub Repo](https://github.com/mmuller88/cdk-swagger) (dort in .travis) nach wie ich diesen Workaround implementiert habe.

1) Ich deploye oder Swagger File mit:

```
export WITH_SWAGGER='false' && cdk deploy --require-approval never
```

Aufpassen WITH_SWAGGER is eine env Variable im CDK Deployment File index.ts . Damit wird programmatisch keine Swagger File für das Deployment verwendet.

2) Nun kann ich mit der AWS CLI das Swagger File vom API Gateway extrahieren:

```
aws apigateway get-export --parameters extensions='integrations' --rest-api-id $REST_API_ID --stage-name prod --export-type swagger --accepts application/yaml tmp/swagger_new.yaml
```

Der generiert Swagger File tmp/swagger_new.yaml sieht dan in etwas so aus:

```YAML
swagger: '2.0'
info:
    version: '2020-03-29T16:59:22Z'
    title: Items Service
host: hjtiuj2ou1.execute-api.[secure].amazonaws.com
basePath: /prod
schemes:
    - https
paths:
    /items:
        get:
            responses:
                '200':
                description: Ok
                '401':
                description: Authorization information is missing or invalid
            x-amazon-apigateway-integration:
                uri: >-
                arn:aws:apigateway:[secure]:lambda:path/2015-03-31/functions/arn:aws:lambda:[secure]:[secure]:function:ApiLambdaCrudDynamoDBExam-getAllItemsFunction0B7A9-1MLKSKO1RUL3I/invocations
                passthroughBehavior: when_no_match
                httpMethod: POST
                type: aws_proxy
            x-amazon-apigateway-request-validator: Validator
        post:
    ...
```

3) Das sieht schon sehr gut aus. Allerdings fehlt jetzt noch die besagt Parameter Validierung. Dafür muss eine zweite Swagger definition erstellt werden templates/swagger_validations.yaml und sieht in etwas so aus:

```YAML
paths:
    /items:
        get:
        parameters:
            - name: alfUserId
            in: query
            required: false
            type: string
            $ref: '#/parameters/alfUserIdParam'
```

4) Was wir jetzt aber wollen ist ein merge beider swagger Files. NPM bietet ein nützliches Tool zum mergen von YAML Files:

```
npm i -g merge-yaml-cli
```

Die Swagger Definition tmp/swagger_full.yaml beinhaltet nun die aktuelle LambdaUri und die Parameter Validierung:

```YAML
swagger: '2.0'
info:
  version: '2020-03-29T16:59:22Z'
  title: Items Service
host: hjtiuj2ou1.execute-api.[secure].amazonaws.com
basePath: /prod
schemes:
  - https
paths:
  /items:
    get:
        parameters:
            - name: alfUserId
            in: query
            required: false
            type: string
            $ref: '#/parameters/alfUserIdParam'
        responses:
            '200':
            description: Ok
            '401':
            description: Authorization information is missing or invalid
        x-amazon-apigateway-integration:
            uri: >-
            arn:aws:apigateway:[secure]:lambda:path/2015-03-31/functions/arn:aws:lambda:[secure]:[secure]:function:ApiLambdaCrudDynamoDBExam-getAllItemsFunction0B7A9-1MLKSKO1RUL3I/invocations
            passthroughBehavior: when_no_match
            httpMethod: POST
            type: aws_proxy
        x-amazon-apigateway-request-validator: Validator
    post:
    ...
```

5) Nun kann dieses Swagger File im zweiten CDK Deployment angewendet werden:

```
export WITH_SWAGGER='true' && cdk deploy --require-approval never
```

Achtung!: Immer gut darauf aufpassen das auch ein neues Stage Deployment in AWS API Gateway kreiert wurde. Ich mache das in Travis mit der AWS CLI:

```
aws apigateway create-deployment --rest-api-id $REST_API_ID --stage-name prod
```

# Zusammenfassung
Swagger Definitions eigenen sich hervorragend zur Erstellung, Editierung, Dokumentation und Testung vom APIs wie der von AWS Api Gateway. Sie eigenen sich nicht nur direkt im Backend um dieses Backend zu erstellen, sondern sind nützlich sogar im Frontend da aus den Swagger Definitions Client Libaries generiert werden können und es dem Frontendentwickler gelingt durch die Swagger Dokumentations UI das Backend viel besser und in kürzerer Zeit zu verstehen.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>