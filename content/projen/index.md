---
title: Docker Hub release mit Projen
show: 'no'
date: '2021-02-02'
image: 'alps-u.png'
tags: ['de', '2021', 'projen', 'docker', 'nofeed']
engUrl: https://martinmueller.dev/projen-eng
pruneLength: 50
---

Hi Projen Freunde.

* Letzter Artikel über NodeRED InfluxDB Setup. Brauchte Image für automatisches Backup von InfluxDB nach AWS S3.
* Projen ist tools...
* Docker Image release cycle zu Docker Hub

# Projen
[Projen](https://github.com/projen/projen) erlaubt eine ausgeklügelte Verwaltung von Projektkonfiguration durch Code. Mit nur wenigen Zeilen TypeScript Code kann ein gesamtes Repository konfiguriert werden. Hierfür ein Beispiel:

```ts
const { JsiiProject } = require('projen');

const project = new JsiiProject({
  name: 'alps-unified-ts',
  authorAddress: 'damadden88@googlemail.com',
  authorName: 'Martin Mueller',
});

project.synth();
```

Diese wenigen Zeilen erzeugen alle GitHub Projektfiles die das Herz begehrt. Darunter die package.json, .gitignore, tsconfig.json und noch viele viele mehr.

Wirklich richtig cool ist das Projen auch mit GitHub Workflows kommt die z.B. neue Versionen publishen können nach Registries wie NPM oder PYPI.

Ich habe das Projen Framework lieben gelernt, da es tolle Abstraktion und Vorgabe für ein Setup von Projekten ist. Ich lege dir ans Herz Projen mal einen Versuch zu geben und sehr bald wirst du die Schönheit dieses Frameworks selber erleben.

# Projen Setup
* Code 
* Docker Compose
* GitHub Action Release Workflow erweitert um auch nach Docker Hub zu pushen mit gleichen Tag
* Changelog

# Ausblick
* Properties auch als TypeScript properties wegen Dokumentation

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>