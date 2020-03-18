---
title: Bash Script Contribution für den Alfresco Docker Installer
description: Project für OBJECT mit Customizations
date: '2020-03-22'
image: 'owl.png'
tags: ['de', 'alfresco', '2020', 'ecm', 'docker', 'docker-compose', 'amp', 'jar']
pruneLength: 50
---

Hi Alfrescans,

Ich habe tolle Erfahrungen gesammelt in meinem letzten Projekt mit dem [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer). Näheres darüber einfach in meinem [Blogpost](http://martinmueller.dev/alfresco-docker-installer) nachlesen. Nun bin ich natürlich wild drauf sinnvolle neue Features zu kontributieren. Eines davon ist das Start Script welches als Wrapper für das Docker Compose File genutzt werden kann. In meinen bishering Alfresco Docker Compose Projekten habe ich immer dieses Script implementiert da es einige wertvolle Zusatzfunktionen bietet. Welche das sind werden im nächsten Abschnitt erklärt. Für mich macht es daher Sinn das Start Script dem Installer zur Verfügung zu stellen.

# Features
* Wait-on http://localhost:80/alfresco
* Host IP ermitteln vor AIMS und andere Services welche die HOST IP benötigen
* Windows Path translation
* Mehr Features sind möglich aber zurzeit nicht implementiert. Z.B. Laden von Testdaten mit dem REST API, In meinem ADF AI Prototypen habe ich noch zusätzlich ein -b für build the Angular Webapp und ein -aca so das nur der ACA Container redeployed wird
Wie genau ich das Start Script kontributiert habe, stelle ich im nächsten Abschnitt vor.

# Kontribution
Zuerst sollte ein Fork vom [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) kreiert werden. Auf diesem können dann die Anpassungen gemacht werden. In meinem Fall ist es das Start Script mit Filenamen start.sh . Ich habe das Script unter template/scripts abgespeichert und das Yeoman Setup so eingestellt, dass das Script optional hinzugefügt werden kann, sehr ähnlich wie auch der LDAP Service hinzugefügt wird.

# Ausblick
Als nächstes möchte ich gerne Alfresco's neuen Alfresco Identity Management Service auch AIMS genannt als Kontribution bereit stellen. Dafür müsste dann ein Keycloak Container hinzugefügt werden, sowie Alfresco Properties angepasst. Zusätzlich müsste auch auch der Keycloak Container mit LDAP konfiguriert werden.

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>