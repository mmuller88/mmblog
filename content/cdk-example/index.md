---
title: AWS CDK Tutorial mit Travis Deployment
description: AWS CDK example mit Travis Deployment
show: 'no'
date: '2020-03-28'
image: 'docker.jpg'
tags: ['de', 'alfresco', '2020', 'ecm', 'docker', 'docker-compose', 'Amp', 'Jar']
engUrl: http://martinmueller.dev/cdk-example-eng
pruneLength: 50
---

Ahoi AWS'ler

[AWS CDK Examples](https://github.com/aws-samples/aws-cdk-examples)
[My CDK Example Repo](https://github.com/mmuller88/cdk-example)

# Das wird Benötigt
* AWS Account
* AWS CLI Credentials wie der AWS_ACCESS_KEY_ID und AWS_SECRET_ACCESS_KEY . Dafür erstelle ich normalerweise einen IAM User welcher Programmierzugriff auf den Account hat. AWS Doku URL
* Node muss auch installiert sein. Da es als Package manager und Build manager verwendet wird.

# Git Repo Vorbereiten
* Go to AWS CDK Examples repo and fork it
* Create a seconde Repo. Will be more easy to copy over examples
* Choose the right example. I recommend a TypeScript example as most of the examples there are in that language and in general TypeScript seems quite famous as language for CDK and Lambda
* Für mein Projekt habe ich das [Api Cors Lambda Crud DynamoDB](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb) example entschieden

# CDK manuell Deployen
* Alle Schritte zum deployen in der Readme.
...

# Travis Magic
* Will nicht wie vorher beschrieben immer manuell deployen müssen. Deshalb Travis nutzen
* .travis file erstellen. In meinen Repo sehen
* AWS environment variablen ermitteln
* AWS_ACCESS_KEY_ID, AWS_ACCOUNT_NUMBER, AWS_DEFAULT_REGION, AWS_SECRET_ACCESS_KEY, CDK_DEFAULT_ACCOUNT, CDK_DEFAULT_REGION
* Nächster Abschnitt wie automatisch testen.

# Stack Testing mit Postman
* Auch das Testen kann von Travis übernommen werden
* Postman eignet sich hervorragend zum erstellen von API Requests zu dem API Gateway. Sammlung von Requests wird Collection genannt.
* Würde den Umfang der Collection erstmal gering halten und nur das nötigste testen.
* Postman kann auch Responses evaluieren und z.B. Statuserwartungen testen. create Item Post sollte 201 returnen
* Postman hat eine CLI mit namen Newman welcher im Build installiert werden muss

# Zusammenfassung
* AWS noch recht neues CDK ist ein tolles Werkzeug zum erstellen von AWS Cloudformation Stacks. Sehr toll finde ich, dass man es in der gleichen Programmiersprache schreiben kann in der auch eventuell verwendete Lambdas sind. Kombiniert mit automatischen Deployment und Tests zum Beispiel mit Travis, erlaubt es schnell und effizient neue Änderungen am Stack durchzuführen. Ich glaube auch, dass es dadurch nicht oder weniger nötig ist Lambdas lokal testen zu müssen.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>