---
title: OpenApi generierte REST Server
description: Wie man mit OpenApi Specs REST Server
show: 'no'
date: '2020-06-06'
image: 'lets.png'
tags: ['de', '2020', 'openApi', 'automate', 'github-actions', 'postman']
engUrl: https://martinmueller.dev/openapi-server-eng
pruneLength: 50
---

Hello Leute :).

In diesem Beitrag möchte ich gerne davon berichten wie einfach es sein kann einen Backend REST Server zu erstellen mit zur Hilfenahme von OpenApi Spezifikationen. Mein ultimatives Ziel ist es Backups und den Restore Prozess von Alfresco Daten so einfach wie möglich zu machen. Nach langem recherchieren habe ich mich entschlossen [Restic](https://github.com/restic/restic) als Backup und Restoring Engine zu benutzen. Da in meinem bisherigen Deployments alle Alfresco Daten, sprich die Blob Daten, RDB Daten, Solr Daten usw. im /data Folder vorliegen scheint es der perfekte Use Case. Das automatisierte Backup funktioniert auch so weit. Vielen Dank an dieser Stelle [lobaro](https://github.com/lobaro/restic-backup-docker) und seiner brillanten restic Backup Arbeit welche mir im Part automatisierte Backup sehr geholfen hat. 

Nun steht allerdings noch der Restoring part an. Und wie es scheint gibt es bisher dafür keine einfach zu nutzenden Ansätze. Der Administrator müsste also immer die Restoring Manuell durchführen. Das heißt in die Machine einloggen und die nötigen restic restore Befehle ausführen, welche den gewünschten Snapshot wiederherstellen. Diesen Prozess will ich vereinfachen und dem Administrator eine angenehme UI zur Wiederherstellung bieten. Dafür verwende ich die OpenApi Technologien. In den nächsten Abschnitten erzähle ich mehr über OpenApi und was genau ich gemacht habe.

# OpenApi
[OpenApi](https://swagger.io/docs/specification/about/) welches früher Swagger genannt wurde, ist eine YAML oder JSON Template Sprache zur Beschreibung von RESTful APIs. Folgend beschreibe ich was super an OpenApi ist. Erstens eigenen sich die Templates extrem gut als Dokumentation über die API selber, da aus dem Template eine schick aussehende HTML UI generiert werden kann, welche die API Endpoints sehr gut beschreibt. Eine solche UI ist im Titelbild dieses Blogposts zu sehen. Noch genialer ist die UI kann direkt zum Testen der Endpoints genutzt werden, also zum Senden und Empfangen von Requests und Responses. Viele API Schnittstellen, wie es auch AWS API Gateway eine ist, bieten es and die Parameter Validierung der Requests über OpenApi Files zu machen. Was mit Parametervalidierung gemeint ist versuche ich anhand des folgenden Beispiels zu erklären:

```YAML
parameters:
    - in: query
    name: userId
    description: Get items of that user
    required: true
    type: string
```

Hier ist ein Parameter vom Typ Query zu sehen sehen. Das bedeutet dieser würde in der URL in etwa so aussehen
```
http://<url>/items?userId=martin
```

Mit der Parametervalidierung kann ich dann bestimmte Eigenschaften des Parameters definieren, wie hier der name **userId** ob er required ist und welchen Typ der value haben soll, in unserem Fall als vom typ string.

Auch sehr mächtig ist die Eigenschaft, dass es möglich ist aus OpenApi Files [Client Libaries und Server Stubs zu generieren](https://swagger.io/tools/swagger-codegen/). Alfresco macht das zum Beispiel mit dem [API-Explorer](https://api-explorer.alfresco.com/api-explorer/) (Näheres auf [GitHub Api-Explorer](https://github.com/Alfresco/rest-api-explorer)) und [ADF](https://www.alfresco.com/abn/adf/) (oder [ADF JS Github](https://github.com/Alfresco/alfresco-js-api)). Dort wird zum Beispiel aus dem [Swagger File](https://github.com/Alfresco/rest-api-explorer/blob/master/src/main/webapp/definitions/alfresco-core.yaml) die eine JavaScript API Library erzeugt, welche als Wrapper für die API Requests genutzt werden kann und auch wird in [ADF Components Github](https://github.com/Alfresco/alfresco-ng2-components).

Auch cool ist, [Postman](https://www.postman.com/automated-testing) bietet eine Importierfunktion für OpenApi Files. Dann wird daraus gleich eine Collections erzeugt. Das ist sehr praktisch, wenn man anfangen möchte die Requests in Postman zu schreiben.

# Server Generierung
In diesem Teil erzähle ich mehr über meine Implementierung in [Github](https://github.com/mmuller88/restic-backup-restore-docker/). Der [OpenApi Generator](https://github.com/OpenAPITools/openapi-generator-cli) ist ein mächtiges Tool zum erzeugen von Client Libs und Server Stubs von OpenApi Spezifikationen wie der bei mir im Repo ./restic.yaml . Zurzeit interessiert mich aber lediglich die Server Stub Generierung. Es kann aus einer Reihe von verschiedenen Server Technologien wie Go, Kotlin, Java, JavaScript ausgewählt werden. Ich habe mich speziell für den NodeJS Express Server entschieden. Um den Server zu generieren wird der folgenden Befehl in ./build_server ausgeführt:

```BASH
PWD=$(pwd)
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
-i /local/restic.yaml \
-g nodejs-express-server \
-o local/server
```

Ein zusätzlicher Bonus. Der NodeJS Express Server generiert auch eine Swagger UI die dann erreichbar ist auf /api-doc . Da ich bei der Servergenerierung die Handler für die Endpoints nicht immer wieder neue Implementieren möchte, habe ich diese in einem ausgewiesenem Ordner ./handlers untergebracht . Dann muss im OpenApi Spec nur noch drauf verwiesen werden:

```YAML
operationId: getSnapshots
description: List all snapshots
x-eov-operation-handler: handlers/DefaultController
```

Das Property x-eov-operation-handler verweist auf die Handlerfunktion. Der ./handlers Ordner muss dann nur noch in die Docker Image kopiert werden.

# Testing
Zum Testen verwende ich die neue GitHub Build Engine GitHub Actions bei dem Workflows generiert werden. Ich habe schon in meinem vorherigen Projekt wobeies um einen [Let's Encrypt SSL Docker Companion](https://martinmueller.dev/alf-lets-encrypt-eng) GitHub Actions ausgiebig getestet und für gut empfunden. In meinen Test Workflow unter ./.github/workflows/action.yml wir die Image mittels Docker Compose gestartet und ausgiebig mit zur Hilfenahme von Postman getestet. Falls du dich mehr für automatisierte Tests mit Postman interessierst klick einfach [hier](https://martinmueller.dev/tags/postman)

# Zusammenfassung
Die Erstellung von REST Servern ist normalerweise ein aufwändiger Prozess, welcher das Schreiben jeder Menge Code benötigt. Es müssen Request Parameter im Path oder Body auf Richtigkeit validiert werden. Oder Url Mapping Algorithmen mit Request und Response Handlerlogiken ausgestattet werden. Und damit der Benutzer des REST Servers nicht verzweifelt sollte die REST API gut dokumentiert sein. All diese Aufgaben und noch viele mehr kann der OpenApi Ansatz lösen. 

Mit tollen Arbeiten wie dem [OpenApi Generator](https://github.com/OpenAPITools/openapi-generator-cli) lassen sich problemlos Rest Server generieren und mittels Swagger HTML UI dokumentieren. Auch kann der REST Server dann problemlos getestet werden zum einen direkt in der Swagger HTML UI mit der try out Funktion und zum anderen können direkt Postman Tests aus dem OpenApi Spec File generiert werden. Die Arbeit mit OpenApi spec is sehr spannen für mich und ich hoffe, ich konnte euch animieren auch mal OpenApi Technologien auszuprobieren. Lasst mich hören wie es bei euch lief!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>