---
title: Große NDJson Files zu CSV transformieren
show: 'no'
date: '2022-01-01'
image: 'dia.png'
tags: ['de', '2022', 'lambda', 'aws', 'cdk', 'etl', 'nofeed']  #'nofeed'
engUrl: https://martinmueller.dev/json2csv-eng
pruneLength: 50
---

Hi

* Kunde will eine ndjson file regelmäßig downloaden und würde diese gerne auf S3 speichern und mit Athena querien
* Diese ndjson file ändert sich einmal täglich und ist unzipped ca 7GB groß
* Darüber hinaus soll die Größe des Files reduziert werden um S3 Kosten zu sparen.
* Dafür transformieren wir die zurzeit 7 GB große Datei von Ndjson zu CSV und speichern diese in S3
* CSV is platzsparender somit konnte der ndjson file von 6.6 GB auf 3.9 GB reduziert werden
...

## NDJson Format

NDJson ist ein Format welches für Streaming optimiert wurde. Das bedeutet jede Zeile enthält ein JSON object und die Zeilen sind mittels Zeilenumbrüchen getrennt. Somit kann eine Streaming-Engine die Daten als kleine zusammenhängende Pakete verarbeiten die jeweils über eine oder mehrere Zeilenumbrüche verpackt werden. Grob sieht dann eine NDJson so aus:

```json
{"prop1":"val1.1","prop2":"val2.1",...}
{"prop1":"val1.2","prop2":"val2.2",...}
...
```

Obwohl nun jede Zeile für sich ein gültiges JSON Objekt ist, ist der gesamte Inhalt kein gültiges JSON object da z.B. die Liste ume alle Objekte fehlt. Das ist wichtig zu verstehen, wenn ihr mit NDJson arbeiten wollt und mit euren favorisierten JSON Tools auf Probleme stoßt.

## json2csv

* https://github.com/zemirco/json2csv
* lib zum Verarbeiten von Json und NDJson Files

## Ausblick

* von CSV nach Parquet mit AWS DataBrew
* AWS CDK stack vorstellen

## Zusammenfassung

...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   