---
title: Alfresco Let's Encrypt Docker Companion Erweiterung
show: 'no'
description: Companion Image für Docker Compose
date: '2020-05-30'
image: 'hack.jpeg'
tags: ['de', '2020', 'acs', 'alfresco', 'docker', 'docker-compose', 'ssl', 'github-actions']
engUrl: https://martinmueller.dev/alf-lets-encrypt-eng
pruneLength: 50
---

Hi Alfrescans.

Während des Alfresco Hackathon dieses Jahr habe ich für den [Docker Alfresco Installer](https://github.com/Alfresco/alfresco-docker-installer) eine Docker Companion Erweiterung implementiert, um SSL Zertifikate zu verwalten welche dann genutzt werden können für HTTPS Verbindungen, entwickelt. Die SSL Zertifikate werden dabei von [Let's Encrypt](https://letsencrypt.org/de/) ausgestellt und regelmäßig erneuert. Let's Encrypt dient dabei auch als Autorisierer der Zertifikate. Ziemlich cool oder? Somit muss ich mir keine Gedanken mehr machen über eine sichere und verschlüsselte Verbindung zu meinem Alfresco Proxy.

Leider wurde der Pull Request abgelehnt. Um aber dieses tolle Feature euch einfacher zugänglich zu machen, habe ich mich entschlossen es einfach in meinem GitHub Repo zu implementieren und es euch hier zu präsentieren. Zusätzlich habe ich automatisierte Tests geschrieben welche die noch recht neue Build Engine GitHub Actions nutzen, um das Let's Encrypt Docker Companion zu testen. In den nächsten Abschnitten erkläre ich die Erweiterung sowie die die automatisierten Tests.

# Docker Companion
* Repo, Code

# Testing
GitHub Actions ...
Sub Domain ...

# Zusammenfassung
Verschlüsselte Verbindungen zum Alfresco Proxy sind essenziell für eine Produktionsumgebung mit Alfresco. Es benötigt einen hohen manuellen Aufwand die dafür benötigten SSL Zertifikate zu erstellen, autorisieren und regelmäßig zu erneuern. Mit dem tollen und kostenlosem Angebot von [Let's Encrypt](https://letsencrypt.org/de/) lässt sich dieser Aufwand auf fast null reduzieren. Falls ihr Let's Encrypt auch für eine Produktionsumgebung nutzt, bitte denkt darüber nach eine Spende and Let's Encrypt zu entrichten. Somit kann garantiert werden, dass dieser Service auch in Zukunft kostenlos bleibt. Ich bedanke mich für eure Aufmerksamkeit und hoffe auf reichliches Feedback :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>