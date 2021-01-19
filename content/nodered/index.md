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

* Hier Fokus auf Lösung für BK-G4 und andere mit magnetischen Impuls
* Zigbee Türsensor mit magnetischen Überlauf
* Sendet Signal zum Zigbee Empfänger an dem Raspberry

# NodeRed Flow

* MQTT Signal vom Türsensor...
* Temperatur auslesen

# Grafana

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