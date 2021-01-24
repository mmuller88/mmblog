---
title: IOT - Den Gaszähler digital auslesen
show: 'no'
date: '2021-01-24'
image: 'gasmeter.jpeg'
tags: ['de', '2021', 'nodered', 'raspberry', 'iot']
engUrl: https://martinmueller.dev/nodered-eng
pruneLength: 50
---

Hi.

Vor einigen Wochen habe ich bereits [hier](https://martinmueller.dev/rasp4) mein neues IOT Deployment vorgestellt. Es besteht aus einem [Raspberry 4 DE](https://amzn.to/3a0Xjsd) [US](https://amzn.to/3iEHyuD) [UK](https://amzn.to/2Y8FOQZ), [Zigbee Türsensor DE](https://amzn.to/2KEqsAz) [UK](https://amzn.to/2MeSmDM) und dem [Zigbee Empfäger DE](https://amzn.to/2Y4aq63) [UK](https://amzn.to/3pjZrSk). Die Software die auf dem Raspberry 4 läuft ist Docker Compose. Mit dem Docker Compose Deployment kommt für das IOT Management [NodeRED](https://github.com/node-red/node-red) zum Einsatz. Für die Anzeige in Diagrammen verwende ich [Grafana](https://github.com/grafana/grafana).

Zuerst möchte ich erklären wie ich meinen analogen Gaszähler digital auslesbar gemacht habe und dann wie ich NodeRED und Grafana nutze um die erhaltenen Daten zu transformieren und in Diagramme (siehe Titelbild) anzeigbar gemacht habe.

# Gaszähler Erweiterung

Wie im Bild oben rechts zu sehen habe ich einen analogen Gaszähler BK-G4. Wie also daraus einen digitalen Gaszähler der sogar Werte über Zeit speichern kann? Nun der Zähler sendet alle 0,01 qm verbrauchtem Gas einen magnetischen Impuls. Auf dem Bild ist das auch als 1 imp 0,01 qm zu sehen. Wenn also auch du einen Gaszähler mit magnetischen Impuls hast, sollte die Anleitung hier auch bei dir funktionieren.

Den magnetischen Impuls messe ich einfach mit dem kabellosen [Zigbee Türsensor](https://amzn.to/2KEqsAz) (auch oben rechts in Bild) und sende ihn an einen [Zigbee Empfäger](https://amzn.to/2Y4aq63) der mit einem [Raspberry 4](https://amzn.to/3a0Xjsd) [US](https://amzn.to/3iEHyuD) verbunden ist und zeichne die Werte auf.

Ganz so einfach ist die Aufzeichnung nicht da das Signal noch transformiert werden muss. Die Transformation des Signals wird mit NodeRED gemacht.

# NodeRED

[NodeRED](https://github.com/node-red/node-red) ist ein Open Source Programmiertool zum verbinden von IOT Geräten miteinander, APIs und online Services. Es bietet einen Webbrowser basierten Editor und unterstützt JavaScript als Programmiersprache. Die Runtime selbst ist [Nodejs](https://en.wikipedia.org/wiki/Node.js).

Sehr cool finde ich auch, dass NodeRED eine Anbindung nach GitHub unterstützt und der aktuelle Stand des NodeRED Projektes mittels Git Protokoll versioniert abgespeichert werden kann. NodeRED bietet viele weitere tolle Funktionen, die ihr unbedingt erforschen solltet. Genauer möchte ich aber hier nur auf den NodeRED Flow eingehen.

## NodeRED Flow
Ein NodeRED Projekt kann mehrere Flows besitzen. Ein NodeRED Flow beschreibt die Interaktion von den IOT Geräten mit anderen Geräten, APIs oder online Services. Meinen Flow seht ihr oben links im Bild. Der Flow ließt sich am besten von links nach Rechts. Ganz links sind zwei Eingänge. Der untere Eingang ist von einer [Open Weather API](https://openweathermap.org/appid) mit der ich die aktuelle Außentemperatur erfasse (auch in dem "Gas Delta" Diagram in gelb zu sehen).

Der obere Eingang ist von meinem Zigbee Empfänger der ja das Signal vom Zigbee Türsensor bekommt. Der Zigbee Türsensor und Empfänger arbeiten mit dem sogenannten MQTT Protokoll. MQTT is ein datensparsames, publish und subscribe Protokoll vorranging für die Kommunikation zwischen IOT Geräten.

Ganz rechts in dem Flow sind die Ausgänge zu sehen (etwas abgeschnitten). Der blaue Ausgang ist ein NodeRED UI Element. NodeRED bietet auch die möglichkeit UI Elemente mit z.B. Sensorwerten zu rendern. Diese ist dann erreichbar z.B. unter https://localhost:1880/ui . Die braunen Ausgänge senden Daten zu einer InfluxDB die dann mit Grafana angezeigt werden.

# InfluxDB & Grafana
[InfluxDB](https://github.com/influxdata/influxdb) ist eine Open Source time series Datenbank . Es ist in GO geschrieben und optimiert für schnellen, hochverfügbaren Speicher und Abfrage der gespeicherten Daten. Es eignet sich hervorragend für IOT Daten.

Bei meinem Flow speicher ich den aktuellen Gaswert und die Temperatur in InfluxDB. InfluxDB berechnet dann selbstständig den Timestamp. Dann kann ich einfach mit dem graphischen Analysetool [Grafana](https://github.com/grafana/grafana) mir die Daten aus dem InfluxDB holen und flexibel anzeigen lassen (siehe Diagramme in Titelbild).

Unten rechts sehe ich den aktuellen und gestrigen Tagesverbrauch. Man sieht es in dem Bild schlecht da nur gelb angezeigt wird aber ich habe unterschiedliche Farben für Farberreiche eingestellt. Von 0 - 7 qm ist grün. Dann von 7 - 14 qm is gelb und alles über 14 qm ist rot. Für eine dreiköpfige Familie ist der durchschnittliche Tagesverbrauch in etwa 7 qm, was in etwa maximal um den Faktor 2 schwankt im Sommer und Winter. Extrem cool ^^.

Ganz unten links wird der Gesamtverbrauch des Gases angezeigt und darüber wie sich der Verbrauch über den Tag relativ ändert. Eine ziemlich coole Funktion von Grafana ist, dass der Zeitbereich komfortabel geändert werden kann. Als default habe ich "Heute" eingestellt welches mir alle Werte von 0 bis jetzt wiedergibt. Es gibt aber noch andere Zeitbereiche wie Gestern, Vorgestern, 12 std. usw. Auch lassen sich Start- und Endzeit direkt eingeben. Extrem cool!

# InfluxDB AWS S3 Backup
Mittlerweile habe ich sogar eine Datenbackup Funktion eingebaut. Damit komprimiere ich meine InfluxDB Daten und speicher sie in AWS S3. AWS S3 ist ein günstiger langzeit Cloud Storage. Ich bevorzuge diese Methode da ich mir so keinen externen Speicher kaufen muss und die physische Verwaltung des Speichers AWS überlassen kann.

Für das Backup habe ich eine eigene [Docker Image gebaut und release](https://github.com/mmuller88/influxdb-s3-backup). Das war nötig da es noch keine Docker Image auf Docker Hub gab welche InfluxDB + AWS CLI + arm64 unterstützten. Diese konsumiere ich nun in meinem [rasp4 repo](https://github.com/mmuller88/rasp4) im docker-compose.yaml. Das Backup wird per default jeden morgen um 1 Uhr durchgeführt.

# Ausblick

Als nächstes möchte ich mich gerne an meinen Stromzähler machen um auch diesen digital auslesen zu können.

Ich will auch mehr IOT Geräte nach NodeRED migrieren da ich zurzeit noch einiges in der Cloud mit der App "Smart Life" am laufen habe. Die Funktionalität dort ist aber sehr beschränkt. Z.B. kann ich bereits meinen Heizboiler an- und ausschalten und das würde ich gerne mit NodeRED steuern können.

# Zusammenfassung
Wenn euch noch coole Idee einfallen wie ich meine Sensordaten transformieren oder visualisieren um nützliche Informationen zu generieren, lasst es mich wissen.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>