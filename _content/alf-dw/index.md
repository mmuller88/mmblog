---
title: Digital Workspace mit Process Workspace UI
show: 'no'
description: Digital Workspace bekommt Process Workspace Elemente
date: '2020-05-23'
image: 'tri.png'
tags: ['de', '2020', 'acs', 'aps', 'docker', 'docker-compose', 'dw']
# engUrl: https://martinmueller.dev/alf-dw-eng
pruneLength: 50
---

Hi Alfrescans.

Die neue Alfresco Angular Frontend Webapp Digital Workspace (kurz: DW), welche auf [Alfresco Content App](https://github.com/Alfresco/alfresco-content-app) und [ADF](https://github.com/Alfresco/alfresco-ng2-components) basiert, bekam mit der zuletzt releaseten Version 1.5.0 einige Process UI Elemente spendiert. Darauf haben Alfresco Kunden und Partner schon lange gewartet. Jetzt endlich sollte es möglich sein, eine tolle ADF Webapp mit ACS und APS UI Elementen out of the box zu bekommen. Darüber hinaus maintainen und developen die fähigen Angular Entwickler bei Alfresco die Angular Webapp. In den nächsten Abschnitten erkläre ich wie ich die neue DW Version mit den Process Elementen unter die Lupe nehme

# Prerequisites
Die private DW Image is gehosted auf quay.io. Um diese pullen zu können müsste ihr im Alfresco Support nach credentials für DW fragen. Dann loggt ihr euch in die Quay.io registry ein mit:

```BASH
docker login quay.io
```

# Docker Compose Template
In einem meiner vorherigen posts habe ich bereits beschrieben wie ein multi Alfresco [ACS & APS](https://martinmueller.dev/alf-acs-aps) docker compose Deployment aussehen könnte. Dieses muss jetzt nur noch so erweitert werden, dass die neue DW 1.5.0 Version weiß wo Process zu finden ist mit:

```YAML
digital-workspace:
    image: quay.io/alfresco/alfresco-digital-workspace:1.5.0
    environment:
        APP_CONFIG_BPM_HOST: "http://<IP>:8080"
        APP_CONFIG_ECM_HOST: "http://<IP>:8080"
        APP_CONFIG_PROVIDER: "ALL"
        APP_WITH_PROCESS: "true"
```

# User Provisioning
Ein Problem bleibt allerdings noch bestehen. ACS und APS verwenden ootb unterschiedliche user provisioning systeme. Undzwar bei ACS und APS sind es eigene SQL Datenbanken. Nun muss aber für die DW Webapp es so aussehen, als das ACS und APS die gleichen user verwendet, da sich DW simultan mit beiden Backends (ACS + APS) authentifiziert. Für Testzwecke könnte man das einfach erreichen indem ein User mit identischen Credentials erstellt wird für beide Systeme z.B. :

user: admin@martinmueller.dev pw: admin

Dieser User muss nun bei ACS und APS existieren.

Eine viel bessere und flexiblere Lösung ist die Verwendund eines gemeinsamen user provisioning Systems wie openLDAP. ACS und APS lassen sich jeweils konfigurieren um mit openLDAP die User Provisioning zu garantieren. Natürlich geht das auch in Docker Compose. In meinem letzten Projekt [ACS & APS](https://martinmueller.dev/alf-acs-aps) ist dies auch der Fall. Dort verwenden ACS und APS eine gemeinsames openLDAP welches mit der UI /phpldapadmin verwaltet werden kann.


# Ausblick
...

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   