---
title: Alfresco Backup und Restoring so einfach wie möglich
show: 'no'
date: '2020-07-26'
image: 'alfcdk.jpg'
tags: ['de', '2020', 'acs', 'alfresco', 'cdk', 'docker-compose']
engUrl: https://martinmueller.dev/alf-cdk-eng
pruneLength: 50
---

Hi Alfrescans.

Heute möchte ich mal ein Thema angehen welches die meisten von uns als sehr anstrengend gar lästig ansehen. Es soll heute mal um Alfresco Backups und Restoring gehen. Alfresco selber macht wenig Vorgaben bzw. ist sehr agnostisch bezüglich Backup und Restoring Strategien. Das macht auch Sinn da diese stark von der jeweiligen IT Infrastrucktur abhängt z.B. welche DB und den dazugehörigen Backuptechnologien genutzt wird oder wo das Alfresco Deployment überhaupt läuft, also ob es z.B. ein Cluster ist, On-Premis oder in der Cloud ist. 

Es gibt also viele Variablen für ein Alfresco Deployment welche eine konkrete Backup und Restoring Strategie erschweren. Allerding gibt es in der Alfresco Dokumentation einige Best Practices welche grobe Backupkonzepte wie cold, hot oder warm Backups erklären. Für mein [Alfresco Provisioner Projekt](https://martinmueller.dev/alf-provisioner), bei dem ich Alfresco als Program as a Service (PaaS) anbieten möchte, soll das Backup und Restoring so einfach wie möglich gestaltet werden. 

Sogar so einfach das in Zukunft der Nutzer selber das Restoring mit wenigen Klicks ausführen kann. Für diesen Ansatz habe ich mir überlegt komplett auf [Restic](https://github.com/restic/restic) als Backup und Restoring Engine zu setzen, unterstützt mit einem Swagger UI Frontend zum durchführen des Restorings. In den nächsten Abschnitt erkläre ich was Restic überhaupt ist und danach welche Strategie ich mit Restic als Backup und Restoring Engine verfolge und umsetze.

# Restic
..

# OpenApi
* call restic commands

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>