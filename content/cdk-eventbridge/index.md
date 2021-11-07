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

* Neuer Kunde mit einem spannenden internet Scraping Projekt
* Antworten zu fragen werden erfasst und dann asynchron mittels Eventbridge an einen Verarbeitungsstack geschickt. Zurzeit nur ein Lambda. Wird komplexer werden.
* Focus hier auf AWS Eventbridge und wie ich damit Events von DynamoDB nach Lambda schicke und wieder zurückt zu DynamoDB wenn die Verarbeitung fertig ist
* Habe bisher kaum AWS Eventbridge in diesem Use case gesehen und vor allem nicht in AWS CDK.

# Setup
* Questionnaire Frontend bestehend aus ReactTS S3 Webhosting sendet Daten via AppSync in eine DynamoDB Tabelle im User Service. Seit einigen Monaten benutze ich nun schon dieses setup mit ReactTS welches mittels Amplify und Appsync eine moderne CRUD alternative zu REST Apis bietet. [Appsync](https://martinmueller.dev/tags/appsync)
* Die DynamoDB Tabelle soll dann neue oder geänderter Einträge asynchron mittels Eventbridge an den Scraping Service senden. Der Scraping Service führt dann das Scraping aus, kreiert einen Report und sendet den Report zurück in eine DynamoDB Tabelle im User Service.
* Vom User Service aus, führen die Daten mittels GraphQL Subscription eine Update im Frontend aus

## Zusammenfassung

...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>