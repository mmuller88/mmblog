---
title: ADF App bauen vom Scratch
description: Für ein Projekt von OBJECT werde ich eine ADF App bauen
date: '2020-03-13'
image: 'robot.png'
tags: ['de', 'alfresco', 'ai', '2020', 'ecm', 'adf', 'prototype', 'aca', 'object']
engUrl: https://martinmueller.dev/ADF-App-eng/
pruneLength: 50
---

UNDER CONSTRUCTION

Good day :D

Wie im vorangegangen [Blog Post](https://martinmueller.dev/Erste-Woche-Object/) erwähnt, arbeite ich an einem spannenenden AI Prototyp welcher ACS Community als Content Managment System verwendet. Darüber hinaus laufen noch gewisse AI Services welche über die ACS Schnittstelle wie CMIS und REST gewisse AI Aktionen auf ACS durchführen. Leider muss ich hier etwas im unklaren bleiben, um Firmengeheimnisse zu waren. Soviel sei allerdings gesagt OBJECT und die Partnerfirma planen ein Webinar wo unter anderem auch der hier besprochene Prototype gezeigt wird. Zurück zum Thema! Für die Webaplikation haben wir uns für ADF entschieden. 

In den nächsten Kapiteln werde ich in wenigen Schritten erklären wir man ein ADF App Projekt erstellen kann und es nach wünschen zu ändern. Diese sollten sich auch wenig bis garnicht unterscheiden ob man nun mit Windows 10, MacOS oder Linux arbeitet. Ich selber mag alle drei OS Systeme.

# Git Repository Vorbereiten

Als base für den Prototype verwende ich das [ACA](https://github.com/Alfresco/alfresco-content-app) Git Repository. Zum einen hat es viele [ADF Component und API Libaries](https://github.com/Alfresco/alfresco-ng2-components) bereits integriert und zum andern stellt es eine Shell bereit die schon recht umfangreich das ACS Backend verwendet. Darüber hinaus wird es einfach möglich sein, Updates vom ACA repository in meine App einzuspielen. Und ziemlich cool, ich kann direct zurück contributien.

Nun gehts ans Git Repository. Für mich viel die Wahl auf ein privates Git Repository bei uns im GitLab, da es ja eine Vorbereitungsprojekt für ein Webinar werden soll und niemand die App schon vorher sehen soll. In deinem fall kannst du vielleicht ein public Git Repository nehmen. Der weitere Verlauf wird sich dadurch nicht beeinflussen.

Wie vorhing angesprochen würde ich gerne in der Lage sein Updates vom ACA repository problemlos einzuspielen. Darüber hinaus will ich natürlich soviel es geht vom ACA repository wiederverwenden. Ich habe mich daher für [Git's submodules](https://git-scm.com/docs/git-submodule) entschieden. Damit ich auch in der Lage bin zurück zu contribuiten habe ich ein Fork vom ACA repo erstellt https://github.com/mmuller88/alfresco-content-app . Ich rate dir das gleiche zu tun. Dann einfach ins Projektverzeichniss wechseln und den Fork als submodule laden

```
git submodule add https://github.com/<USER>/alfresco-content-app
```

Eventuell kann auch der folgende Befehl nützlich sein um die Submodules, welches in diesem Fall ja nur ACA ist, zu aktualisieren:

```
git submodule update --init --recursive --remote
```

Ich brauchte es da ich den branch gewechselt habe im .gitmodules File.

# ACA Starten

* In meiner vorherigen Position war ich im ACA team und habe massgeblich das Deployment beeinflusst.

* In alfresco-content-app ordner gehen. npm run build . Welches zuerst die Extensions aca-shared und aos-extension baut und dan die ACA webapplikation in dist/aca erstellt. Wichtig für die nächsten Schritt, wenn das Deployment gestartet wird.

```
npm install
```
Um die nötigen Node Dependencies zu laden.

```
npm run build
```

Um die ADF Webapplikation im dist/app Verzeichniss zu erstellen. Darüber hinaus erstellt der Befehl auch die ADF Extensions mit namen @alfresco/aca-shared und @alfresco/adf-office-services-ext . Als frühen Ausblick sei gesagt, Ziel wird es sein für die eigene ADF App eine eigene Extension zu schreiben. Dies hat praktische Gründe wie der Modularisierung.

Das start.sh script im ACA Verzeichniss ist sehr ausgeklügelt (ich hatte es entwickelt :p). Ihr solltet es bevorzugsweise nutzen um das Deployment zu starten. Die einzelnen Parameter lassen sich mit dem -h oder --help Flag erfragen. Für meinen Windows Laptop muss ich dann diese Parameter Konfiguration nutzen:

```
.\start.sh -wp -hi 192.168.0.237
```

Das -wp Flag wandelt die Linux Dateipfade in Windows Dateipfade um und -hi steht für Host IP und übergibt dem Deployment die IP des Computers. Wenn alles Tutti Frutti ist sollten folgende Adressen erreichbar sein:
```

```
* ACA submodule und dort enthaltene start.sh welches Docker Compose nutzt zum laufen bringen.

# Deployment Anpassen

* Docker Compose in Parentfolder folder kopieren und tweeken. Falls für euer Projekt ACS Enterprise verwendet werden solle, kann man hier nun Enterprise spezifische Änderungen machen.
* Ebenfalls auch die start.sh aus dem alfresco-content-app folder in Parentfolder kopieren. Nun sicherstellen, dass Deployment funktioniert
* Auch müssen wichtige Angular Konfigurations files wie angular.json in den Parentfolder kopiert und geändert werden. Undzwar so, dass sie in der lage sind die Datein im alfresco-content-app zu nutzen. Somit braucht man diese nicht neu erstellen und kann soviel es geht wiederverwenden.
* Überprüfen ob ACS erfolgreich gestartet ist http://localhost:8080/alfresco ACA app startet auf http://localhost:8080/content-app

# Extension Erstellen

* Ähnlich wie in alfresco-content-app/projects/aca-shared sollte nun eine Projektspezifische Extension erstellt werden wie z.B. projects/ai-prototype . Der Einfachkeitshalber einfach die Datein von aca-shared in den ai-prototype folder kopieren und tweeken. Wichtig sind erstmal nur die Konfigurationsdatein.
* Auch muss die angular.json um ein neues Build erweirt werden. Im unseren Fall wäre es ai-prototype . 

# Zusammenfassung
Das wars. Ich hoffe der Artikel war hilfreich.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).