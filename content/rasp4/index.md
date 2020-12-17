---
title: Raspberry 4 automatisiert fernsteuern mit CDK Pipeline
show: 'no'
date: '2020-12-27'
image: 'alps.png'
tags: ['de', '2020', 'aws', 'raspberry', 'cdk', 'nofeed']
engUrl: https://martinmueller.dev/rasp4-eng
pruneLength: 50
---

Hi Raspberry Freunde.

* Arbeite an IOT Projekt zum auslesen Gaszähler, Orten Bluetoot und vieles mehr
* Raspberry 4 mit 4GB gekauf an Cyber Monday gekauft.
* Will Deployments auf dem Raspberry zu hohem grade automatisierten. Sprich Docker, Docker Compose, AWS CodeDeploy Agent, AWS CodePipeline mit CDK Pipeline.
* push nach master updated und deployed docker compose deployment auf Raspberry
* keine two way Kommunikation meines Raspberries. CodeDeploy Agent pullt regelmäßig das github repo

# Setup
* Raspberry 4 mit 4GB. 64GB microSSD
* Ubuntu 20.04.1 Server also keine Benutzeroberfläche

## Raspberry Installation
* ssd Karte mit Ubuntu bespielt URL
* wifi konfigurierte
* Remoteverbindung über ssh --> keine extra Tastatur oder Monitor benötigt. Extrem geil!

## Installation der Umgebung
* benötige viele Programme wie Docker, Docker Compose, Git, AWS CLI, AWS CodeDeploy Agent und viele mehr --> init.sh mit sudo Rechten ausführen

# Was hat besonders Spaß gemacht?
* Raspberry sehr einfach bespielbar mit Ubuntu. Errinert mich stark an Docker Container nur ein wenig langsamer. init.sh

# Schwierigkeiten
* Das regelmäßige pullen des Agenten hat fehlgeschlaten. Bin mir nicht 100% sicher aber das Problem wurde warscheinlich dadurch gelößt das aich aws cli version 1 anstatt version 2 installiert habe also mit sudo apt install awscli welches Version 1 installiert

# Ausblick
* Docker Compose deployment zum Laufen zu bekommen
* Secrets wie Grafana Password aus AWS SSM laden
* IOT Red Node einrichten zum auslesen des Gas Zählers

# Zusammenfassung
Wenn euch auch das ALPS Thema interessiert, schreibt mir doch. Mit der [ALPS Community](alps.io) veranstalten wir regelmäßig Community Treffen online aus aller Welt. Dort trefft ihr spannende Leute und könnt euch einbringen wenn ihr wollt :).

Ich arbeite bereits an einer aufgefrischten Library zur Konvertierung der ALPS Spec zu den lower abstracted APIs [hier](https://github.com/mmuller88/alps-unified-ts). Damit wird es dann noch einfacher sein ALPS unified als Library in deinem Code zu benutzen:


Darüber hinaus soll die Library in JavaScript, TypeScript, Python, Java und .NET funktioniert und über öffentliche Registries erhältlicht sein. Mehr darüber kommt in einem separatem Blogpost. Bis dahin stay tuned!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>