---
title: ACS und APS in Docker Compose
show: 'now'
description: ACS und APS installiert mit Docker Compose
date: '2020-04-04'
image: 'swagger.png'
tags: ['de', '2020', 'acs', 'aps', 'docker', 'docker-compose', 'ec2']
# engUrl: https://martinmueller.dev/cdk-swagger-eng
pruneLength: 50
---

UNDER CONSTRUCTION

Hi Alfrescans.

Es ist mal wieder Zeit über ein spannendes Alfresco Partner Projekt von mir zu berichten. Für einen Kunden hier in Deutschland entwickle ich ein POC welches ACS 6.2 und APS 1.10 verwenden soll. Nach ein wenig Überzeugungsarbeit konnte ich die Beteiligten davon überzeugen, Docker für ACS 6.2 zu verwenden. Mein Plan war es ein Docker Compose Deployment zu erstellen welche ACS, APS und als Identity Provider openLDAP beinhaltet. Das komplette Deployment kann [bei mir in GitHub](https://github.com/mmuller88/alf-acs-aps) gesichtet werden. Eines sei vorweg noch erwähnt. Alfresco offiziell empfiehlt für solche Deployments doch bitte [Kubernetes zu verwenden](https://github.com/Alfresco/alfresco-dbp-deployment), allerdings ist für meinen Kunden die Cloud erstmal noch ein Tabuthema. Darüber hinaus bin ich gespannt zu sehen wie weit ich mit Docker Compose für so ein Deployment kommen werde.

# Docker Compose Setup
Hier beschreibe ich etwas mehr im Detail welche Technologien ich benutzen werde. Wie Eingangs angedeuted soll ACS 6.2 installiert werden. Die zum jetzigen Zeitpunkt zuletzt releaste 6.2 Version ist 6.2.0.3. Das muss also nur im alfresco Dockerfile in /alfresco/Dockerfile reflektiert werden. Share bleibt auf Version 6.2.0 da keine neuere Version released wurde. ACS soll mit einer openLDAP DB zur User Provisioning connected werden. Zum Glück gibt es bereits toll ausgearbeitete Images zur Erstellung und Managment einer [openLDAP DB](https://github.com/osixia/docker-openldap). Zur optischen Verwaltung der openLDAP DB benutze ich [phpldapadmin](http://phpldapadmin.sourceforge.net/wiki/index.php/Main_Page). Wie genau die openLDAP Konfigurations aussieht einfach im docker-compose-base.yml File nachlesen.

Auch soll [APS 1.10](https://docs.alfresco.com/process-services1.10/concepts/welcome.html) zur Modellierung der Workflows beim Kunden verwendet werden. Etwas ungünstig ist die Tatsache, dass Alfresco keine Docker Compose Referenz Deployments für APS 1.10 mehr anbieten zu scheint. Ich vermute mal, dass ist aufgrund des Kubernetes Deployments und das einfach darauf ein stärker Fokus gelegt wird. Zum Glück existieren noch ein paar alter Docker Compose Vorlagen und mit ein paar Modifikationen funktionieren diese hervorragend!

Da es sehr Memoryintensiv ist ACS und APS gleichzeitig zu laufen, habe ich mich entschlossen das komplexe Deployment in drei voneinander separierbare Deployments zu teilen. Somit kann ich auch weiterhin auf meinem 16 GB Memory Laptop effizient arbeiten. Die Teilung geschieht mittels Docker Compose Files. Das Erste ist das ACS Deployment, gefolge vom Zweiten mit dem APS Deplyoment. Zu guter Letzt gibt es dann noch das ACS und APS Deployment. Ich finde das eine geniale Idee da ich nun, falls ich nur an ACS oder APS arbeiten möchte, nicht den gesamten Stack hochfahren muss. Zusätzlich bin ich am überlegen das Dritte Deployment also ACS und APS mittels einer DevOps Pipeline in EC2 zu deployen.

# Prerequisites
Klar ist, dass du Docker brauchst. Falls du auf einem Windows oder Mac arbeitest empfehle ich dir den [Docker Desktop](https://www.docker.com/products/docker-desktop). Nach der Installation bitte daran denken der Docker Umgebung mehr Memory zu Verfügung zu stellen da die default 2 GB viel zu wenig sind umd ACS zum Laufen zu bringen. Mindestens 12 GB wäre angebracht!

Auch verwendet die ACS Docker Compose File private Images von Alfresco gehosted in quay.io . Für diese wäre es wichtig Zugangsdaten vom Alfresco Support zu erfragen. Wenn du diese hast einfach den folgenden Befehl ausführen und die Credentials eingeben:

```
docker login quay.io
```

Mehr oder weniger optional aber mein Beispiel im GitHub Repository verwendet Node's NPM für ein CLI Script Tool zum warten bis Alfresco fertig gebooted hat. Also am besten auch Node und NPM installieren.

# Git Vorbereiten
Natürlich muss erstmal ein Git Repo erstellt werden. Ich hatte meins [alf-acs-aps](https://github.com/mmuller88/alf-acs-aps) genannt. Wie auch in meinem letzten [Alfresco Docker Projekt](https://martinmueller.dev/start-script) empfehle ich den [Docker Alfresco Installer](https://github.com/Alfresco/alfresco-docker-installer) zu verwenden um das noch leere Git Repository vorzubereiten. Wie genau der Docker Alfresco Installer verwendet werden kann, beschreibe ich [hier](https://github.com/mmuller88/alfresco-docker-installer). Beim installieren mit dem Installer darauf achten, dass auch LDAP und ein SMTP Server mit installiert wird.

# Deployen
* Local, Ec2 Machine, Kunde VM

# Outlook
* Ec2 Instance für ACS und APS Deployment
* ACS 6.2, APS 1.10, LDAP als Identity provider
* Bonus Alfresco AIMS + SAML Amp für Single Sign On

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>