---
title: Private S3 Assets mit Cloudfront, Lambda@Edge und AWS CDK
show: 'no'
date: '2022-02-06'
image: 'title.png'
tags: ['de', '2022', 'kreuzwerker', 'nofeed', 'cdk'] #nofeed
engUrl: https://martinmueller.dev/first-week-xw-eng
pruneLength: 50
---

Moin,

* Private Assets wie Images sollen für User von Cognito verfügbar sein
* Bisherige Lösungen nutzten immer eine presigned S3 URL
* Nachteil ist, dass diese Lösung keine saubere Integration in ein Cognito darstellt und lediglich eine temporär verfügbarer Link erzeugt wird
* Viel schöner wäre es wenn man über ein von Cognito generiertes valides User Token and das begehrt S3 Asset gelangt.
* Das ist möglich mit der Kombination von Cloudfront und Lambda@Edge

## AWS CDK

...

## Zusammenfassung

...

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
