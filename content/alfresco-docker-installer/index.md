---
title: Alfresco's Amps mit Docker Testen
description: Project für OBJECT mit Customizations
date: '2020-03-15'
image: 'docker.jpg'
tags: ['de', 'alfresco', '2020', 'ecm', 'docker', 'docker-compose', 'amp', 'jar']
engUrl: http://martinmueller.dev/alfresco-docker-installer-eng
pruneLength: 50
---

Hi Alfrescans,

In diesem Artikel werde ich beschreiben wie man Docker nutzen kann um Amps und Jars Erweiterungen für ACS zu testen. Für einen Kunden von [OBJECT](https://www.object.ch) wurden Share Customizations sowie Costume Content Models entwickelt, welche ich schnell und einfach weiterentwickeln möchte.

Interassant hinzukam für mein Projet, dass die Amps für ein ACS 5.2.6 Deployment geschrieben wurden und Docker als Deployment erst ab ACS 6.0 supported ist. Es war also relativ challenging das Docker Deployment so anzupassen, dass alles funktioniert. Wenn deine Erweiterungen für ACS 6.0 oder neuer geschrieben wurden, sollte es wesentlich einfacher sein.

# Warum Docker Deployment?
Der altmodische Weg ist es die lokal kompilierten Amps und Jars an einem lokalen ACS Deployment zu testen, welches komplett ohne Docker konfiguriert wurde. Das bedeutet Tomcat muss installiert und ACS mit all seinen Dependencies muss auch vorhanden sein. Klar der altmodische Installer hilft dabei, es ist trotzdem eine zeitaufbringende und wenig befriedigende Aufgabe Alfresco so installieren zu müssen. Zusätzlich kommt dann ja noch das man die Amps immer per Hand installieren und evtl. deinstallieren muss. Nicht schön!

Docker Container adressieren genau diese Probleme. Mit Hilfe des Dockerfiles kann ich niederschreiben welche Konfigurationsschritte unternommen werden sollen. Mit Git kann das sogar versionert passieren und Deployments können blitzschnell zu vorherigen funktionierenden Versionen reverted werden. In diesen Dockerfiles kann man die Installation des Tomcats sowie die Konfiguration von ACS und vieles mehr niederschreiben. 

Klingt nach ner Menge Arbeit? Nö! Alfresco maintained ACS Docker Deployments mit Version 6.0 oder neuer. Wie so ein einfaches Docker Deployment, wobei die Container mit Docker Compose orchestriert werden lässt sich hier bestauen für [ACS Enterprise](https://github.com/Alfresco/acs-deployment/tree/master/docker-compose) und hier für [ACS Community](https://github.com/Alfresco/acs-community-deployment/tree/master/docker-compose). Die Docker Images welches diese Deployment sind hier [ACS Enterprise Image](https://github.com/Alfresco/acs-packaging/tree/master/docker-alfresco) und hier [ACS Community Image](https://github.com/Alfresco/acs-community-packaging/tree/master/docker-alfresco). Zugegeben diese Deployments und Images sind recht limitiert. Das ist zwar gut für einen schnellen Einstieg, erlaubt uns aber nicht unsere lokal erstellten Amps zu testen. Wie das ermöglicht wird, beschreibe ich im nächsten Kapitel.

# Git Repo Vorbereiten
Falls der Build Code eure Amps und Jars in verschieden Git Repos liegen, macht es Sinn diese auf einem Repo zu vereinigen um die Docker Image Erstellung zu erleichtern. Z.B. könnte die repo und share amp in gleichnahmgen Unterverzeichnissen liegen. Falls Maven als Build und Packagingtool verwendet wurde, ist das einfach zu realisieren mit parent Poms. Nach der möglichen Umstrukturierung muss der Build getestet werden, ob auch die Amps oder Jars erstellt werden. 

Nun soll das Docker Backend installiert werden. Die Orchestrierung der Container soll mit Docker Compose geschehen. Zum Glück gibt es dafür den [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) der es sehr einfach mit Yeoman bedienbar ist und schon eine breite Palette an Installoptionen wie der ACS Version, ob LDAP verwendet werden soll usw. bietet. Ich würde vorschlagen einfach erstmal einen Ordner mit namen docker im Git Repo zu erstellen und in diesem das Docker Compose Backend mit dem [Alfresco Docker Installer zu installieren](https://github.com/Alfresco/alfresco-docker-installer#installation). Nach der installation sollte das Deployment mit
```
docker-compose up
```
hochgefahren und die Urls getestet werden. Wenn alles funktioniert, einfach das Deployment runterfahren mit:
```
docker-compose down
```
Im nächsten Abschnitt wird erklärt wie die Share oder Repo Amp / Jar in die Image mit eingebunden werden kann.

# Share und Repo Images Anpassen
Nun isst es an der Zeit die Share und Repo Modifikationen mittels Amps oder Jar in die Image zu gießen. Idealerweise sollten die frisch kompilierten Amps / Jars aus dem target Folder dafür genutzt werden. am einfachsten geht dass wenn wir das Dockerfile vom docker/alfresco nach repo/ und docker/share nach share/ verschoben werden. Dadurch erlauben wir Docker bei der Bildung der Image auf das jeweils dortige target Verzeichniss zuzugreifen kann. Jetzt einfach in der repo und share Dockerfile die Anweisung setzen, dass die Amps / Jars aus dem target Folder in die Image kopiert werden wie hier z.B.:

```
COPY modules/amps $TOMCAT_DIR/amps
COPY modules/jars $TOMCAT_DIR/webapps/alfresco/WEB-INF/lib

COPY target/myamp-62-repo-1.0-SNAPSHOT*.amp $TOMCAT_DIR/amps
```

Nun muss noch das docker/docker-compose.yaml File geändert und die Verzeichnisse für die Repo und Share Image angepasst werden. In unseren Setup sehe dass dan so aus für Repo:

```
context: ./../repo
```

Und so für Share:

```
context: ./../share
```

# Amps / Jars für ACS 5.2
Wenn ihr auch so wie ich Amps oder Jars für ein ACS 5.2 Deployment testen wollt, kommen ein paar Schwierigkeiten hinzu. Es kann passieren, dass die verwendeten Dependencies für die 5.2 Amp / Jar nicht mehr kompatibel mit dem ACS Docker Deployment sind. Auffallen wird das durch Errors wärend ACS gebooted wird. Der erste Schritt ist herauszufinden welche Dependencies (in der Regel Jar files auf dem Tomcat Classpath) Probleme verursachen. Es empfiehlt sich dann ein Maven Profil für die 6.2 amp zu kreieren, welches dann die Dependencies mit der richtigen Version nachlädt. 

Dann müssen diese auch im Dockerfile gelöscht werden. Nicht entmutigen lassen, dass kann schon recht Haaresträubend und Zeitaufwendig werden! Bei mir sah das in etwa dann so aus:
```
ARG POI_V=4.0.1
RUN rm -f $TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/poi-${POI_V}.jar 
RUN rm -f $TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/poi-ooxml-${POI_V}.jar
RUN rm -f $TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/poi-scratchpad-${POI_V}.jar
ARG TIKA_V=1.21-20190624
RUN rm -f $TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/tika-core-${TIKA_V}-alfresco-patched.jar
RUN rm -f $TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/tika-parsers-${TIKA_V}-alfresco-patched.ja
```

Zum testen kann dann die Amp / Jar die mit dem 6.2 Profil gebaut wurde, verwendet werden. Aber aufpassen für das 5.2 Deployment muss die Amp / Jar ohne das 6.2 Profil verwendet werden, ansonsten kann es zu anderen Dependency Problemen kommen!

# Zusammenfassung

Amps und Jars sind immer noch die beliebteste Methode Customizations an ACS und Share durchzuführen. Diese lokal zu testen, muss auch nicht aufwendig sein, wenn man Docker verwendet. Ich hoffe ich konnte dich animieren zukünftig mal Docket für die Erweiterungen zu benutzen. Falls ja schreib mir doch bitte deine Erfahrung :). 

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>