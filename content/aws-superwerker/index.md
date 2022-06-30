---
title: AWS Initialisierung mit Superwerker 
show: "no"
date: "2022-04-29"
image: "title.png"
tags: ["de", "2022", "builder"] #nofeed
engUrl: https://martinmueller.dev/aws-builder-eng
pruneLength: 50 #du
---

Hi Leute.

Seit längerem wollte ich mein [senjuns project](github.com/senjuns/senjuns) auf stabilere Beine stellen. Bisher hatte ich es nur in meinem AWS Ausprobier Account ohne die Verwendung von zum Beispiel einer Landingpage, ControlTower, SecurityHub und noch vielem mehr. Da kam das [Superwerker CFN Template](https://github.com/superwerker/superwerker) gerade recht. Dieses hat es mir ermöglicht einen neuen Account mit vielen tollen AWS Services zu erstellen. In den folgenden Abschnitten möchte ich gerne darauf eingehen was Superwerker genau ist und wie ich es dann verwendet habe.

## Was ist Superwerker?

[Superwerker](https://github.com/superwerker/superwerker) ist eine Open Source AWS CloudFormation Lösung welches die Einrichtung eines AWS Accounts erleichtert. Dabei folgt es best practices für Security und Effizienz. Entwickelt und Maintained wurde/wird das Projekt von AWS Advanced Partnern [kreuzwerker](https://github.com/superwerker/superwerker) und [superluminar](https://superluminar.io/). Es hat sogar seine eigene Landingpage (superwerker.cloud)[https://superwerker.cloud/] mit tollen Inhalten wie einem kurzen Video und mehr. Kaum zu glauben, dass dies ein kostenloses Produkt ist. Im nächsten Abschnitt möchte ich gerne mehr über meine Experience mit Superwerker berichten.

## Superwerker Experience

* Anweisung ist hier ... zu finden. Sollten genau befolgt werden.
* Hatte ein paar Probleme da ich meine domain senjuns.com und die Hosted Zone nicht vernünftig von dem alten AWS Account migriert habe.
* Dann lief Superwerker durch
* Troubleshoot hinzugefügt
* [Migrating a hosted zone to a different AWS account](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-migrating.html)

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


## Fazit

Superwerker is ein tolles CloudFormation QuickStart um eine AWS Produktionsumgebung professionell und einfach aufzusetzen. Ich bin schon sehr gespannt das Superwerker Deployment weiterhin in meinem aktuellen Projekt und in meinen zukünftigen Projekten zu verwenden. Vielen Dank dass du dir meinen Artikel durchgelesen hast. Falls du noch Fragen hast, kannst du mir gerne schreiben.

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
