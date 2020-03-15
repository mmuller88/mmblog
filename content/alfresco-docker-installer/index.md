---
title: Alfresco's Amps mit Docker Testen
description: Project für OBJECT mit Customizations
date: '2020-03-15'
image: 'docker.jpg'
tags: ['de', 'alfresco', '2020', 'ecm', 'docker', 'docker-compose']
pruneLength: 50
---

**AM Bauen**

Hi Alfrescans,

In diesem Artikel werde ich beschreiben wie man Docker nutzen kann um Amps und Jars Erweiterungen zu testen. Für einen Kunden von Object wurden Share Customizations und Costum Conten Models entwickelt, welche ich schnell und einfach weiterentwickeln möchte. 

Interassant hinzukam für mein Projet, dass die Amps für ein ACS 5.2.6 Deployment geschrieben wurden und Docker als Deployment erst ab ACS 6.0 supported ist. Es war also relativ challinging das Docker Deployment so anzupassen, dass alles funktioniert. Wenn deine Erweiterungen für ACS 6.0 oder neuer geschrieben wurden, sollte es wesentlich einfacher sein.

# Warum Docker Deployment?
Der altmodische Weg ist es die lokal kompilierten Amps und Jars an einem lokalen ACS Deployment zu testen, welches komplett ohne Docker konfiguriert wurde. Das bedeutet Tomcat muss installiert und ACS mit all seinen Dependecies muss auch vorhanden sein. Klar der altmodische Installer hilft dabei, es ist trotzdem eine zeitaufbringende und wenig befriedigende Aufgabe Alfresco so installieren zu müssen. Zusätzlich kommt dann ja noch das man die Amps immer per Hand installieren und evtl. deinstallieren muss. Nicht schön!

Docker Container addressieren genau diese Probleme. Mit Hilfe des Dockerfiles kann ich niederschreiben welche Konfigurationsschritte unternommen werden sollen. Mit Git kann das sogar versioniert passieren und Deployments können blitzschnell zu vorherigen funktionierenden Versionen reverted werden. In diesen Dockerfiles kann man die Installation des Tomcats sowie die Konfiguration von ACS und vieles mehr niederschreiben. 

Klingt nach ner Menge Arbeit? Nö! Alfresco maintained ACS Docker Deployments mit Version 6.0 oder neuer. Wie so ein einfaches Docker Deployment, wobei die Container mit Docker Compose orchestriert werden lässt sich hier bestauen für [ACS Enterprise](https://github.com/Alfresco/acs-deployment/tree/master/docker-compose) und hier für [ACS Community](https://github.com/Alfresco/acs-community-deployment/tree/master/docker-compose). Die Docker Images welches diese Deployment sind hier [ACS Enterprise Image](https://github.com/Alfresco/acs-packaging/tree/master/docker-alfresco) und hier [ACS Community Image](https://github.com/Alfresco/acs-community-packaging/tree/master/docker-alfresco). Zugegeben diese Deployments und Images sind recht limitiert. Das ist zwar gut für einen schnellen Einstieg, erlaubt uns aber nicht unsere lokal erstellten Amps zu testen. Wie das ermöglicht wird, beschreibe ich im nächsten Kapitel.

# Git Repo Vorbereiten
Falls der Build Code eure Amps und Jars in verschieden Git Repos liegen, macht es Sinn diese auf einem Repo zu vereinigen um die Docker Image Erstellung zu erleichtern. Z.B. könnte die repo und share amp in gleichnahmigen Unterverzeichnissen liegen. Falls Maven als Build und Packagingtool verwendet wurde, ist das einfach zu realisieren mit parent Poms. Nach der möglichen Umstruckturierung muss der Build getestet werden, ob auch die Amps oder Jars erstellt werden. 

* Alfresco Docker Installer installieren https://github.com/Alfresco/alfresco-docker-installer
* Images in share und repo folder schieben, da Docker nur auf datein in der gleichen Verzeichnisshöhe zugreifen kann.

# ACS Docker Compose Starten
... 

# Amps / Jars für ACS 5.2
Es kann passieren, dass die verwendeten Dependencies für die 5.2 Amp / Jar nicht mehr kompatibel mit dem ACS 6.0 oder neuer Docker Deployment sind. 
* Maven profil für 6.2 amp / jar erstellen und aufpassen, dass diese amp nur für das Docker Compose Deployment genutzt wird.
Der erste Schritt ist, herauszufinden welche Dependencies (in der Regel Jar files auf dem Tomcat Classpath) Probleme verursachen. Dann müssen diese im Dockerfile gelöscht werden und als Dependencies für das 6.3 Maven Profile in der richtigen Version nachgeladen werden. Nicht entmutigen lassen, dass kann schon recht Haaresträubend und Zeitaufwendig werden.
* Für Produktion sollte nicht das 6.2 profil benutzt werden um es mit ACS 5.2 kompatibel zu halten!



* Für einen Customer ein Repo mit Customizations erstellen und mit Hilfe von Docker testen. 
* Werde 6.2 dafür nehmen
* Bekanntmachung mit alfresco-docker-installer da einheitlicher / standardisiert Weise docker deployments zu Erstellen
* ACS Enterprise ist bisher nicht unterstützt, will einbauen
* Bin zurzeit viel am Prototypen bauen..

# Zusammenfassung

Amps und Jars sind immer noch die beliebteste Methode Customizations an ACS und Share durchzuführen. Diese lokal zu testen, muss auch nicht aufwendig sein, wenn man Docker verwendet. Ich hoffe ich konnte dich animieren zukünftig mal Docket für die Erweiterungen zu benutzen. Falls ja schreib mir doch bitte deine Erfahrung :). 

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).