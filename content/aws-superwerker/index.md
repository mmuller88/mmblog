---
title: AWS Initialisierung mit Superwerker 
show: "no"
date: "2022-04-29"
image: "title.png"
tags: ["de", "2022", "builder"] #nofeed
engUrl: https://martinmueller.dev/aws-builder-eng
pruneLength: 50 #du
---

* für mein project senjuns.com wollte ich einen neuen AWS Account mit vollem Setup einrichten also mit ControlTower, Landingpage, ...
* Ideale Gelegenheit mal Superwerker auszuprobieren
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

## Was ist Superwerker?

...

## Fazit

...

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
