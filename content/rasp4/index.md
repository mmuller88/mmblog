---
title: Raspberry 4 IOT mit AWS CDK Pipeline automatisiertes Deployment
show: 'no'
date: '2021-01-02'
image: 'rasp.jpeg'
tags: ['de', '2021', 'aws', 'raspberry', 'cdk', 'nofeed']
engUrl: https://martinmueller.dev/rasp4-eng
pruneLength: 50
---

Hi Raspberry Freunde.

Hinweis: Ich habe in diesem Artikel Provisions-Links verwendet und sie durch "*" gekennzeichnet.

Seit kurzem darf ich mich Besitzer eines Raspberries nennen. Am Cyber Monday habe ich mir einen *[Raspberry 4 mit 4 GB](https://amzn.to/3rD3HOf) gekauft. Ich habe schon früher Erfahrungen mit Home IOT gesammelt und diese in einem [Blogpost](https://martinmueller.dev/smart-home-de) zusammengefasst. Allerdings waren diese Erfahrungen an fertige IOT Lösungen gebunden und geben daher nur einen limitierten Funktionsumfang. Ein guter Freund von mir, der viel Erfahrung mit Home IOT (Internet of Things) hat, zeigte mir was noch alles so möglich ist.

Ich wollte aus auf das nächste IOT Level und mit Hilfe von MQTT und NodeRED coole Lösungen bauen. Meine erster Use Case ist, dass ich den Gaszähler digital auslesen möchte und in Relation zur Zeit schöne Auswertungsgrafiken angezeigt bekomme. Im Internet fand ich eine Anleitung wie man meinen Gaszähler, digital unterstützt, auslesen kann [BK-G4](https://forum.iobroker.net/topic/27960/gasz%C3%A4hler-bk-g4-auslesen-mit-zigbee-fensterkontakt). Diese Lösung verlangte aber ein komplexes NodeRED Deployment mit der Verwendung eines Raspberries.

Der Raspberry kann wie ein normale VM behandelt werden. Das heißt es wird mit einem Betriebsystem wie Ubuntu bespielt. Dann werden erforderliche Programme installiert und anschließend wird das NodeRED Deployment ausgeführt. Bei Bedarf kann die VM einfach weggeschmissen werden und alles nochmal ausgeführt werden. Das sind viele manuelle Schritte die sehr zeitaufwendig und fehleranfällig sein können.

Von daher habe ich mich entschlossen das gesamt Deployment zu einem hohen Grade zu automatisieren mit der Verwendung folgender Technologien GitHub, Docker, Docker Compose, AWS CodeDeploy Agent, AWS CodePipeline mit CDK Pipeline. Prinzipiell muss dann nur noch ein push zum main branch gemacht werden und das gesamte Docker Deployment baut und startet sich von allein.

Wie das alles geht beschreibe ich in den nächsten Abschnitten.

# Setup

Zunächst möchte ich aber gerne mein Setup beschreiben. Wie Eingangs schon erwähnt, habe ich mir zum Cyber-Monday einen Raspberry 4 (kurz Rasp4) mit 4GB gekauft *[https://amzn.to/3rD3HOf](https://amzn.to/3rD3HOf). Desweiteren gab es in dem Set noch eine 64 GB microSSD.

Die Installation von Ubuntu 20.04.1 war sehr einfach und ist sehr gut Dokumentiert auf [ubuntu.com](https://ubuntu.com/download/raspberry-pi) . Ich habe mich für den Ubuntu Server entschieden, da ich den Rasp4 als headless remote VM benutzen möchte.

Zum Auslesen des Gaszählers benötigte ich noch zwei weitere Komponenten. Einen *[Zigbee Tür-/ Fenstersensor](https://amzn.to/37Vsm8S) und einen [Zigbee USB-Stick als Empfänger](https://amzn.to/3hrc7nd). Der Sensor sendet ein Signal zum Zigbee Empfänger jedesmal wenn der Zähler 0,1 qm Gasverbrauch gemessen hat. Das ist eine spezifische Lösung für meinen Gaszähler [BK-G4](https://forum.iobroker.net/topic/27960/gasz%C3%A4hler-bk-g4-auslesen-mit-zigbee-fensterkontakt). Für euren Gaszähler ist das eventuell so nicht möglich.

## Installation der Umgebung

Die IOT Programme sollen mittels Docker Compose laufen und aus meinem [GitHub Repo](https://github.com/mmuller88/rasp4) die Docker Compose YAML File bereitgestellt werden. Desweiteren soll das Docker Compose Deployment automatisch rebuilded und redeployed werden sobald sich was zu den main Branch gepusht wird.

Um das alles zu ermöglichen werden viele Programme wie Docker, Docker Compose, Git, AWS CLI, AWS CodeDeploy Agent usw, benötigt. Um die Installation der benötigten Programme zu vereinfachen habe ich ein Script [./misc/init.sh](https://github.com/mmuller88/rasp4/blob/master/misc/init.sh) erstellt. Dieses wird dann einfach auf dem Rasp4 ausgeführt:

```
sudo chmod +x ./init.sh
./init.sh
```

Wichtig noch zu erwähnen. Der Rasp4 hat nur eine one way Internetverbindung. Das heißt er hat keine öffentliche IP und ist somit von außen nicht bzw. nur schwer erreichbar. Er ist damit nur im lokalen Netz erreichbar.

## Automatisiertes Deployment mit AWS CodeDeploy & AWS CodePipeline

Um manuellen Aufwand so gut es geht zu verringern, habe ich mich dafür entschieden das Docker Compose Deployment zu automatisieren. Dafür verwende ich einen AWS CodeDeploy Agenten der automatisch Änderungen auf dem main Branch registriert und auf dem Rasp4 ausführt. Die Installation des AWS CodeDeploy Agents war etwas knifflig aber hat letztenende funktioniert. Der Agent wird auch mit der init.sh installiert.

Um den Agenten Aktionen auf dem Rasp4 ausführen zu lassen sobald Commits auf dem main Branch passieren, muss noch eine AWS CodePipeline erstellt werden. Die AWS CodePipeline wird Konfiguriert und Verwaltet mit [AWS CDK](https://github.com/aws/aws-cdk) . AWS CDK ist ein Open Source Framework zur Erstellung und Verwaltung von AWS Ressourcen mit Hilfe von high level Sprachen wir TypeScript oder Python. Der AWS CDK Code is ebenfalls in meinem GitHub repo und [hier](https://github.com/mmuller88/rasp4/blob/master/src) zu finden.

Falls ich dich für das Thema AWS CDK neugierig gemacht habe, findest du auf meiner Blogseite unzählige weitere Blogposts über [AWS CDK](https://martinmueller.dev/tags/cdk)

## IOT Docker Compose Stack

Mein IOT Stack besteht aus den folgenden Containern NodeRED, InfluxDB, Grafana, Mosquitto und Zigbee. Die genauen Einstellungen sind in der [docker-compose](https://github.com/mmuller88/rasp4/blob/master/docker-compose.yml) file . Den Stack habe ich mir mit dem Docker Compose Builder von [IOTstack](https://github.com/gcgarner/IOTstack) zusammengebastelt.

Ich empfehle euch einen der Forks vom IOTstack zu benutzen da der User gcgarner den Builder nicht mehr zu maintainen scheint.

# Was hat mir besonders Spaß gemacht?

Extrem cool fand ich die einfach Installierung von Ubuntu auf meinen Rasp4. Das ging sogar ohne extra Tastatur und Monitor und nennt sich remote Installation. Dafür muss während der Image Bespielung auf der microSSD karte einfach noch das wifi Credentials mit angegeben werden. Dieser einfach Prozess hat mich irgendwie an Docker Images erinnert, die ja auch sehr leichtfüßig unterwegs sind. Extrem cool!

Es ist auch ein paar mal vorgekommen, dass ich das gesamte OS neu bespielt habe um Konfigurationsprobleme zu lösen. Da ich alle Schritte der Installation in der init.sh hatte, war das kein Problem.

Auch die Erstellung der AWS CodePipeline mit AWS CDK war extrem cool. Da ich mit AWS CDK schon sehr viel Erfahrung habe, ging das sehr leicht von der Hand. Infrastructure as Code ist einfach toll!

# Schwierigkeiten

Sehr zeitaufwendig und nervig war das Einrichten des AWS CodeDeploy Agents, da dieser nur mit bestimmten Programmversionen von awscli oder ruby funktioniert. Bis heute bin ich mir nicht sicher, warum der Agent immer so viel rumgezickt hat. Naja er funktioniert jetzt und das ist was zählt.

# Ausblick

Ich habe bereits begonnen mit dem NodeRED Flow und kann erfolgreich den Zigbee Türsensor auslesen und bei jedem Signal den digitalen Zählerstand erhöhen. Was jetzt noch fehlt ist das Einspeisen in die InfluxDB und das Konfigurieren von Grafana um schöne Auswertungsdiagramme für gewünschte Zeiträume zu bekommen.

Auch möchte ich in Zukunft an noch spannende IOT Sachen mit coolen Use Cases arbeiten. Ich denke darüber nach einige IOT Prozesse von meiner Smart Life App in mein NodeRED zu migrieren.

Der Rasp4 selbst bietet noch mehr Möglichkeiten als nur als IOT Server verwendet zu werden. Z.B. verwende ich ihn bereits als DNS Server mit [Pi-Hole](https://github.com/pi-hole/pi-hole). Damit blockt er z.B. nervice DNS Queries wie Telemetrie Daten oder Werbung. Mit Sicherheit werde ich noch weitere coole Use Cases für meinen Rasp4 finden.

# Zusammenfassung
IOT ist ein spannendes Thema. Fertiglösungen wie Smart Life, Alexa und co sind leicht zu installieren und versprechen früh den erwünschten Erfolg. Allerdings sind solche Fertiglösungen meistens nur sehr begrenzt in der Funktionalität. Bisher bin ich mit Smart Life ganz gut voran gekommen.

Die Aufgabe den Gaszähler automatisiert auszulesen, hat aber nach einer komplexeren IOT Lösung mit einem Raspberry und NodeRED Flow verlangt. Wie diese Lösung aussieht, habe ich hier beschrieben. Es hat mir unglaublich viel Spaß gemacht an diesem IOT Projekt zu arbeiten und ich bin meinem IOT Kumpel :D extrem dankbar für die Zeit, die er aufbringt um mich dem IOT Thema näher zu bringen.

Fandet ihr den Artikel interessant oder habt ihr noch Fragen? Schreibt mir doch gerne :) .

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>