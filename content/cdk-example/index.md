---
title: AWS CDK Tutorial mit Travis Deployment
description: AWS CDK example mit Travis Deployment
show: 'no'
date: '2020-03-28'
image: 'docker.jpg'
tags: ['de', '2020', 'aws', 'lambda', 'cdk', 'cfd']
engUrl: http://martinmueller.dev/cdk-example-eng
pruneLength: 50
---

Ahoi AWS'ler

Für ein privates Projekt habe ich mich in den letzten Tagen an ein AWS CDK Example rangetraut. AWS bietet eine Palette von tollen Beispielprojekten hier: [AWS CDK Examples](https://github.com/aws-samples/aws-cdk-examples) . Die Erfahrung war so gut, dass ich mich entschlossen habe, einen Blogpost zu darüber zu schreiben. Schon sehr früh in meiner AWS Karriere durfe ich mich mit CloudFormation beschäftigen. Es hat mir damals schon viel Spaß gemacht, allerdigns seit neuem scheint ja ein neues Kind im Block zu sein mit namen AWS CDK (Cloud Development Kit). Dieses Kit verspricht ein leichteres Handling der Cloudformation Templates, da man anstelle wie üblich diese im eher komplexen YAML schreiben muss, werden im CDK richtige Programmiersprachen wie Java, Python, JS oder Typescript unterstützt. Ich finde das ein super Idee da man, wenn man sich für z.B. Typescript als Sprache für die Lambdas entschieden hat, auch diese für das CDK verwenden kann.
Mein Beispiel Code ist natürlich hier [CDK Example Repo](https://github.com/mmuller88/cdk-example) einsehbar. In den nächsten Abschnitten werde ich kurz die einzelnen Schritte für die Repo Erstellung beschreiben.

# Das wird Benötigt
Klar wenn du AWS CDK ausprobieren möchtest, benötigst du einen AWS Account. Darüber hinaus brauchst du AWS CLI Credentials, welche es deiner Programmierumgebung erlauben Resourcen in deinem AWS Account zu nutzen. Üblicherweise erstellt man dafür einen [IAM User](https://docs.aws.amazon.com/de_de/IAM/latest/UserGuide/id_users_create.html#id_users_create_cliwpsapi). Wichtig dabei ist, dass du dir die Zugangscredentails also der die Access Key Id und der Secret Access Key gut abspeicherst. Diese werden nachher im Deploying benötigt.
Das verwendete AWS Beispiel verwendet NPM als Package Manager. Das bedeutet es kümmert sich um die Dependencies wie zum Beispiel dem aws-cdk welches mit dem folgenden command installiert wird:

```
npm install -g aws-cdk
```
NPM is [hier](https://nodejs.org/en/download/) erhältlich.

# Git Repo Vorbereiten
So nun geht es los. Zuerst erstellen wir unser GitHub Repository welches noch komplett leer ist. Bei mir habe ich es **cdk-example** genannt. Dann sollte das [AWS CDK Examples](https://github.com/aws-samples/aws-cdk-examples) Repo geforkt und local ausgecheckt sein. Mit dem Hintergrund, dass wir so einfacher Cherry Picking betreiben können und somit einfach die für uns interesannten Beispiele darin in unser Repository kopieren können.

Wenn man sich das AWS CDK Examples Repository anschaut hat man nun sprichwörtlich die Qual der Wahl. Ich selber für die Beispiele von der Typescript Kategorie empfehlen da sie reichlich sind und Typescript anscheinend immer beliebter wird als Programmiersprache. Auch empfehle ich mit dem [Api Cors Lambda Crud DynamoDB](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/api-cors-lambda-crud-dynamodb) Example anzufangen, da es schon sehr viele AWS Services beinhaltet wie API Gateway, Lambda und DynamoDB. Das Beispiel is ein einfacher CRUD Storage welches mit DynamoDB als DB fungiert. Am besten den bestehenden Quellcode nicht abändern und erstmal versuchen ihn nur zum Laufen zu bekommen. Ich selber hatte eine kleine Schwierigkeit. Das Beispiel hat eine missing Dependency. Undzware fehlt die uuid Library. Dafür muss ins src/ Verzeichnis gewechselt werden und die folgenden Command ausgeführt werden:

```
npm init
npm install uuid
```

Auch muss der Code etwas angepasst werden, da sich die uuid mit den Versionen etwas geändert hat. Alternativ kann auch einfach aus meinem [publizierten GitHub Repo](https://github.com/mmuller88/cdk-example) kopiert werden. Im nächsten Abschnitt bringen wir dann das Beispiel zum laufen.

# CDK Manuell Deployen
Im vorherigen Abschnitt haben wir das Repo soweit vorbereitet, jetzt wollen wir natürlich deployen! Da wir unser Deployment in AWS haben, muss sichergestellt werden, dass die Zugangscredentials richtig eingestellt sind. In der **Das wird Benötigt** haben wir bereits die Credentials erhalten. Es gibt verschiedene Möglichkeiten diese Credentials deinem Build zur Verfügung zu stellen. Das automatisierte Deployment in Travis funktioniert mit Environment Variablen. Für das manuelle Deployn ist es komfortabeler die Credentials im aws config folder zu erstellen.  dafür einfach die folgenden Datein einfügen:

~/.aws/conf und ~/.aws/credentials ebenfalls! Für Windows nutzer einfach deinen Benutzerordner anstelle der ~ benutzen. Mit folgenden Content befüllen:

```
[default]
aws_access_key_id = AKI...
aws_secret_access_key = fIr...
region = eu-west-2
```

Du solltest dir eine Region aussuchen welche dicht zu dir sind und viel Funktionalität anbieten. Da die Frankfurter Region oftmals hinterherhingt mit neuen Features, habe ich mich für die London Region eu-west-2 entschieden.

Jetzt ins Repo wechseln und die folgenden Befehle ausführen:

```
npm install -g aws-cdk
npm install
npm run build
```

Die npm install befehle laden die Dependencies. In der Regel müssen diese nur selten ausgeführt werden. Der Run Befehl hingegen immer wenn Änderungen durchgeführt worden sind. Interessante Tatsache ist, dass dieser die TypeScript Files in JavaScript Files konvertiert. Da TypeScript ein Superset vom JavaScript ist, spart man sich so zusätzlich Compiler arbeit.

Als nächstes muss CDK so konfiguriert werden, dass es weiß welcher Account und welche Region genutzt werden soll. Warum CDK das nicht aus dem AWS Folder generieren kann, verstehe ich allerdings auch nicht. Dann kann CDK deployed werden:

```
cdk bootstrab aws //{account}/{region}
cdk deploy
```

Auch interessant mit:

```
cdk synth > cfn.yaml
```

Kann man sich das generierte CloudFormation Template anschauen.

# Automation mmit Travis
Noch hält sicher der manuelle Aufwand für das Deployment gering, aber das könnte bei mehr werdender Komplexität sicher ändern. Von daher habe ich bisher super Erfahrungen gemacht, wenn ich so viel wie möglich davon automatisiere. Und nunja stellt euch mal vor wie cool es ist einfach nur mit einem Push zu master die Produktionsumgebung zu ändern. Einen kleinen Vorgeschmack wie das aussehen könnte beschreibe ich hier. Auch sei wieder gesagt, dass ihr euch meine Travis Pipeline gerne anschauen könnte hier [CDK Example Repo](https://github.com/mmuller88/cdk-example/blob/master/.travis.yml).

Was ich dort in Travis mache ist recht einfach erklärt. Ich führe einfach nur die manuellen Deployschritte von der vorherigen Sektion in Travis aus. Da Travis meine AWS Credentials in Form von Environmental Variables hat, erlaube ich es es in meinem AWS Account Ressourcen zu manipulieren. Die folgenden Environmental Variablen waren dafür nötig: AWS_ACCESS_KEY_ID, AWS_ACCOUNT_NUMBER, AWS_DEFAULT_REGION, AWS_SECRET_ACCESS_KEY, CDK_DEFAULT_ACCOUNT, CDK_DEFAULT_REGION .

Nur das Deployment nicht mehr manuell ausführen zu müssen, scheint auf den ersten Blick vielleicht nicht sehr nützlich, aber glaubt mir es lohnt sich! Nachdem das CDK Deployment fertig ist werden dann Postman Tests in Form von Requests und Response Validations ausgeführt. Näheres dazu beschreibe ich in der nächsten Sektion.

# Stack Testing mit Postman
Ich denke mittlerweile wissen die meisten über [Postman](https://www.postman.com/automated-testing) . Es ist ein geniales Tool zum testen von API (s die mittels Request und Responses arbeiten. In meinem Fall ist das ein REST API. In meinem GitHub repository habe ich eine kleine Sammlung von Requests und Response Tests, welches in Postman als Collections, bezeichnet werden, zusammengestellt. Diese können dann einfach mittels [Newman](https://github.com/postmanlabs/newman), welches ein CLI Tool ist zum ausführen von Postman erstellten Collections, ausgeführt werden. Newman muss dann natürlich auf der Build Maschine installiert sein. In meinem Repo mache ich das via NPM im package.json.

Der Kreative prozess des Collections schreiben sind dann so auch, dass man in Postman eine neue Collection erstellt und ein Request schreibt. Das Request läuft gegen die REST API und gibt ein Response zurück. Das Response kann dann validiert werden. Postman bietet für die Validierung der Responses eine Umfangreiche Möglichkeiten. So kann man einfach den Statuscode im Response mit dem erwarteten Wert abgleichen, andere Erwartungswerte vergleichen, Variablen erstellen für das nächste Request genutzt werden können und vieles vieles mehr. Ein Tip von mir, versucht die Menge an Testrequests gering zu halten.

# Zusammenfassung
* AWS noch recht neues CDK ist ein tolles Werkzeug zum erstellen von AWS Cloudformation Stacks. Sehr toll finde ich, dass man es in der gleichen Programmiersprache schreiben kann in der auch eventuell verwendete Lambdas sind. Kombiniert mit automatischen Deployment und Tests zum Beispiel mit Travis, erlaubt es schnell und effizient neue Änderungen am Stack durchzuführen. Ich glaube auch, dass es dadurch nicht oder weniger nötig ist Lambdas lokal testen zu müssen.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>