---
title: Den Gaszähler digital auslesen
show: 'no'
date: '2021-01-25'
image: 'gasmeter.jpeg'
tags: ['de', '2021', 'nodered', 'raspberry', 'iot', 'nofeed']
engUrl: https://martinmueller.dev/nodered-eng
pruneLength: 50
---

Hi Raspberry Freunde.

* Verweis auf Setup in vorheringen Blog
* Hier Fokus auf Lösung für BK-G4 und andere mit magnetischen Impuls

# Gaszähler Erweiterung

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