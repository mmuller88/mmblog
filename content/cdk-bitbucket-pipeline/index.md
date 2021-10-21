---
title: Eine CDK BitBucket Staging Pipeline
show: 'no'
date: '2021-10-25'
# image: 'logo.png'
tags: ['de', '2021', 'bitbucket', 'aws', 'cdk', 'nofeed'] 
engUrl: https://martinmueller.dev/cdk-bitbucket-pipeline
pruneLength: 50
---

* Neuer Kunde. Verwendet BitBucket pipeline für builds
* würde gerne AWS CDK zum managen von Infrastrucktur in verschiedenen Stages verwenden
* stages sind dev, qa und prod

# Disclaimer
* Disclaimer! habe nicht mit bitbucket pipeline vorher gearbeitet und habe bisher immer AWS CodeBuild mit CDK Pipeline Constructe verwendet!
* Schreibe das hier als persöhnliches Tagebuch und weil es nicht viel Infos gibt für cdk bitbucket pipelines

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