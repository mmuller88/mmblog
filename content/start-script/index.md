---
title: Bash Script Contribution für den Alfresco Docker Installer
description: Project für OBJECT mit Customizations
date: '2020-03-21'
image: 'owl.png'
tags: ['de', 'alfresco', '2020', 'ecm', 'docker', 'docker-compose', 'yeoman']
engUrl: http://martinmueller.dev/start-script-eng
pruneLength: 50
---

Hi Alfrescans,

Ich habe tolle Erfahrungen gesammelt in meinem letzten Projekt mit dem [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer). Näheres darüber einfach in meinem vorherigen [Blogpost](http://martinmueller.dev/alfresco-docker-installer) nachlesen. Nun bin ich natürlich gespannt darauf sinnvolle neue Features zu kontributieren. Eines davon ist das Start Script welches als Wrapper für das Docker Compose File genutzt werden kann. In meinen bishering Alfresco Docker Compose Projekten habe ich immer dieses Script implementiert da es einige wertvolle Zusatzfunktionen bietet. Welche das sind werden im nächsten Abschnitt erklärt. Für mich macht es daher Sinn das Start Script dem Installer zur Verfügung zu stellen.

# Features
Das wohl wichtigste Feature is eine eingebaute warte Routine. Dieses wartet solange bis ACS fertig gebooted hat. Das ist zum Beispiel sehr nützlich wenn man nach dem Start von ACS tests auführen möchte mit Tools wie Postman. Auch können Daten via REST API geladen werden, wenn ACS fertig mit booten ist. Die warte Routine ist mit NPM's [wait-on](https://www.npmjs.com/package/wait-on) implementiert. Es macht Sinn auf die breite Palette an Tools im public NPM Repository zurückzugreifen, da ich dann diese nicht selber implementieren musst und außerdem sind diese in der Regel gut getested und bieten wenig Freiraum für Fehlerfälle.

Das nächste Feature ist besonders wichtig für mich da ich mit dem Windows arbeite. Wenn man versucht Docker Compose mit Windows auszuführen bekommt man eventuell ein Problem mit den Volumes, da diese nicht die Windows Path schreibweise ootb unterstützen. Glücklicherweise hat die Docker Compose Community eine Lösung bereitgestellt. Es muss einfach die folgende Environment Variable gesetzt werden bevor Docker Compose gestartet wird:

```
export COMPOSE_CONVERT_WINDOWS_PATHS=1
```

Das wird nun vorher gemacht wenn man das Start Script zusätzlich mit dem -wp flag startet.

Die nächsten Features haben es bisher noch nicht in den Alfresco Docker Installer geschafft, was sich aber bald ändern könnte und welche ich persönlich schon viel bei meinen Deployment nutze. Es ist möglich mit -hi und -hp die Host IP und den Host Port dynamisch mit dem Start Script zu setzen. Ich finde das sehr praktisch wenn man sich in Umgebungen befindet welche öfter mal die IP wechseln. Zurzeit löst das aber der Installer so, dass er bei der Installation die Host IP und den Host Port abfragt. Es ist also schon konfigurierbar, wenn auch nur während der Installation selbst.

Mehr Features sind zwar möglich aber zurzeit nicht implementiert. Z.B. Das Laden von Testdaten mit dem REST API. In meinem [ADF AI Prototypen](http://martinmueller.dev/adf-app) habe ich noch zusätzlich ein -b für build the Angular Webapp und ein -aca so das nur der ACA Container redeployed wird um ein schnelles Entwickeln mit der ACA Webapp zu gewährleisten. Wie genau ich das Start Script contributed habe, stelle ich im nächsten Abschnitt vor.

# Contribution
Zuerst sollte ein Fork vom [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) kreiert werden. Auf diesem können dann die Anpassungen gemacht werden. In meinem Fall ist es das Start Script mit Filenamen start.sh. Ich habe das Script unter template/scripts abgespeichert und das Yeoman Setup so eingestellt, dass das Script optional hinzugefügt werden kann, sehr ähnlich wie auch der LDAP Service hinzugefügt wird. Alle Änderungen sollten auf deinen Fork in Form eines Remote Branches gesichert werden. Dafür muss zunächst ein lokaler Branch erzeugt und Änderungen gepushed werden:

```
git branch startscript
git add --all
git commit -m "added startscript"
git push -u origin HEAD:startscript
```

Sind nun alle Änderungen vollzogen und ausgiebig getestet, kann ein Pull Request zum Alfresco Docker Installer Repository erstellt werden. Dafür geht man einfach auf die Installer Github Seite. Dort erscheint dann ein Create Pull Request Button.

Oh ja eine Sache bitte noch beachten. Wenn du ein neues Feature contributen willst wäre es sehr toll und best practice wenn du auch dazu einen Test schreibst, welcher garantiert dass das neue Feature funktioniert. Ich habe das im .travis File gemacht. Nun werden Deployments und Start von Alfresco mit und ohne zur Hilfenahme des Start Scriptes getestet.

# Ausblick
Als nächstes möchte ich gerne Alfresco's neuen Alfresco Identity Management Service auch AIMS genannt als Kontribution bereit stellen. Dafür wird ein Keycloak Container hinzugefügt, sowie die Alfresco Properties angepasst. AIMS macht nur Sinn wenn man auch einen Identity Provider besitzt. Also soll AIMS nur hinzugefügt werden, wenn LDAP während der Installation ausgewählt wird.

# Zusammenfassung
Dieser Artikel beschreibt eine kurz Übersicht zu meiner ersten Kontribution zu dem Alfresco Docker Installer. Zu einem nutze ich das Repository bereits für meine Projekte und es bot mir die perfekte Möglichkeit den Yeoman template Installer besser zu verstehen. Das Start Script bietet viele neue zusätzliche Funktionen. Wie man eine Contribution machen kann, wurde ebenfalls ausführlich beschrieben. Hast du eventuell auch eine tolle Idee wie man den Installer verbessern könnte? Ich freue mich auf dein Feedback.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>