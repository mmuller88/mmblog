---
title: Asynchrone Kommunikation mit AWS CDK Eventbridge
show: 'no'
date: '2021-11-14'
image: 'bitbucket.jpg'
tags: ['de', '2021', 'eventbridge', 'aws', 'cdk', 'dynamodb', 'nofeed'] 
engUrl: https://martinmueller.dev/cdk-eventbridge
pruneLength: 50
---

Hallo CDK Fans

Für ein Startup soll ich eine Security Internet Scraping Plattform bauen. Der grobe Ablauf zur Benutzung der Plattform ist in etwa so. Der Kunde beantwortet ein paar Fragen und bekommt dann eine Security Auswertung angezeigt. Für den Prototypen habe ich mich entschieden AWS EventBridge zu benutzen um eine Entkopplung und asynchrone Verarbeitung der Services zu einander, zu gewährleisten.

Das war das erste mal, dass ich Eventbridge verwendet habe und ich bin sehr begeistert. Da es noch nicht all zu viel AWS CDK Eventbridge Material im Internet gibt, wollte ich dich gerne an meiner Experience teilhaben lassen.

Nachfolgend beschreibe ich die Security Plattform etwas genauer und wie meine Architektur aussieht.

## Security Plattform

Also wie bereits gesagt die Plattform ist ein Security Scraper. Der Nutzer kann mittels Desktop App oder Mobile App einige Fragen beantworten. Die Antworten werden im User-Service gespeichert und asynchron an den Scraping-Service geschickt. Ist die Verarbeitung im Scraping-Service fertig bekommt der Nutzer das Ergebnis präsentiert.

## Architektur

Für den Prototypen haben für uns für drei Module. Diese drei Module sind jeweils mit ihrem eigenen CDK Stack implementiert. Das ist das Frontend, der User-Service und der Scraping-Service.
### Frontend
* Questionnaire Frontend bestehend aus ReactTS S3 Webhosting sendet Daten via AppSync in eine DynamoDB Tabelle im User Service. Seit einigen Monaten benutze ich nun schon dieses setup mit ReactTS welches mittels Amplify und Appsync eine moderne CRUD alternative zu REST Apis bietet. [Appsync](https://martinmueller.dev/tags/appsync)

### User-Service
* Die DynamoDB Tabelle soll dann neue oder geänderter Einträge asynchron mittels Eventbridge an den Scraping Service senden. Der Scraping Service führt dann das Scraping aus, kreiert einen Report und sendet den Report zurück in eine DynamoDB Tabelle im User Service.
* Vom User Service aus, führen die Daten mittels GraphQL Subscription eine Update im Frontend aus

### Scraping-Service
...

## Zusammenfassung

...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>