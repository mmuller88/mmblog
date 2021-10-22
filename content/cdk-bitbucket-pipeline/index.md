---
title: Eine CDK BitBucket Staging Pipeline
show: 'no'
date: '2021-10-25'
# image: 'logo.png'
tags: ['de', '2021', 'bitbucket', 'aws', 'cdk', 'nofeed'] 
engUrl: https://martinmueller.dev/cdk-bitbucket-pipeline
pruneLength: 50
---

Seit einiger Zeit arbeite ich für einen Kunden mit sehr aufregenden AWS CDK Aufgaben. Der Kunde ist stark im Atlassian Ecosystem unterwegs. Zum hosten des Codes wird da natürlich BitBucket verwendet. Nun will der Kunde stärker in den DevOps bereich vordringen und seine AWS Deployments auch mit AWS CDK managen. Dafür soll die vorhandene AWS Infrastruktur in CDK übersetzt werden. Zusätzlich soll eine Staging Deployment-Pipeline die CDK Apps auf den Stages dev, qa und prod deployen. Gerne helfe ich da weiter :).

# Disclaimer
Hier folgt ein kleiner Disclaimer. Auch wenn ich bereits sehr viel Erfahrung mit CDK habe (siehe TAGS CDK), kenne ich mich so noch gar nicht mit BitBucket aus. Von daher weiß ich nicht ob mein Ansatz der ideale ist, aber zum Zeitpunkt des Schreibens dieses Artikels, funktioniert dieser ganz gut :).

Ich schreibe diesen Artikel hauptsächlich da ich keine anderen hilfreichen Posts oder Anweisungen gefunden habe, wie man vernünftig eine CDK Staging Deployment-Pipeline baut mit BitBucket. Falls du also vielleicht eine ähnliche Aufgabe hast, kann ich dir damit den Einstieg eventuell erleichtern.

# Welche Pipeline?
* Musstens uns entscheiden zwischen AWS CodeBuild und dem dafür genialen CDK pipeline construct oder alles in der bitbucket pipeline selber machen.
* Haben uns für das zweite entschieden um bei nur einer Pipelinetechnologie zu bleiben und nur einen Anlaufpunkt zu benötigen
* Kunde verwendet Monorepo

# Beispiel S3 Static Website Hosting
* Kunde hat ReactTS App und hosted diese in einem S3 Static Website Bucket.
* Soll über Staging

## Ordnerstrucktur
* STAGE ist entweder dev, qaprod prod
devops/${STAGE}/website

* devops/src
* für main.ts für Synth step
* Etwas komisch, aber erhoffen uns so eine bessere Übersichtlichkeit. Ändern das vielleicht.

## Scripte
* Scripte in package.json unter devops/package.json, devops/${STAGE}/website/package.json

# bitbucket pipeline
* yml
....

# What is next?
* Dashboard für urls, z.B. Cloudfront, Hasura urls mit Commit version

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>