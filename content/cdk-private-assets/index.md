---
title: Private S3 Assets mit Cloudfront, Lambda@Edge und AWS CDK
show: 'no'
date: '2022-02-13'
image: 'bucket.jpg'
tags: ['de', '2022', 'kreuzwerker', 's3', 'cdk'] #nofeed
engUrl: https://martinmueller.dev/cdk-private-assets-eng
pruneLength: 50
---

Moin,

Private S3 Assets wie Bilder oder Videos sind ein oft benötigtes Feature für z.B. Apps. Nachdem sich der User eingeloggt hat, sollen Bilder die nur für ihn verfügbar sind, angezeigt werden. Diese befinden sich typischerweise in einem S3 Bucket. Dieser S3 Bucket darf nicht öffentlich verfügbar sein.

Die bisherige Lösung für so ein Szenario sind [presigned URLs](https://medium.com/@aidan.hallett/securing-aws-s3-uploads-using-presigned-urls-aa821c13ae8d). Bei presigned URLs handelt es sich um speziell generierte URLs die dem Besitzer der URL den Zugriff auf das Asset erlauben. Die presigned URL kann dann z.B. so aussehen:

```txt
https://presignedurldemo.s3.eu-west-2.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJJWZ7B6WCRGMKFGQ%2F20180210%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180210T171315Z&X-Amz-Expires=1800&X-Amz-Signature=12b74b0788aa036bc7c3d03b3f20c61f1f91cc9ad8873e3314255dc479a25351&X-Amz-SignedHeaders=host
```

Mhh wenn ich aber doch schon eine User-Verwaltung z.B. AWS Cognito habe, wäre es dann nicht viel eleganter wenn ich einfach mittels User JWT Token auf solche private Assets zugreifen könnte? Ja absolut! Und um den Programmieraufwand gering zu halten kann dafür Cloudfront und Lambda@Edge benutzt werden.

In diesem Blogpost möchte ich euch erklären wie mit Cloudfront und Lambda@Edge ein Proxy gebaut werden kann, der es authentisierten Usern erlaubt auf S3 Asset Urls wie z.B. https://image.example.com/funny.png zuzugreifen. Wenn der dafür benötigte Token dann auch noch als Cookie gespeichert wird, kann man sogar das HTML img Tag z.B. 

```html
<img src="https://image.example.com/funny.png">funny.png</img> 
```
verwenden.

## Lösungsansatz

Dieses Diagram beschreibt am besten wie der Cloudfront Proxy funktioniert.

![Diagram](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-private-assets/cdkPrivateAssetBucket.png)

Der Flow zum Zugriff auf das Asset is sehr simpel. Zuerst holt sich der User ein gültiges Cognito Token. Das kann z.B. über die Amplify UI, der hosted Cognito login UI oder einer Lambda passieren. Dann wird auf das Asset mittels GET Request zugegriffen z.B. https://image.example.com/funny.png . Der Request benötigt ein Cookie mit dem Namen token und dem Cognito Token als Value.

Zur Erinnerung das ist notwendig wenn man das HTML img tag verwenden möchte. Das img Tag akzeptiert keine Tokens im Header. Alternativ könnte man das Token wohl noch als URL Parameter codieren. Als curl command würde es in etwa so aussehen:

```bash
curl --location --request GET "https://image.example.com/funny.png" --cookie "Cookie: token=ey..."
```

Zum Testen der URL empfehle ich aber lieber Postman da es auch Bilder im Response vernünftig anzeigen kann.

## AWS CDK Custom Construct

Ich habe ein AWS CDK Custom Construct geschrieben um private Assets via Cognito Token einfach zu integrieren. In GitHub auf https://github.com/mmuller88/cdk-private-asset-bucket könnt ihr genau sehen wie das Construct funktioniert. Das Construct hat ein recht einfach Interface:

```ts
export interface PrivateAssetBucketProps {
  readonly assetBucketName?: string;
    /**
     * if you want to use an imported bucket instead
     */
  readonly assetBucketNameImport?: string;
  readonly customDomain?: CustomDomain;
  readonly userPoolId: string;
  readonly userPoolClientId: string;
}

export interface CustomDomain {
  readonly zone: route53.IHostedZone;
    /**
     * domainName needs to be part of the hosted zone
     * e.g.: image.example.com
     */
  readonly domainName: string;
}
```

Mit dem optionalen **assetBucketName** wird dem erzeugtem Bucket ein Namen vergeben. Lässt man diese Property aus wird der Name vom CDK Naming-Algorithmus bestimmt also eine Zusammensetzung von Stackname, Constructname und zufälligem postfix. Möchte man aber lieber einen existierenden Bucket importieren kann das mit **assetBucketNameImport** gemacht werden. In diesem Fall wird die vorherige Property ignoriert.

Das **customDomain** Object mit den Properties **zone** und **domainName** erlaubt die Vergabe eines Custom Domain wie z.B. https://mail.example.com . Wichtig hierbei ist, dass die Zone sich in Kontrolle des ausführenden AWS Accounts befindet und das auch der domainName ein Teil der Zone ist. Zu guter Letzt werden die User Pool infos mit **userPoolId** und **userPoolClientId** angegeben. Dadurch weiß die Lambda@Edge gegen wohin das Token verifiziert werden muss.

## Ausblick

Es wäre cool wenn auch andere Identity Provider außer Cognito wie eventuell Google oder Okta verwendet werden könnten zur Validierung des Tokens.

Was auch noch fehlt sind private User Scope. Das wären quasi Unterverzeichnisse im privaten Bucket auf welcher dann nur der validierte User zugreifen kann. Zurzeit können die validierten User nämlich noch auf alle Assets im Bucket zugreifen.

Auch wäre es super mal zu versuchen inwiefern Cloudfront Function sich eignet anstelle von Lambda@Edge. Cloudfront Functions sind quasi eine abgespeckte Version von Lambda@Edge. Diese haben eine reduzierte Funktionalität und reduzierte Ressourcen. Sind dafür aber günstiger pro Aufruf. Ich bin sehr zuversichtlich, dass Cloudfront Functions ausreichen zum validieren der Tokens.

Falls ihr eines der hier angesprochenen Features bereits benötigt oder andere coole Feature Ideen habt schreibt mir gerne oder erzeugt direkt Issues im Construct Repo https://github.com/mmuller88/cdk-private-asset-bucket . Gerne könnte ihr auch PRs schreiben um euer Feature eingebaut zu bekommen.

## Zusammenfassung

Private S3 Assets wie Bilder oder Videos werden fast immer in modernen Apps benötigt. Bisher konnten solche nur per umständlichen presigned URLs private gehalten werden. Diese Lösung scheint aber nicht optimal da sie keine User Tokens verwendet um auf die Assets zuzugreifen. Hier in diesem Blogpost habe ich euch eine Variante vorgestellt bei der man mit Cognito User Tokens seine privaten S3 Assets Verfügbar machen kann. Wenn euch der Beitrag gefällt oder ihr Fragen und Anregungen habt, schreibt mir doch gerne.

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
