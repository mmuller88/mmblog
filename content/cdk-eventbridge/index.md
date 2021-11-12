---
title: Asynchrone Kommunikation mit AWS CDK Eventbridge
show: 'no'
date: '2021-11-14'
image: 'dia.png'
tags: ['de', '2021', 'eventbridge', 'aws', 'cdk', 'dynamodb', 'nofeed'] 
engUrl: https://martinmueller.dev/cdk-eventbridge
pruneLength: 50
---

Hallo CDK Fans

Für ein Startup soll ich eine Security Plattform bauen. Der grobe Ablauf zur Benutzung der Plattform ist in etwa so. Der Kunde beantwortet ein paar Fragen und bekommt dann eine Security Auswertung angezeigt. Für den Prototypen habe ich mich entschieden AWS EventBridge zu benutzen. Damit erreiche ich eine Entkopplung und asynchrone Verarbeitung der Services zu einander, zu gewährleisten.

Das war das erste mal, dass ich Eventbridge verwendet habe und ich bin sehr begeistert. Da es noch nicht all zu viel AWS CDK Eventbridge Material im Internet gibt, wollte ich dich gerne an meiner Experience teilhaben lassen.

Nachfolgend beschreibe ich die Security Plattform etwas genauer und wie meine Architektur aussieht.

## Security Plattform

Also wie bereits gesagt die Plattform ist ein Security Scraper. Der Nutzer kann mittels Desktop App oder Mobile App einige Fragen beantworten. Die Antworten werden im User-Service gespeichert und asynchron an den Security-Service geschickt. Ist die Verarbeitung im Security-Service fertig, bekommt der Nutzer das Ergebnis als Report präsentiert.

## Architektur

Der Prototyp hat drei Module. Diese drei Module sind jeweils mit ihrem eigenen CDK Stack implementiert. Das ist das Frontend, der User-Service und der Security-Service.

### Frontend

Das Frontend ist eine ReactTS App welches in S3 via static Webhosting gehosted wird. Die App nutzt Amplify Libaries zum Usermanagement wie Sign up, Password wiederherstellen, Login, Logout. Auch nutze ich Amplifies GraphQl Libaries als typisierten Zugriff auf das AppSync im User-Service. Schau auch gerne in meine anderen Beiträge über [Appsync](https://martinmueller.dev/tags/appsync) rein.

Der Nutzer soll nach dem Einloggen eine Reihe von Security Fragen beantworten. Die Antworten werden über GraphQL Queries an den User-Service geleitet. Darüber hinaus besitzt das Frontend noch eine Liste von Security Reports welche von dem Security-Service erstellt wurde.

### User-Service

Die Antworten werden nun im AppSync verarbeitet und in eine Antworten DynamoDB Tabelle gespeichert. Von dort aus lauscht eine DynamoDB Stream Lambda auf neue oder geänderte Antworten. Die Lambda schreibt dann die Antwort in den Eventbridge Eventbus. Der Eventbus leitet die Antwort als Event **AntwortEvent** weiter an den Security-Service.

Nachdem der Security-Service das AntwortEvent verarbeitet hat sendet dieser ein **ReportEvent** an den User-Service via den Eventbus zurück. Eine Report Lambda im User-Service erhält dann das ReportEvent und schreibt den Report via GraphQL Mutation in eine Report DynamoDB Tabelle.

Das Frontend besitzt eine GraphQl Subscription für neu erscheinende Reports und somit wird die Liste der Reports automatisch geupdated sofern ein neuer Report gespeichert wird.

### Security-Service

Der Security-Service erhält ein AntwortEvent vom User-Service mittels Eventbus von EventBridge. Das AntwortEvent ist ein Wrapper und enthält neben der Antwort selbst noch Eventdaten wie Created, Updated, Status. Eine Report Lambda empfängt dann die Antwort und verarbeitet diese zu einem Report. Anschließend wird der Report in ein ReportEvent gepackt und zurück an den User-Service gesendet.

Noch reicht es für die Erstellung des Reports eine Lambda zu verwenden. Das könnte sich in Zukunft aber auch ändern da der Report komplexer werden soll und z.B. auch third party APIs verwenden soll. Dann könnte ein etwas komplexerer Workflow anstehen. Mit der Verwendung dieser Eventarchitektur sollte das aber kein Problem werden.

## Zusammenfassung

Services asynchrom miteinander kommunizieren zu lassen ist mega toll und aufregend. Mit AWS Eventbridge und AWS CDK ist es zusäzlich noch eine wundervolle Developer Experience. Ich bin sehr gespannt wo sich die Security Plattform noch hinentwickelt :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>