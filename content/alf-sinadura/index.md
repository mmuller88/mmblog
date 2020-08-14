---
title: Alfresco Signaturen mit Sinadura
show: 'no'
date: '2020-08-14'
image: 'sig.png'
tags: ['de', '2020', 'addon', 'acs', 'alfresco', 'docker-compose', 'nofeed']
engUrl: https://martinmueller.dev/alf-backup-eng
pruneLength: 50
---

Hi Alfrescans.

Digitale Signaturen sind eine der meist genutzten Formen zum Integritätscheck im Internet. Integritätscheck meint hier ob es sich bei dem jeweiligen Dokument um das Originale une damit keine Fälschung oder geänderten Version handelt. Ein Beispiel sind die SSL Zertifikate die zum aufrufen von HTTPS Urls benötigt werden. Dort muss quasi überprüft werden ob das SSL Zertifikat nicht gefälscht ist und das geschieht mit einer digitalen Signatur.

Alfresco bietet keine Signierfunktion ootb, aber mit dem Open Source Addon [Sinadura](https://github.com/zylklab/alfresco-sinadura) (Repo und Share) kann diese Funktion nachgerüstet werden. Auf YouTube existiert ein kurzes [Video](https://www.youtube.com/watch?feature=player_embedded&v=MCTpOKZtTgw) über die Signierfunktion von Sinadura. Eine Signierfunktion in Alfresco hat zwei wesentlich Vorteile. Der erste wäre eine erhöhte Sicherheit, da es so fast unmöglich gemacht wird Dokument in Alfresco zu fälschen z.B. durch einen Angreifer der ins System gelangt.

Zweitens könnte somit der normale Use Case Scope, also nur innerhalb einer Firma zu bleiben, verlassen werden und Personen die nicht in der Firma arbeiten wie z.B. Kunden mit ins Content Management System mit einbezogen werden. Durch die Verwendung von Signaturen kann ein verbessertes Vertrauensverhältniss gesichert werden.

In den nächsten Abschnitten möchte ich gerne mehr über das Addon Sinadura erzählen.

# Sinadura Addon
Sinadura.net ist ein Open Source Projekt für digital Signatur Software. Dafür läuft normalerweise ein Sinadura Server für den Signatur Check und Erstellung. Ein Client connected sich dann zu dem Sinadura Server.

Sinadura besitzt ein Alfresco Addon Repo in GitHub https://github.com/zylklab/alfresco-sinadura welches bisher allerdings nur mit ACS Community und Enterprise Version 5 funktioniert. Toll wäre es natürlich auch neuere Alfresco Version ggf. mit Docker zu unterstützen. Ich habe es mir also zu Aufgabe gemacht dieses tolle Addon mit ACS 6.2 kompatibel zu machen.

# ACS 6.2 Kompatibel
Aktuell basiert das Alfresco Sinadura Addon in https://github.com/zylklab/alfresco-sinadura noch auf SDK 2.2.0 und ACS 5 . Es scheint das SDK 2.2.0 nicht mehr ootb. funktioniert und einige nötige Artefakte im Alfresco Nexus nicht mehr bereitstehen. Nur mir viel Mühe wäre es wohl möglich die Sinadura Amps noch mit SDK 2.2.0 zu kompilieren. Also habe ich mich entschlossen die neuste SDK Version 4.1.0 zu verwenden.

Die Migration, welche ihr in meinem Git Repo findet unter https://github.com/mmuller88/alfresco-sinadura-6X-pmgatech, hat super funktioniert. Wie eine Alfresco SDK 4.1.0 Build gebaut werden kann ist sehr gut beschrieben im offiziellen [Alfresco SDK Repo](https://github.com/Alfresco/alfresco-sdk). SDK 4.1.0 basiert stark auf Docker und nutzt Docker Compose als Container Orchestrierer.

Etwas herausfordernd war die Migration der AMP Struktur nach 4.1.0 da einige Datein nun an anderer Stelle platziert werden müssen als noch in 2.2.0 . Auch muss ich einen eigenen Service für die sinaduraCloud Endpunkt schreiben da diese nur mit Java 8 funktioniert.

# Zusammenfassung
Digitale Signaturen sind ein spannendes Thema und ermöglichen einem Alfresco Document Management System komplett neue Use Cases. Auch interessant könnte der Vorgang des Signierens im Zusammenspiel mit Alfresco Process Service sein.

Vielen Danke für meinen Sponsor www.pmga.tech für die Migrations Arbeiten an Sinadura. Habt ihr spannende Alfresco Projekte an denen ihr arbeitet? Lasst es mich wissen :) !

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>