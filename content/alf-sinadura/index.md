---
title: Alfresco Signaturen mit Sinadura
show: 'no'
date: '2020-08-14'
image: 'alfcdk.jpg'
tags: ['de', '2020', 'acs', 'alfresco', 'docker-compose', 'nofeed']
engUrl: https://martinmueller.dev/alf-backup-eng
pruneLength: 50
---

Hi Alfrescans.

Digitale Signaturen sind eine der meist genutzten Formen zum Integritätscheck im Internet. Was einem dort gleich in den Sinn kommt, sind die SSL Zertifikate zum aufrufen von HTTPS Urls. Dort muss quasi überprüft werden ob das SSL Zertifikat nicht gefälscht ist und das geschieht mit einer digitalen Signatur.

Alfresco bietet keine Signierfunktion ootb, aber mit dem Open Source Addon [Sinadura](https://github.com/zylklab/alfresco-sinadura) (Repo und Share) kann diese Funktion nachgerüstet werden. Eine Signierfunktion in Alfresco hat zwei wesentlich Vorteile. Der erste wäre eine erhöhte Sicherheit, da es so fast unmöglich gemacht wird Dokument in Alfresco zu fälschen z.B. durch einen Angreifer der ins System gelangt. 

Zweitens könnte somit der normale Use Case Scope, also nur innerhalb einer Firma zu bleiben, verlassen werden und Personen die nicht in der Firma arbeiten wie z.B. Kunden mit ins Content Management System mit einbezogen werden. Durch die Verwendung von Signaturen kann ein verbessertes Vertrauensverhältniss gesichert werden.

In den nächsten Abschnitten möchte ich gerne mehr über das Addon Sinadura erzählen.

# Sinadura Addon
...

# ACS 6.2 Kompatibel
* Docker yeah

# Zusammenfassung
* Cool Addon
* Thx to Sponsor

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>