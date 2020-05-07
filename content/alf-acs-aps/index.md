---
title: ACS und APS Deployment mit Docker Compose
show: 'no'
description: ACS und APS installiert mit Docker Compose
date: '2020-04-11'
image: 'compose.jpeg'
tags: ['de', '2020', 'acs', 'aps', 'docker', 'docker-compose', 'ec2']
engUrl: https://martinmueller.dev/alf-acs-aps-eng
pruneLength: 50
---

Hi Alfrescans.

Es ist mal wieder Zeit über ein spannendes Alfresco Partner Projekt von mir zu berichten. Für einen Kunden hier in Deutschland entwickle ich ein POC welches ACS 6.2 und APS 1.10 verwenden soll. Nach ein wenig Überzeugungsarbeit konnte ich die Beteiligten davon überzeugen, Docker für ACS 6.2 zu verwenden. Mein Plan war es ein Docker Compose Deployment zu erstellen welche ACS, APS und als Identity Provider openLDAP beinhaltet. Das komplette Deployment kann [bei mir in GitHub](https://github.com/mmuller88/alf-acs-aps) gesichtet werden. Eines sei vorweg noch erwähnt. Alfresco offiziell empfiehlt für solche Deployments doch bitte [Kubernetes zu verwenden](https://github.com/Alfresco/alfresco-dbp-deployment), allerdings ist für meinen Kunden die Cloud erstmal noch ein Tabuthema. Darüber hinaus bin ich gespannt zu sehen wie weit ich mit Docker Compose für so ein Deployment kommen werde.

# Docker Compose Setup
Hier beschreibe ich etwas mehr im Detail welche Technologien ich für das Deployment benutze. Wie Eingangs angedeuted soll ACS 6.2 installiert werden. Die zum jetzigen Zeitpunkt zuletzt releaste Version ist 6.2.0.3. Das muss also nur im alfresco Dockerfile in /alfresco/Dockerfile reflektiert werden. Share bleibt auf Version 6.2.0 da keine neuere Version released wurde. ACS soll mit einer openLDAP DB zur User Provisioning connected werden. Zum Glück gibt es bereits toll ausgearbeitete Images zur Erstellung und Management einer [openLDAP DB](https://github.com/osixia/docker-openldap). Zur optischen Verwaltung der openLDAP DB benutze ich [phpldapadmin](http://phpldapadmin.sourceforge.net/wiki/index.php/Main_Page). Wie genau die openLDAP Konfigurations aussieht einfach im docker-compose-base.yml File nachlesen.

Auch soll [APS 1.10](https://docs.alfresco.com/process-services1.10/concepts/welcome.html) zur Modellierung der Workflows beim Kunden verwendet werden. Etwas ungünstig ist die Tatsache, dass Alfresco keine Docker Compose Referenz Deployments für APS 1.10 mehr anbietet. Ich vermute mal, dass ist aufgrund des Kubernetes Deployments und das einfach darauf ein stärker Fokus gelegt wird. Zum Glück existieren noch ein paar alter [Docker Compose Vorlagen](https://github.com/AlfrescoLabs/aps-docker-library/tree/master/docker-compose) und mit ein paar Modifikationen funktionieren diese auch!

Da es sehr Memoryintensiv ist ACS und APS gleichzeitig zu laufen, habe ich mich entschlossen das komplexe Deployment in drei voneinander separierbare Deployments zu teilen. Somit kann ich auch weiterhin auf meinem 16 GB Memory Laptop effizient arbeiten. Die Teilung geschieht mittels Docker Compose Files. Das Erste ist das ACS Deployment, gefolge vom Zweiten mit dem APS Deployment. Zu guter Letzt gibt es dann noch das ACS und APS Deployment. Ich finde das eine geniale Idee da ich nun, falls ich nur an ACS oder APS arbeiten möchte, nicht den gesamten Stack hochfahren muss. Zusätzlich bin ich am überlegen das Dritte Deployment also ACS und APS mittels einer DevOps Pipeline in EC2 zu deployen.

# Prerequisites
Klar ist, dass du Docker brauchst. Falls du auf einem Windows oder Mac arbeitest empfehle ich dir den [Docker Desktop](https://www.docker.com/products/docker-desktop). Nach der Installation bitte daran denken der Docker Umgebung mehr Memory zu Verfügung zu stellen da die default 2 GB viel zu wenig sind umd ACS zum Laufen zu bringen. Mindestens 12 GB wäre angebracht!

Auch verwendet die ACS Docker Compose File private Images von Alfresco gehosted in quay.io . Für diese wäre es wichtig Zugangsdaten vom Alfresco Support zu erfragen. Wenn du diese hast einfach den folgenden Befehl ausführen und die Credentials eingeben:

```
docker login quay.io
```

Mehr oder weniger optional aber mein Beispiel im GitHub Repository verwendet Node's NPM für ein CLI Script Tool zum warten bis Alfresco fertig gebooted hat. Also am besten auch Node und NPM installieren.

# Git Vorbereiten
Natürlich muss erstmal ein Git Repo erstellt werden. Ich hatte meins [alf-acs-aps](https://github.com/mmuller88/alf-acs-aps) genannt. Wie auch in meinem letzten [Alfresco Docker Projekt](https://martinmueller.dev/start-script) empfehle ich den [Docker Alfresco Installer](https://github.com/Alfresco/alfresco-docker-installer) zu verwenden um das noch leere Git Repository vorzubereiten. Wie genau der Docker Alfresco Installer verwendet werden kann, beschreibe ich [hier](https://github.com/mmuller88/alfresco-docker-installer). Beim installieren darauf achten, dass auch LDAP und ein SMTP Server ausgewählt wird. Falls du nicht mein GithUb Repo verwendest, müsstest du nun die APS 1.10 services in das Docker Compose Deployment integrieren. Ich empfehle dir das Deployment in drei Teile aufzuteilen. Alle drei werden in den nächsten Abschnitten erläutert.

## ACS Deployment
Zuerst wird ein docker-compose-base.yml File erstellt welcher alle Services beinhaltet die für alle drei Deployments benötigt werden. Das sind in meinem Fall eine openLDAP und postgres Datenbank. Sowie ein Mail Server. Danach wird der ACS Docker Compose File erstellt. Das gesamte deployment lässt sich nun so starten:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml up -d --build
```

und so stoppen:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml stop
```

Falls ein kompletter ACS Neustart mit leereren Datenbanken und anderen Storage erwünscht ist, einfach diese Befehle ausführen:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml down
rm -rf data
rm -rf logs
```

## APS Deployment
Das APS Deployment wird folgender Maßen gestartet:

```
docker-compose -f docker-compose-base.yml -f docker-compose-APS.yml up -d --build
```

und gestoppt wird es so:

```
docker-compose -f docker-compose-base.yml -f docker-compose-APS.yml stop
```

Zum Erasen einfach das Folgende ausführen:

```
docker-compose -f docker-compose-base.yml -f docker-compose-APS.yml down
rm -rf data
rm -rf logs
```

## ACS und APS Deployment
Achtung eine Warnung vorweg! Dieses Deployment ist sehr Memoryintensiv. Mindestens 16Gb sollte dein Laptop oder PC besitzen. Alternativ plan ich diese Variante in der Cloud auf EC2 zu deployen.

Und so werden alle Services gestarted:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml -f docker-compose-APS.yml -f docker-compose-Proxy.yml up -d --build
```

und so gestoppt

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml -f docker-compose-APS.yml -f docker-compose-Proxy.yml stop
```

Und zum runterreißen einfach eingeben:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml -f docker-compose-APS.yml -f docker-compose-Proxy.yml down
rm -rf data
rm -rf logs
```

# Ausblick
Wie angedeutet würde ich gerne das dritte Deployment also ACS und APS auf AWS EC2 bringen. Am liebsten sogar in einer schönen DevOps Pipeline, sprich commit nach master triggered ein Deploy nach EC2 wo dann dort automatisierte Tests ausgeführt werden wie zum Beispiel ob ACS und APS erfolgreich gebooted haben.

SSO (Single Sign On) erlaubt es für die Alfresco Produkte sich nur noch einmal anmelden zu müssen. Das heißt wenn ich mich zum Beispiel in Share einlogge und dann Alfresco Digital Workspace öffne oder Ativiti App, muss ich mich nicht erneut einloggen. Dafür müsste AIMS Alfresco Identify Manager Service mit ACS konfiguriert werden und zusätzlich für Share dann noch die SAML amp.

# Zusammenfassung
Man muss nicht immer gleich die Kubernetes Keule auspacken wenn es um Container Orchestrierung geht. Auch Docker Compose kann hervorragend verwendet werden um Container zu orchestrieren. Es besteht sogar die möglichkeit komplexe Deployments in kleine Teilstücke aufzuteilen, welche nicht den Memory deines Laptops schonen sondern sich auch hervorragend für eine schnelle Iteration bei der Entwicklung eigenen. Also gerne mal ausprobieren ACS und APS mittels Docker Compose zu Deployen. Falls irgendwelche fragen sind, einfach anschreiben.

# Kudos
An Thijs von der Tollen [Alfrescan Discord Channel Community](https://discord.gg/XGQjUU) für den Vorschlag das Docker Compose Deployment so auf zu teilen :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>