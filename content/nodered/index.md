---
title: IOT - Den Gaszähler digital auslesen
show: 'no'
date: '2021-01-25'
image: 'gasmeter.jpeg'
tags: ['de', '2021', 'nodered', 'raspberry', 'iot', 'nofeed']
engUrl: https://martinmueller.dev/nodered-eng
pruneLength: 50
---

Hi.

Vor einigen Wochen habe ich bereits [hier](https://martinmueller.dev/rasp4) mein IOT Deployment vorgestellt. Kurz zusammengefasst besteht es aus Hardwareseitig aus einem [Raspberry 4](), [Zigbee Türsensor]() und dem [Zigbee Empfäger](). Die Software die auf dem Raspberry 4 läuft ist Docker Compose. Mit dem Docker Compose Deployment kommt für das IOT Management [NodeRED]() zum Einsatz. Für die Anzeige in Diagrammen verwende ich [Grafana]().

Zuerst möchte ich erklären wie ich meinen analogen Gaszähler digital auslesbar gemacht habe und dann wie ich NodeRED und Grafana nutze um die erhaltenen Daten zu transformieren und in Diagramme (siehe Titelbild) anzeigbar gemacht habe.

# Gaszähler Erweiterung

Wie im Bild oben rechts zu sehen habe ich einen analogen Gaszähler BK-G4. Wie also daraus einen digitalen Gaszähler der sogar Werte über Zeit speichern kann? Nun der Zähler sendet alle 0,01 qm verbrauchtem Gas einen magnetischen Impuls. Auf dem Bild ist das auch als 1 imp 0,01 qm zu sehen. Wenn also auch du einen Gaszähler mit magnetischen Impuls hast, sollte das auch bei dir funktionieren.

Den magnetischen Impuls messe ich einfach mit dem kabellosen [Zigbee Türsensor]() (auch oben rechts in Bild) und sende ihn an einen [Zigbee Empfänger]() der mit einem [Raspberry 4]() verbunden ist und zeichne die Werte auf.

Ganz so einfach sit die Aufzeichnung nicht da das Signal noch transformiert werden muss. Die Transformation des Signals wird mit NodeRED gemacht.

# NodeRED

[NodeRED](https://github.com/node-red/node-red) ist ein Open Source Programmiertool zum verbinden von IOT Geräten miteinander, APIs und online Services. Es bietet einen Webbrowser basierten Editor und unterstützt JavaScript als Programmiersprache. Die Runtime selbst ist [Nodejs](https://en.wikipedia.org/wiki/Node.js).

Sehr cool finde ich auch, dass NodeRED eine Anbindung nach GitHub unterstützt und der aktuelle Stand des NodeRED Projektes mittels Git Protokoll versioniert abgespeichert werden kann. NodeRED bietet viele weitere tolle Funktionen, die ihr unbedingt erforschen solltet. Genauer möchte ich aber auf den NodeRED Flow eingehen.

## NodeRED Flow
Ein NodeRED Projekt kann mehrere Flows besitzen. Ein NodeRED Flow beschreibt die Interaktion von den IOT Geräten mit anderen Geräten, APIs oder online Services. Meinen Flow seht ihr oben links im Bild. Der Flow ließt sich am besten von links nach Rechts. Ganz links sind zwei Eingänge. Der untere Eingang ist von einer [Open Weather API](https://openweathermap.org/appid) mit der ich die aktuelle Außentemperatur erfasse (auch in dem "Gas Delta" Diagram als gelb zu sehen). Der obere Eingang ist von meinem Zigbee Empfänger der ja das Signal vom Zigbee Türsensor bekommt.

Ganz rechts in dem Flow sind die Ausgänge zu sehen (etwas abgeschnitten). Der blaue Ausgang ist ein NodeRED UI Element. NodeRED bietet auch die möglichkeit UI Elemente mit z.B. Sensorwerten zu rendert. Diese ist dann erreichbar z.B. unter https://localhost:1880/ui . Die braunen Ausgänge senden Daten zu einer InfluxDB die dann mit Grafana angezeigt werden.

* MQTT Signal vom Türsensor...

# InfluxDB & Grafana
[InfluxDB](https://github.com/influxdata/influxdb) ist eine Open Source time series Datenbank . Es ist in GO geschrieben und optimiert für schnellen, hochverfügbaren Speicher und Abfrage der gespeicherten Daten. Es eignet sich hervorragend für IOT Daten.

Bei meinem Flow speicher ich den aktuellen Gaswert und die Temperatur in InfluxDB. InfluxDB berechnet dann selbstständig den Timestamp. Dann kann ich einfach mit dem graphischen Analysetool [Grafana](https://github.com/grafana/grafana) mir die Daten aus dem InfluxDB holen und flexibel anzeigen lassen (siehe Diagramme in Titelbild).

* Timeseries Datanbank zum Diagramme anzeigen
* einzelnen Diagramme von Bild beschreiben

# Ausblick

* Automatisitiertes Backup von InfluxDB nach AWS S3
* Elektrizität messen

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>