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

Seit kurzem darf ich mich Besitzer eines Raspberries nennen. Am Cyber Monday habe ich mir einen Raspberry 4 mit 4GB gekauft. Ein guter Freund von mir, der viel Erfahrung in sachen Home IOT (Internet of Things) hat, zeigte mir was so alles möglich ist. Ich habe schon vorher Erfahrungen mit Home IOT gesammelt und diese in einem [Blogpost zusammengefasst](https://martinmueller.dev/smart-home-de) zusammengefasst. Allerdings waren diese Erfahrungen an fertige IOT Lösungen gebunden und geben daher nur einen limitierten Funktionsumfang.

Ich wollte aus auf das nächste Level und mit Hilfe von MQTT und NodeRED coole Home IOT Lösungen finden. Meiner erster Use Case ist, dass ich den Gaszähler auslesen möchte. Im Internet fand ich eine Anleitung wie man meinen Gaszähler, digital unterstützt, auslesen kann [BK-G4](https://forum.iobroker.net/topic/27960/gasz%C3%A4hler-bk-g4-auslesen-mit-zigbee-fensterkontakt). Diese Lösung verlangte aber ein komplexes NodeRED Deployment mit der Verwendung eines Raspberries.

Der Raspberry kann wie ein stinknormale VM behandelt werden. Das heißt er wird mit einem Betriebsystem wie Ubuntu bespielt. Dann werden erforderliche Programme installiert und anschließend wird das NodeRED Deployment ausgeführt. Bei Bedarf kann die VM einfach weggeschmissen werden und alles nochmal ausgeführt werden. Das sind viele manuelle Schritte die sehr zeitaufwendig und fehleranfällig sein können.

Von daher habe ich mich entschlossen das gesamt Deployment zu einem hohen Grade zu automatisieren mit der Verwendung folgender Technologien GitHub, Docker, Docker Compose, AWS CodeDeploy Agent, AWS CodePipeline mit CDK Pipeline. Prinzipiell muss dann nur noch ein push zum main branch gemacht werden und das gesamte Docker Deployment baut und startet sich von allein.

Wie das alles geht beschreibe ich in den nächsten Abschnitten.
* keine two way Kommunikation meines Raspberries. CodeDeploy Agent pullt regelmäßig das github repo

# Setup

Zunächst möchte ich aber gerne mein Setup beschreiben. Wie Eingangs schon erwähnt, habe ich mir zum Cyber-Monday einen Raspberry 4 (kurz Rasp4) mit 4GB gekauft. Desweiteren gab es in dem Set noch eine 64GB microSSD.

Die Installation von Ubuntu 20.04.1 war sehr einfach und ist sehr gut Dokumentiert auf https://ubuntu.com/download/raspberry-pi . Ich habe mich für den Ubuntu Server entschieden, da ich den Rasp4 als headless remote VM benutzen möchte.

* docker compose als deployment
* optional: zigbee sensor

## Installation der Umgebung

Die IOT Programme sollen mittels Docker Compose laufen und aus meinem [GitHub Repo](https://github.com/mmuller88/rasp4) soll die Docker Compose YAML file bereitgestellt werden. Desweiteren soll das Docker Compose Deployment automatisch rebuilded und redeployed werden sobald sich was auf den master Branch gepusht wird.

Um das alles zu ermöglichen werden viele Programme wie Docker, Docker Compose, Git, AWS CLI, AWS CodeDeploy Agent usw, benötigt. Um die Installation der benötigten Programme zu vereinfachen habe ich ein Script ./mis/init.sh erstellt. Dieses wird dann einfach auf dem Rasp4 ausgeführt:

```
sudo chmod +x ./init.sh
./init.sh
```

# Was hat besonders Spaß gemacht?
Extrem cool fand ich die einfach Installierung von Ubuntu auf meinen Rasp4. Das ging sogar ohne extra Tastatur und Monitor und nennt sich remote Installation. Dafür muss während der Image Bespielung auf der microSSD karte einfach noch das wifi Credentials mit angegeben werden. Dieser einfach Prozess hat mich irgendwie an Docker Images erinnert, die ja auch sehr leichtfüßig unterwegs sind. Extrem cool!

Es ist auch ein paar mal vorgekommen, dass ich das gesamte OS neu bespielt habe um Konfigurationsprobleme zu lösen. Da ich alle Schritte der Installation in der init.sh hatte, war das kein Problem.

# Schwierigkeiten

* Das regelmäßige pullen des Agenten hat fehlgeschlaten. Bin mir nicht 100% sicher aber das Problem wurde warscheinlich dadurch gelößt das aich aws cli version 1 anstatt version 2 installiert habe also mit sudo apt install awscli welches Version 1 installiert

# Ausblick
* IOT Red Node einrichten zum auslesen des Gas Zählers und Speisen der IOT Daten in InfluxDB
* Grafana zum Rendern der Gas Zähler Daten über die Zeit.
* Mehr IOT verbinden
* Raspberry als DNS Server verwenden mit Pi-Hole. Kommt mit coolen Features wie Ads Query blocking und Caching. Hab nur nen einfache Vodafone Station, würde also viel davon profitieren.

# Zusammenfassung
Wenn euch auch das ALPS Thema interessiert, schreibt mir doch. Mit der [ALPS Community](alps.io) veranstalten wir regelmäßig Community Treffen online aus aller Welt. Dort trefft ihr spannende Leute und könnt euch einbringen wenn ihr wollt :).

Ich arbeite bereits an einer aufgefrischten Library zur Konvertierung der ALPS Spec zu den lower abstracted APIs [hier](https://github.com/mmuller88/alps-unified-ts). Damit wird es dann noch einfacher sein ALPS unified als Library in deinem Code zu benutzen:


Darüber hinaus soll die Library in JavaScript, TypeScript, Python, Java und .NET funktioniert und über öffentliche Registries erhältlicht sein. Mehr darüber kommt in einem separatem Blogpost. Bis dahin stay tuned!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>