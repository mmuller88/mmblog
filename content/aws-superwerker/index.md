---
title: AWS Initialisierung mit Superwerker 
show: "no"
date: "2022-07-01"
image: "splash.jpeg"
tags: ["de", "2022", "aws", "nofeed"] #nofeed
engUrl: https://martinmueller.dev/aws-superwerker-eng
pruneLength: 50 #du
---

Hi Leute.

Seit längerem wollte ich mein [senjuns project](github.com/senjuns/senjuns) auf stabilere Beine stellen. Bisher hatte ich es nur in meinem AWS ausprobiert alten developer Account ohne die Verwendung von zum Beispiel einer AWS SSO, ControlTower, SecurityHub und noch vielem mehr. Da kam das [Superwerker CFN Template](https://github.com/superwerker/superwerker) gerade recht. Dieses hat es mir ermöglicht einen neuen Account mit vielen tollen AWS Services zu konfigurieren. In den folgenden Abschnitten möchte ich gerne darauf eingehen was Superwerker genau ist und wie ich es verwendet habe.

## Was ist Superwerker?

[Superwerker](https://github.com/superwerker/superwerker) ist eine Open Source AWS CloudFormation Lösung welches die Einrichtung eines AWS Accounts erleichtert. Dabei folgt es best practices für Security und Effizienz. Entwickelt und Maintained wurde/wird das Projekt von AWS Advanced Partnern [kreuzwerker](https://github.com/superwerker/superwerker) und [superluminar](https://superluminar.io/). Es hat sogar seine eigene Landingpage (superwerker.cloud)[https://superwerker.cloud/] mit tollen Inhalten wie einem kurzen Video und mehr. Kaum zu glauben, dass dies ein kostenloses Produkt ist. Im nächsten Abschnitt möchte ich gerne mehr über meine Experience mit Superwerker berichten.

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

Falls jemand auf ein gleiches oder ähnliches Problem stoßen sollte, habe ich ei

## Fazit

Superwerker is ein tolles CloudFormation QuickStart um eine AWS Produktionsumgebung professionell und einfach aufzusetzen. Ich bin schon sehr gespannt das Superwerker Deployment weiterhin in meinem aktuellen Projekt und in meinen zukünftigen Projekten zu verwenden. Vielen Dank dass du dir meinen Artikel durchgelesen hast. Falls du noch Fragen hast, kannst du mir gerne schreiben.

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
