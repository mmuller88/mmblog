---
title: Mach die AWS prod Umgebung super mit Superwerker 
show: "no"
date: "2022-07-05"
image: "splash.jpeg"
tags: ["de", "2022", "aws"] #nofeed
engUrl: https://martinmueller.dev/aws-superwerker-eng
pruneLength: 50 #du
---

Hi Leute.

Ich will mein [senjuns project](github.com/senjuns/senjuns) production ready machen. Bisher hatte ich es nur in meinem developer AWS Account deployed. Mein developer Account hate kine AWS Services konfiguriert die für eine Vernünftige Produktionsumgebung benötigt werden. Das sind zum Beispiel AWS SSO, ControlTower, SecurityHub und noch einige mehr. Da kam das [Superwerker CFN Template](https://github.com/superwerker/superwerker) gerade recht. Dieses hat es mir ermöglicht einen neuen AWS Account mit vielen tollen AWS Services fur den Produktionsbetrieb zu konfigurieren. In den folgenden Abschnitten möchte ich gerne darauf eingehen was Superwerker genau ist und wie ich es verwendet habe.

## Was ist Superwerker?

[Superwerker](https://github.com/superwerker/superwerker) ist eine Open Source AWS CloudFormation Lösung welches die Einrichtung eines AWS Accounts erleichtert. Dabei folgt es best practices für Security und Effizienz. Entwickelt und Maintained wurde/wird das Projekt von AWS Advanced Partnern [kreuzwerker](https://github.com/superwerker/superwerker) und [superluminar](https://superluminar.io/). Es hat sogar seine eigene [Landingpage](superwerker.cloud)[https://superwerker.cloud/] mit tollen Inhalten wie einem kurzen Video und mehr. Kaum zu glauben, dass dies ein kostenloses Produkt ist.

Das Superwerker Deployment hat eine Menge von coolen Features die alle sehr gut in den Docs [hier](https://github.com/superwerker/superwerker/tree/main/docs/adrs) erklärt sind. Sehr gut finde ich, dass es zum Beschreiben der einzelnen Features [Architectural Decision Records](https://adr.github.io/) verwendet. Nachfolgend erkläre ich die Features mit eigenen Worten.

### Backup

[Backup](https://github.com/superwerker/superwerker/blob/main/docs/adrs/backup.md) aktiviert den AWS Backup Service und per default wird jeden Tag ein Backup erzeugt. Dabei werden Backups erzeugt von Datenbanken die auch von AWS Backup unterstützt werden.

### Budget

[Budget](https://github.com/superwerker/superwerker/blob/main/docs/adrs/budget.md) hilft die Kosten in AWS zu überschauen und gibt rechtzeitig eine Warnung falls mehr Kosten als üblich anfallen. Das macht es dadurch, dass der Mittelwert der letzten drei Monate berechnet wird und falls dieser überschritten wird, kommt eine Warnung. Eine echt coole Idee finde ich.

### Control Tower

[Control Tower](https://github.com/superwerker/superwerker/blob/main/docs/adrs/control-tower.md) vereinfacht das Verwalten von mehreren AWS Accounts mit AWS SSO. Für mich ist das der Hauptgrund warum ich Superwerker verwende. Somit kann ich sehr einfach auf meine verschiedenen AWS Accounts wie build, dev und prod zugreifen. Sehr toll finde ich auch, dass ich mit AWS SSO einfach die AWS Account credentials kopieren und für die AWS CLI verwenden kann.

### GuardDuty

[GuardDuty](https://github.com/superwerker/superwerker/blob/main/docs/adrs/guardduty.md) ist ein AWS Service zum finden von möglichen Security Gefahren.

### Living Documentation

[Living Documentation](https://github.com/superwerker/superwerker/blob/main/docs/adrs/living-documentation.md) ist ein ziemlich cooles Feature welches eine Documentation via AWS CloudWatch Dashboard erzeugt. Diese gibt dann Informationen über zum Beispiel wie ein SSO setup mit externen Identity Providern wie Google gemacht werden kann und noch vieles mehr. Extrem cool ist wie sich diese Documentation auch selber updated wenn bereits gewisse Konfigurationen vorgenommen wurden. Deswegen heißt es ja auch Living Documentation.

### Notifications

Superwerker erstellt OpsItems in OpsCenter wenn wenn Emails vom der RootMail Feature versendet werden. Mit dem [Notifications](https://github.com/superwerker/superwerker/blob/main/docs/adrs/notifications.md) Feature werden dann Emails an die spezifizierte Adressen versendet. Somit muss der User sich nicht manuell in die AWS Console einloggen und OpsCenter überprüfen. Durch die Email hat man somit auch eine zentralisierte Sammelstelle für mehrere Accounts.

### RootMail

[RootMail](https://github.com/superwerker/superwerker/blob/main/docs/adrs/rootmail.md) erstellt die uniformierten Email Adressen für die vom Control Tower erstellten Accounts audit und log archive. Dafür wird eine eigene Hosted Zone zum Beispiel aws.mycompany.test mit Route53 angelegt und die benötigten Einstellungen mit AWS SES zum Erhalt der Emails vorgenommen.

### Security Hub

Das [Security Hub](https://github.com/superwerker/superwerker/blob/main/docs/adrs/securityhub.md) Feature aktiviert AWS Security Hub für alle Accounts. Der User muss sich in den Audit Account einloggen um die aggregierte Security Hub View zu betrachten.

Im nächsten Abschnitt möchte ich gerne mehr über meine Experience mit Superwerker berichten.

## Superwerker Experience

Die Anweisungen zum Ausführen von Superwerker findest du [hier](https://superwerker.awsworkshop.io/). Für mich ging die Installation recht reibungslos. Eine Ausnahme stellte aber der [RootMail](https://github.com/superwerker/superwerker/blob/main/docs/adrs/rootmail.md) Nested Stack da. Ich hatte zuvor meine Domaine senjuns.com und die dazugehörige Hosted Zone aus einem anderen AWS Account importiert. Allerdings habe ich die Name Server von der Domaine nicht ordnungsgemäß in der dafür vorgesehenen Hosted Zone konfiguriert. Durch debuggen der Superwerker Lambdas ist mir dieser Fehler aufgefallen.

Falls du also auch die folgenden Error logs in der RootMailReady Lambda bekommst, musst du einfach mal überprüfen ob du deine Domaine und die Hosted Zone richtig konfiguriert hast.

```json
{
    "level": "info",
    "msg": "verification not yet successful",
    "res": {
        "VerificationAttributes": {
            "aws.senjuns.com": {
                "VerificationStatus": "Pending",
    ...
```

```json
{
    "level": "info",
    "msg": "DKIM verification not yet successful",
    "res": {
        "DkimAttributes": {
            "aws.senjuns.com": {
                "DkimEnabled": true,
                "DkimVerificationStatus": "Pending",
    ...
```

Falls jemand auf ein gleiches oder ähnliches Problem stoßen sollte, habe ich ein Pull Request mit Troubleshooting Informationen erstellt.

## Fazit

Superwerker is ein tolles CloudFormation QuickStart um eine AWS Produktionsumgebung professionell und einfach aufzusetzen. Viele Verbesserungen und neue Features sind bereits im [Superwerker Backlog](https://github.com/superwerker/superwerker/issues) geplant. Die Superwerker Community sucht noch nach tatkräftiger Unterstützung beim Implementieren von neuen Feature und Verbesserungen. Ich bin schon sehr gespannt das Superwerker Deployment weiterhin in meinem aktuellen Projekt und in meinen zukünftigen Projekten zu verwenden. Vielen Dank dass du dir meinen Artikel durchgelesen hast. Falls du noch Fragen hast, kannst du mir gerne schreiben.

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
