---
title: ADF App Bauen vom Scratch
description: Für ein Projekt von OBJECT werde ich eine ADF App bauen
date: '2020-02-29'
image: 'robot.png'
tags: ['de', 'alfresco', '2020', 'ecm', 'adf', 'prototype', 'aca', 'object', 'angular', 'webapp']
engUrl: https://martinmueller.dev/ADF-App-eng/
pruneLength: 50
---

Good day

Wie im vorangegangen [Blog Post](https://martinmueller.dev/Erste-Woche-Object/) erwähnt, arbeite ich an einem spannenenden AI Prototyp welcher ACS Community als Content Managment System verwendet. Darüber hinaus laufen noch gewisse AI Services welche über die ACS Schnittstelle wie CMIS und REST gewisse AI Aktionen auf ACS durchführen. Leider muss ich hier etwas im unklaren bleiben, um Firmengeheimnisse zu waren. Soviel sei allerdings gesagt [OBJECT](https://www.object.ch) und die Partnerfirma planen ein Webinar wo unter anderem auch der hier besprochene Prototyp gezeigt wird. Zurück zum Thema! Für die Webapp haben wir uns für [ADF](https://www.alfresco.com/de/ecm-software/application-development-framework) entschieden.

In den nächsten Kapiteln werde ich erklären wir man ein ADF Webapp Projekt erstellen kann und es nach wünschen zu ändern. Diese sollten sich auch wenig bis garnicht unterscheiden ob man nun mit Windows 10, MacOS oder Linux arbeitet. Ich selber mag alle drei Operation Systeme.

# Das wird Benötigt

Ihr solltet [Docker](https://docs.docker.com/install/), [Docker Compose](https://docs.docker.com/compose/install/), [NPM](https://www.npmjs.com/get-npm) und [YARN](https://yarnpkg.com/lang/en/docs/install/) installiert haben. YARN brauchte ich da ich auf einen Windows Laptop arbeite und YARN in der Lage ist die Windows Paths in Unix Paths zu konvertieren. Aufpassen bei Docker! Die Standardinstallation bei Docker erlaubt nur die Verwendung von 2 GB RAM für die Docker Compose Deployments, welches viel zu wenig ist für ACS Community und die anderen Services! Dafür braucht ihr mindestens 10 GB und für ACS Enterprise mindestens 12 GB. Vorzugsweise mehr! Zusätzlich, falls ihr eigene Amps, Jars oder andere Customizations für das ACS Deployment einrichten wollt, empfiehlt es sich Java und Maven zu installieren.

# Git Repository Vorbereiten

Als base für den Prototyp verwende ich das [ACA Git Repository](https://github.com/Alfresco/alfresco-content-app). Zum einen hat es viele [ADF Component und API Libaries](https://github.com/Alfresco/alfresco-ng2-components) bereits integriert und zum andern stellt es eine Shell bereit die schon recht umfangreich das ACS Backend verwendet. Darüber hinaus wird es einfach möglich sein, Updates vom ACA repository in meine Webapp einzuspielen. Und ziemlich cool, ich kann direct zurück kontributieren.

Nun geht es ans Git Repository. Für mich viel die Wahl auf ein privates Git Repository bei uns im [OBJECT](https://www.object.ch) GitLab, da es ja eine Vorbereitungsprojekt für ein Webinar werden soll und niemand die Webapp schon vorher sehen darf. In deinem fall kannst du vielleicht ein public Git Repository nehmen. Der weitere Verlauf wird sich dadurch nicht ändern.

Wie vorhin angesprochen würde ich gerne in der Lage sein Updates vom ACA repository problemlos einzuspielen. Darüber hinaus will ich natürlich soviel es geht vom ACA repository wiederverwenden. Ich habe mich daher für [Git's submodules](https://git-scm.com/docs/git-submodule) entschieden. Damit bin ich dann auch in der Lage zurück zu kontributieren. Ich habe ein Fork vom ACA repo erstellt https://github.com/mmuller88/alfresco-content-app . Ich rate dir das gleiche zu tun. Dann einfach ins Projektverzeichniss wechseln und den Fork als submodule laden:

```
git submodule add https://github.com/<USER>/alfresco-content-app
```

Eventuell kann auch der folgende Befehl nützlich sein um die Submodules, welches in diesem Fall ja nur ACA ist, zu aktualisieren:

```
git submodule update --init --remote
```

Ich brauchte es da ich zu einem Fix Branch gewechselt habe im .gitmodules File.

# ACA Starten

Wenn nun das Webapp Repository soweit konfiguriert wurde, können wir testen ob das Docker Compose Deployment im alfresco-content-app Folder auch startet. In meiner Vorherigen Position als Fullstack Entwickler bei Alfresco hatte ich die Gelegenheit viel mit dem ACA Repository zu arbeiten.

Zum starten des ACA Deployments sind die folgenden Befehle nötig:

```
yarn install
```

Um die nötigen Node Dependencies zu laden.

```
yarn run build
```

Um die ADF Webapp im dist/app Verzeichniss zu erstellen. Darüber hinaus erstellt der Befehl auch die ADF Extensions mit namen @alfresco/aca-shared und @alfresco/adf-office-services-ext . Als frühen Ausblick sei gesagt, Ziel wird es sein für die eigene ADF Webapp eine eigene Extension zu schreiben. Dies hat praktische Gründe wie der Modularisierung und Distributierung.

Das start.sh im ACA Verzeichniss ist ein ausgeklügelt Script. Ihr solltet es bevorzugsweise nutzen um das Deployment zu starten. Die einzelnen Parameter lassen sich mit dem -h oder --help Flag erfragen. Für meinen Windows Laptop muss ich dann diese Parameter Konfiguration nutzen:

```
.\start.sh -wp -hi 192.168.0.237
```

Das -wp Flag wandelt die Linux Dateipfade in Windows Dateipfade um und -hi steht für Host IP und übergibt dem Deployment die IP des Computers. Wenn alles Tutti Frutti ist sollten folgende Adressen erreichbar sein:

```
http://localhost:8080/alfresco/ ACS
http://localhost:8080/content-app/ ACA Webapp
http://localhost:8080/share/ Good old Share
```

Zum Zeitpunkt der Artikelerstellung bekomme ich einen komischen Error wegen des GoogleDocs Modules auf meinem Windows PC. Ich bin mir sicher, dass ich diesen nicht auf meinem MacBook bekomme. Ich ignoriere diesen Error getrost. Falls du werter Leser allerdings weist warum, würde ich mich gerne über eine Privatnachricht mit Erklärung freuen.

Um das Deployment sauber wieder runterzufahren einfach folgenden Befehl benutzen:

```
.\start.sh -d
```

Das stopp und löscht alle Container die mittels start.sh gestartet wurden. Du musst das Deployment löschen und erneut starten wenn du Änderungen von der webapp im dist/app Folder applyen willst. Alternativ kannst du auch das -aca Flag benutzen welches nur den webapp Container neustartet.

# Deployment Anpassen

Dieser und der nächste Abschnitt ist wohl der schwerste und erfordert viel Geduld. Bisher war es ein leichtes da wir einfach nur bestehenden Code genommen haben, welches bereits von anderen Entwicklern konfiguriert und getestet wurde. Nun müssen wir das allerdings selber machen, denn wir wollen ja in der Lage sein Customizations so wie unsere eigene Extension einzubinden. Also nehmt euch nen Cafe oder wie in meinem Fall nen Tee und ran an den Speck!

Zum manipulieren des Docker Compose Deployments habe ich alle direkten Dockerbezüglichen Files aus dem ACA Folder in den Projektfolder kopiert. Das beinhaltet zum Beispiel **docker-compose.yaml**, **start.sh**, **Dockerfile** und den **docker** Folder. Es wäre nun ratsam zu testen ob euer Docker Compose Deployment jetzt immer noch funktioniert. Dafür vielleicht einfach erstmal die ADF Webapp im alfresco-content-app/dist/app folder in den Projekt dist/app Folder kopieren und das Deployment mit start.sh starten. Wie das geht, habe ich ja im vorherigen Kapitel beschrieben.

Jetzt kommt der wohl schwierigste Part, zumindestns war es für mich so. Ihr müsst nun auch die Angular bezüglichen Files in den Projektfolder kopieren und diese so konfigurieren, dass sie die Componenten aus von alfresco-conten-app/src benutzen. In meiem Fall waren es die folgenden Datein:

```
src\app\extensions.module.ts
src\assets\app.extensions.json
src\app.config.json
src\tsconfig.app.json
```

Ich will hier nichts vormachen, die richtige Einstellung der Konfiguration hat mich tatsächlich zwei Tage gekostet. Als ich nicht mehr weiterkam, suchte ich Rat bei der wundervollen [ADF Community in Gitter](https://gitter.im/Alfresco/content-app). Die Jungs und Mädels verstehen ihr Handwerk. Besonderen Dank an meinen Freund und Exkollegen [Bogdan](https://twitter.com/pionnegru).

Jetzt ist es an der Zeit den dist/app folder selber von Angular compilieren zu lassen, anstelle es nur aus dem aca projekt zu kopieren. Wenn du es hinbekommen hast, dass das Docker Compose Deployment erfolgreich mit der im Parentfolder compilierten Webapp im dist folder, kann endlich das Customizing beginnen :) !

# Extension Erstellen

Wohoo! Du hast es tatsächlich bis hierher geschafft. Nun wird es um so mehr Angular lastig. Um eine neue Extension zu bauen empfiehlt sich der Befehl:

```
ng generate library my-ext
```

Ich würde sehr empfehlen ein -ext an den Namen der Extension zu fügen, um es unterscheidbarer von der Webapp zu machen. In meinem Projekt haben sie die gleichen Namen mit Ausnahme, dass ich der Extension noch -ext angefügt habe. Was man nun mit der Extension macht ist total offen und es gibt viele tolle Angular Tutorials, Seiten oder Foren die einen Helfen die gewünschten Änderungen zu erreichen.

Willst du zwischendurch oder am Ende deiner Änderungen die Webapp testen, musst du einfach die ADF Webapp compilieren und das Docker Compose Deployment starten. Dies schaut ähnlich auch wie im **Abschnit ACA Starten** erklärt mit den folgenden Befehlen:
```
yarn install
yarn run build
.\start.sh -wp -hi 192.168.0.237
```

Bitte nicht vergessen das -wp ist Windows spezifisch. Wenn ihr MacOS oder Linux benutzt braucht ihr dieses Flag nicht. Ihr würdet dann wahrscheinlich nichtmal -hi IP benötigen.

# Neues ACA Update Verfügbar

Als sich das [ACA Git Repository](https://github.com/Alfresco/alfresco-content-app) mit unglaublich schneller Geschwindigkeit weiterentwickelt, stellt sich die Frage wie wir diese Updates in wenigen Schritten in unsere ADF Webapp integrieren können. Ich brauchte dies zwar bisher nicht machen für meinen ADF AI Prototypen, aber grundlegend seien diese Schritte genannnt:

1) Es muss das alfresco-content-app Git Submodule geupdated werden.
2) Die Versionen in package.json im Projetfolder müssen mit denen im alfresco-content-app/package.json synchronisiert werden

# Zusammenfassung

Wow überlegt mal was wir hier geschafft haben. Wir haben tatsächlich unsere eigene ADF Webapp geschrieben welche auf ACA basiert und jederzeit einfach upgedatet werden kann! Dafür mussten wir zuerst ein neues Git Repo erstellen. Dann das ACA Projekt als Submodul einbinden. Unmittelbar danach testeten wir das Docker Compose Deployment in ACA. Dann haben wir das Repo so umgebaut, dass wir unsere eigene Angular Extension in die ADF Webapp integriert haben. Das wars! Ich hoffe ihr hattet Spaß und war der Artikel war hilfreich.

# Kudos

Für [Eddie May](https://twitter.com/freshwebs) der brand neue Digital Community Manager von Alfresco für das Berichtigen meiner englischen Übersetzung und das Angebot mir auch in zukünftigen Posts Feedback zu geben :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   