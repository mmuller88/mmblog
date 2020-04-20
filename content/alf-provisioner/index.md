---
title: Der Alfresco Backend Provisioner
show: 'no'
description: Über die Closed Beta meines CDK Backends
date: '2020-04-25'
image: 'prov.png'
tags: ['de', '2020', 'acs', 'aps', 'docker', 'docker-compose', 'ec2']
engUrl: https://martinmueller.dev/alf-provisioner-eng
pruneLength: 50
---

Hi Alfrescans.

* Gute 4 Wochen her dass ich angefangen habe den Alfresco Backend Provisioner zu implementieren
* Damit kann jeder schnell und einfach Alfresco Backends für sich und seinte community erstellen


# Zielgruppe
* Zielgruppe sind kleine Communities wie Vereine. 
* Aktuell Corona. Könnte helfen bei Digitalisierung.
* Konkretes Beispiel Kirchgemeide

# Verwendete Technologies
* AWS CDK, Cloudformation, Lambdas, Step Functions for orchestrating, DynamoDB.
* Pipeline CDK + Travis

# Wie funktionierts?
* Kunde äußert Wunsch via REST API und provisioner wird versuchen den Wunsch zu folgen. Ähnlich Kubernetes wo auch über Manifeste spezifiziert werden wie die Orchestrierung aussehen soll.

```JSON
{
	"alfUserId": "alfresco",
	"alfType": 1,
	"customName": "Alf Backend 1"
}
```
* Graphische UI kommt noch

# Closed Beta
* Suche feedback
* Bei Intresse bitte melden

# Geplante Features
* User kann Instanz stoppen und starten
* Einfach upgraden zu nem anderen alfType
* Automated Backup capabilities
* Free Tier
* SSL using Let's Encrypt
* APS, ACS Enterprise builds
* Onboarding Layer For ACA

# Zusammenfassung
Der Alfresco Provisioner

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>