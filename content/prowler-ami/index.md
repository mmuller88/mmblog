---
title: Security, Best Practice und Hardening Checks mit Prowler
show: 'no'
date: '2021-08-24'
image: 'logo.png'
tags: ['de', '2021', 'github', 'prowler', 'aws', 'cdk', 'security'] #nofeed
engUrl: https://martinmueller.dev/prowler-ami-eng
pruneLength: 50
---

Hi Leute!

Entwickeln in AWS macht Spaß und die Möglichkeiten coole Sachen zu bauen, scheinen unendlich. Aber sind diese tollen Sachen sicher und folgen sie AWS's Best Practices? Mit der [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) kannst du du mit weit über 180 Checks für viele Services in all deinen Regionen genau das überprüfen. Für nur $1 erstellt dir eine Ec2 Instanz, gestartet mit der Prowler AMI, den [cdk-prowler](https://github.com/mmuller88/cdk-prowler) in deinen Account. Dabei wird automatisch ein CodeBuild gestartet der die Checks ausführt. Am Ende erhältst du eine Auswertung der Checks. Die Auswertung enthält Angaben ob der Check erfolgreich war, die Severity, eine Risikobeschreibung und wie Abhilfe geschaffen werden kann.

![HTML Report](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/prowler-ami/html-out.png)

Im nächsten Abschnitt erkläre ich wie genau Prowler die Checks durchführt.

# Prowler Scan
Die Prowler AMI verwendet das Github [Prowler Tool](https://github.com/toniblyx/prowler). Wenn ihr lokal Prowler mal ausprobieren wollt, verwendet die Anweisungen aus der [Readme](https://github.com/toniblyx/prowler#requirements-and-installation). Prowler kann dann wahlweise als Script mit `./prowler` oder als Docker Container ausgeführt werden. Prinzipiell durchläuft Prowler dann die Checks mit der AWS CLI aus dem [check Folder](https://github.com/toniblyx/prowler/tree/master/checks).

Nach dem Durchlauf der Checks wird ein HTML Report in einen S3 Bucket mit Namen prowleraudit-stack-prowlerauditreportbucket gespeichert (siehe Bild von oben). Der HTML Report listet nun alle Findings der durchgeführten Checks auf. Diese können seit kürzlich releasten Prowler Version 2.5.0 nun auch gefiltert werden.

# Run Prowler mit AMI
Wie Eingangs erwähnt könnt ihr Prowler mit meiner [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) in euren Account deployen. In diesen Abschnitt erkläre ich euch wie genau das geht.

Zuerst klickt ihr natürlich auf den [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) Link und subscribed zu der AMI. Das Subscriben dauert einen kleinen Moment. Nachdem die Subscription abgeschlossen ist klickt auf "Continue to Configure". Wählt dort nun die neueste Prowler Version aus und die Region in der ihr die Prowler Checks durchführen wollt. Anschließend klickt auf "Continue to Launch". Nun ganz wichtig bei Choose Action müsst ihr "Launch through Ec2" auswählen. Nun werdet ihr auf Ec2 in der AWS Console weitergeleitet.

Einfach den vorausgewählten Instance Typen auswählen welcher t2.micro sein sollte. Dann auf "Next: Configure Instance Details" klicken. Nun ganz wichtig! Bei der IAM role braucht ihr eine Ec2 Role die Administrator Privilege hat. Falls die Role noch nicht existiert klickt auf "Create new IAM role" und erstellt eine AWS service Role für Ec2 mit der AdministratorAccess Policy. Die Prowler AMI braucht diese Permission um den CDK stack bei euch deployen zu dürfen.

Alternativ könnt ihr Prowler auch direkt über die Ec2 AWS Console aufrufen. Dafür einfach in der AWS Console auf Ec2 wechsel --> Instances --> Launch Instances und sucht dann nach Prowler. Der Rest verhält sich genauso wie im vorherigen Abschnitt beschrieben.

# Rerun Prowler mit AMI
Um erneut den Prowler Scan durchzuführen, müsst ihr einfach die AMI bzw. die Ec2 Instanz mit der AMI nochmal ausführen. Der Prowler Stack wird somit veranlasst den Scan nochmal durchzuführen.

# Zusammenfassung
Prowler ist ein tolles Tool zum überprüfen des AWS Accounts. Mit weiter über 100 Checks gibt es mir nützliches Feedback über Einstellungen die nicht Best Practices entsprechen. Somit erreiche ich eine höhere Sicherheit in meinen AWS Accounts. Mit meiner [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) ist es dazu noch kinderleicht das Tool im Account auszuführen. Probiert gerne die Prowler AMI aus und berichtet mir eure Erfahrung :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>