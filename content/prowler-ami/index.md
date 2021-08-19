---
title: Security, Best Practice und Hardening Checks mit Prowler
show: 'no'
date: '2021-08-22'
image: 'logo.png'
tags: ['de', '2021', 'github', 'prowler', 'aws', 'cdk', 'security', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/prowler-ami-eng
pruneLength: 50
---

Hi Leute!

Entwickeln in AWS macht Spaß und die Möglichkeiten coole Sachen zu bauen, scheinen unendlich. Aber sind diese tollen Sachen sicher und folgen sie AWS's Best Practices? Mit der [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) kannst du du mit weit über 180 Checks für viele Services in all deinen Regionen genau das überprüfen. Für nur $1 erstellt dir eine Ec2 Instanz gestartet mit der Prowler AMI den [cdk-prowler](https://github.com/mmuller88/cdk-prowler) in deinen Account. Dabei wird automatisch ein CodeBuild gestartet der die Checks ausführt. Am Ende erhälst du dann eine Auswertung der Checks. Die Auswertung enthält angaben ob der Check erfolgreich war, die Severity, eine Risikobeschreibung und wie Abhilfe geschaffen werden kann.

![HTML Report](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/prowler-ami/html-out.png)

Im nächsten Abschnitt erkläre ich wie genau Prowler die Checks durchführt.

# Prowler Scan
Die Prowler AMI verwendet das Github [Prowler Tool](https://github.com/toniblyx/prowler). Wenn ihr lokal Prowler mal ausprobieren wollt, verwendet die Anweisungen aus der [Readme](https://github.com/toniblyx/prowler#requirements-and-installation). Prowler kann dann wahlweise als Script mit `./prowler` oder als Docker Container ausgeführt werden. Prinzipiell durchläuft Prowler dann die Checks mit der AWS CLI aus dem [check Folder](https://github.com/toniblyx/prowler/tree/master/checks).

Nach dem Durchlauf der Checks wird ein HTML Report in einen S3 Bucket mit Namen prowleraudit-stack-prowlerauditreportbucket gespeichert (siehe Bild von oben). Der HTML Report listet nun alle Findings der durchgeführten Checks auf. Diese können seit kürzlich releasten Prowler Version 2.5.0 nun auch gefiltert werden.

# Run Prowler mit AMI
Wie Eingangs erwähnt könnt ihr Prowler mit meiner [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) in euren Account deployen. In diesen Abschnitt erkläre ich euch wie genau das geht.
* Auf Link klicken, auswählen
* Ec2Role mit Adminrechten
* Warten bis Cloudformation Stack erstellt

## Direkt Link
...

## Ec2 Console
...

# Rerun Prowler mit AMI
Um erneut den Prowler Scan durchzuführen, müsst ihr einfach die AMI bzw. die Ec2 Instanz mit der AMI nochmal ausführen. Der Prowler Stack wird somit veranlasst den Scan nochmal durchzuführen.

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>