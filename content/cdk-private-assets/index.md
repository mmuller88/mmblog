---
title: Private S3 Assets mit Cloudfront, Lambda@Edge und AWS CDK
show: 'no'
date: '2022-02-13'
image: 'title.png'
tags: ['de', '2022', 'kreuzwerker', 'nofeed', 'cdk'] #nofeed
engUrl: https://martinmueller.dev/first-week-xw-eng
pruneLength: 50
---

Moin,

Private S3 Assets wie Bilder oder Videos sind ein oft benötigtes Feature für z.B. Apps. Nachdem sich der User eingeloggt hat sollen Bilder angezeigt werden die nur für ihn verfügbar sind und logischerweise sich in einem S3 Bucket. Dieser S3 Bucket darf natürlich nicht öffentlich verfügbar sein.

Die bisherige Lösung für so ein Szenario sind [presigned URLs](https://medium.com/@aidan.hallett/securing-aws-s3-uploads-using-presigned-urls-aa821c13ae8d). Bei presigned URLs handelt es sich um speziell generierte URLs die dem Besitzer der URL den Zugriff auf das Asset erlauben. Die presigned URL kann dann z.B. so aussehen:

```
https://presignedurldemo.s3.eu-west-2.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJJWZ7B6WCRGMKFGQ%2F20180210%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180210T171315Z&X-Amz-Expires=1800&X-Amz-Signature=12b74b0788aa036bc7c3d03b3f20c61f1f91cc9ad8873e3314255dc479a25351&X-Amz-SignedHeaders=host
```

Mhh wenn ich aber doch schon eine Userverwaltung mit z.B. AWS Cognito habe wäre es dann nicht viel eleganter wenn ich einfach mittels User JWT Token auf solche private Assets zugreifen könnte? Ja absolut! Und um den Programmieraufwand gering zu halten kann dafür Cloudfront und Lambda@Edge benutzt werden.

In diesem Blogpost möchte ich euch beschreiben wie zusammen mit Cloudfront und Lambda@Edge einen Proxy bauen kann, der es authentisierten Usern erlaubt auf S3 Asset Urls wie z.B. https://image.example.com/funny.png zuzugreifen. Wenn der dafür benötigte Token dann auch noch als Cookie gespeichert wird, kann man sogar das HTML img Tag z.B. <img src="https://image.example.com/funny.pic">funny.pic</img> verwenden.

## Lösungsansatz

Ein Diagram beschreibt am besten wie genau der Cloudfront Proxy funktioniert.

![Diagram](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-private-assets/cdkPrivateAssetBucket.png)

Der Flow zum Zugriff auf das Asset is sehr simpel. Zuerst holt sich der User ein gültiges Cognito Token. Das kann z.B. über die Amplify UI, der hosted Cognito login UI oder einer Lambda passieren. Dann wird auf das Asset mittels Request zugegriffen z.B. https://image.example.com/funny.png . Der Request benötigt ein Cookie mit dem Namen token und dem Cognito Token als Value.

Zur Erinnerung das ist notwendig wenn man das HTML img tag verwenden möchte. Das img Tag akzeptiert keine Tokens im Header. Alternativ könnte man das Token wohl noch als URL Parameter codieren.

## AWS CDK Custom Construct

* bin gerade dabei dafür ein AWS CDK Custom Construct zu schreiben
* Lässt sich dann einfach integrieren in eure CDK Apps
* Falls ihr noch gewissen Features braucht erstellt Issue und eventuell nen PR oder schreibt mir

## Zusammenfassung

...

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
