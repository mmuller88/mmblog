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

In den letzten Wochen habe ich während meiner Freizeit an einem interessanten Projekt gearbeitet. Ich habe zwar noch nicht wirklich einen Namen gefunden aber es ist sowas wie der Alfresco Backend Provisioner. Damit kann jeder schnell und einfach Alfresco Backends für sich und seine Community erstellen. In den nächsten Abschnitten werde ich genauer von meiner Idee berichten sowie welche Technologien ich dafür verwendet habe.


# Zielgruppe
Da Alfresco eher auf große Kundschaft zielt, also große Gruppen wie Unternehmen mit mehreren hundert Angestellten, sehe ich einen klaren Bedarf bei den eher kleineren Gruppen bishin zu Einzelpersonen. Das ist ein eher Netflix oder Uber ähnlicher Ansatz bei dem günstige Services angeboten werden. Ich habe sogar genau einen passenden potentiellen Kunden in meiner Umgebung. Ich bin Mitglied in einer Kirchgemeinde. Nun würde sich gerne die Kirchgemeinde modernisieren auch hin in Richtung Digitalisierung. So werden zum Beispiel Videos von Gottesdienste einfach auf Youtube hochgeladen oder gemachte Bilder landen irgendwo in Dropbox. Das ist überhaupt nicht kollaborationsfreundlich und ich sehe die Alfresco Produkte in der Lage viele solcher Probleme lösen zu können. Mit sicherheit kennst auch auch du Vereine in deiner Umgebung die von Alfresco profitieren könnten.

Auch könnte das schnelle bereitstellten von Alfresco Backends Communites bei der zwingend erforderlichen Digitalisierung wärend der Coronakrise helfen. Es sollte sogut es geht vermieden werden Dokumente in echt von Person zu Person auszutauschen. Gerne würde ich meinen Beitrag leisten bei der Pandemie zu helfen und vielleicht ist der Alfresco Backend Provisioner ja eine Möglichkeit

 Herausvordernd wird dan natürlich den monatlichen Preis so gering wie möglich zu halten und die Kostenvorteile der Cloud so gut leveragen zu können wie möglich. Ein paar Ideen die ich diesbezüglich bereits habe und erforschen werde sind Reserved Instances, Spot Instances, S3 als Objektspeicher, Pay as you go für die Alfresco Instanzen.

# Verwendete Technologien
Selbst wenn der Alfresco Backend Provisioner nicht so erfolgreich wird wie ich es gerne hätte, macht das überhaupt nichts da ich im Zuge der Implementierung viele neue tolle und moderne Technologien erlernt habe. Ich versuche die verwendeten Technologien aufzuteilen in Backend, DevOps Pipeline und Frontend

## Backend
Die Alfresco Instanzen werden mit Hilfe von Docker Compose, welche ich mit dem [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) erstellt habe, betrieben. Diese laufen dann in AWS Ec2 Instanzen. Bis hierhin ist noch nix spannendes. Allerding mache ich diese Kreierung der Instanzen so dynamisch und flexible wie nur möglich. Ich habe nämlich ein AWS Api GateWay erstellt welches autonom in der Lage ist mittel API Requests vom Kunden, dies Ec2 Instanzen zu starten, stoppen und terminieren. 

Nachdem die Instanz gestartet ist, erhält der Kunde eine Url die ihm zum Alfresco Backend bringt. Hinter dem Api Gateway arbeiten außerdem noch eine vielzahl an Lambdas, Step Function, Dynamo DB Tables und S3 Buckets um diese zu ermöglichen. All das ist mit Infrastruktur als Code in AWS CDK verfasst. Als Programmiersprache für CDK und den Lambdas verwende ich TypeScript. TypeScript habe ich wärend dieses Projekts lieben gelernt und es ermöglicht mir ein sehr schnelles Entwickeln des Alfresco Backend Provisioner.

## DevOps Pipeline

## Frontend
* AWS CDK, Cloudformation, Lambdas, Step Functions for orchestrating, DynamoDB.
* Pipeline CDK + Travis
* Alfresco Docker Installer für Docker Compose Deployments. Plan regemäßiges Contributen.

# Wie funktionierts?
* Kunde äußert Wunsch via REST API und provisioner wird versuchen den Wunsch zu folgen. Ähnlich Kubernetes wo auch über Manifeste spezifiziert werden wie die Orchestrierung aussehen soll.

```JSON
{
	"alfUserId": "alfresco",
	"alfType": 1,
	"customName": "Alf Backend 1"
}
```

* AlfType Erklärung. Bisher nur
  - alfType 1: m4.xlarge 
  - alfType 2: m4.2xlarge
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