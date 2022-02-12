---
title: Private S3 Assets with Cloudfront, Lambda@Edge and AWS CDK
date: '2022-02-13'
image: 'bucket.jpg'
tags: ['de', '2022', 'kreuzwerker', 's3', 'cdk'] #nofeed
gerUrl: https://martinmueller.dev/cdk-private-assets
pruneLength: 50
---

Hi,

Private S3 assets like images or videos are a frequently needed feature for e.g. apps. After the user has logged in, images that are only available to him should be displayed. These are typically located in an S3 bucket. This S3 bucket must not be publicly available.

The previous solution for such a scenario are [presigned URLs](https://medium.com/@aidan.hallett/securing-aws-s3-uploads-using-presigned-urls-aa821c13ae8d). Presigned URLs are specially generated URLs that allow the owner of the URL to access the asset. The presigned URL can then look like this:

```txt
https://presignedurldemo.s3.eu-west-2.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJJWZ7B6WCRGMKFGQ%2F20180210%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180210T171315Z&X-Amz-Expires=1800&X-Amz-Signature=12b74b0788aa036bc7c3d03b3f20c61f1f91cc9ad8873e3314255dc479a25351&X-Amz-SignedHeaders=host
```

Mhh but if I already have a user management e.g. AWS Cognito, wouldn't it be much more elegant if I could simply access such private assets using user JWT tokens? Yes absolutely! And to keep the programming effort low Cloudfront and Lambda@Edge can be used for this.

In diesem Blogpost möchte ich euch erklären wie mit Cloudfront und Lambda@Edge ein Proxy gebaut werden kann, der es authentisierten Usern erlaubt auf S3 Asset Urls wie z.B. https://image.example.com/funny.png zuzugreifen. Wenn der dafür benötigte Token dann auch noch als Cookie gespeichert wird, kann man sogar das HTML img Tag z.B. <img src="https://image.example.com/funny.png">funny.png</img> verwenden.

## Lösungsansatz

Dieses Diagram beschreibt am besten wie der Cloudfront Proxy funktioniert.

![Diagram](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-private-assets/cdkPrivateAssetBucket.png)

Der Flow zum Zugriff auf das Asset is sehr simpel. Zuerst holt sich der User ein gültiges Cognito Token. Das kann z.B. über die Amplify UI, der hosted Cognito login UI oder einer Lambda passieren. Dann wird auf das Asset mittels Request zugegriffen z.B. https://image.example.com/funny.png . Der Request benötigt ein Cookie mit dem Namen token und dem Cognito Token als Value.

Zur Erinnerung das ist notwendig wenn man das HTML img tag verwenden möchte. Das img Tag akzeptiert keine Tokens im Header. Alternatively you could code the token as URL parameter. As a curl command it would look something like this:

```bash
curl --location --request GET "https://image.example.com/funny.png" --cookie "Cookie: token=ey..."
```

For testing the URL I recommend Postman because it can also display images in the response.

## AWS CDK Custom Construct

I wrote an AWS CDK Custom Construct to easily integrate private assets via Cognito Token. You can see exactly how the construct works in GitHub at https://github.com/mmuller88/cdk-private-asset-bucket. The construct has a pretty simple interface:

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

With the optional **assetBucketName** a name is assigned to the created bucket. If you omit this property, the name is determined by the CDK naming algorithm, i.e. a composition of stackname, constructname and random postfix. If you prefer to import an existing bucket you can do this with **assetBucketNameImport**. In this case the previous property is ignored.

The **customDomain** object with the properties **zone** and **domainName** allows the assignment of a custom domain like e.g. https://mail.example.com . It is important that the zone is in control of the running AWS account and that the domainName is also part of the zone. Last but not least the user pool infos are specified with **userPoolId** and **userPoolClientId**. This way the Lambda@Edge knows against where the token has to be verified.

## Outlook

It would be cool if other identity providers besides Cognito like Google or Okta could be used to validate the token.

What is also missing are private user scopes. These would be quasi subdirectories in the private bucket which only the validated user can access. Currently, the validated users can still access all assets in the bucket.

It would also be great to try Cloudfront Function instead of Lambda@Edge. Cloudfront Functions are a slimmed down version of Lambda@Edge. They have a reduced functionality and reduced resources. But they are cheaper per call. I am very confident that Cloudfront Functions will be sufficient to validate the tokens.

If you already need one of the features mentioned here or have other cool feature ideas feel free to write me or create issues directly in the Construct Repo https://github.com/mmuller88/cdk-private-asset-bucket . You can also write PRs to get your feature implemented.

## Summary

Private S3 assets like images or videos are almost always needed in modern apps. Until now they could only be kept private via cumbersome presigned URLs. But this solution doesn't seem to be optimal as it doesn't use user tokens to access the assets. Here in this blogpost I presented you a variant where you can make your private S3 assets available with Cognito user tokens. If you like this post or if you have any questions or suggestions, feel free to write me.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to English and saving me tons of time :).

To the wonderful readers of this article, I'm saying that feedback of any kind is welcome. In the future, I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>