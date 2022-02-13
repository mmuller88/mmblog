---
title: Private S3 Assets with Cloudfront, Lambda@Edge and AWS CDK
date: '2022-02-13'
image: 'bucket.jpg'
tags: ['de', '2022', 'kreuzwerker', 's3', 'cdk'] #nofeed
gerUrl: https://martinmueller.dev/cdk-private-assets
pruneLength: 50
---

Hi,

Private S3 assets like images or videos are a frequently needed feature for apps. After the user has logged in, those private assets are shown to him. These are typically stored in an S3 bucket. This S3 bucket must not be publicly available.

The common solution for such a scenario are [presigned URLs](https://medium.com/@aidan.hallett/securing-aws-s3-uploads-using-presigned-urls-aa821c13ae8d). Presigned URLs are specially generated URLs that allow the owner of that URL to access the asset. A presigned URL could look like this:

```txt
https://presignedurldemo.s3.eu-west-2.amazonaws.com/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJJWZ7B6WCRGMKFGQ%2F20180210%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180210T171315Z&X-Amz-Expires=1800&X-Amz-Signature=12b74b0788aa036bc7c3d03b3f20c61f1f91cc9ad8873e3314255dc479a25351&X-Amz-SignedHeaders=host
```

Mhh but if I already have a user management system like AWS Cognito, wouldn't it be more elegant if I could simply access private assets using the user JWT tokens? Yes absolutely! And to keep the programming effort low Cloudfront and Lambda@Edge can be used.

In this blogpost I want to explain how Cloudfront and Lambda@Edge can be used to build a proxy that allows authenticated users to access S3 asset urls such as https://image.example.com/funny.png . If the token needed for this is then also stored as a cookie, you can even use the HTML img tag like <img src="https://image.example.com/funny.png">funny.png</img>.

## Solution Approach

This diagram best describes how the Cloudfront Proxy works.

![Diagram](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-private-assets/cdkPrivateAssetBucket.png)

The flow to access the asset is very simple. First the user gets a valid Cognito token. This can be done via the Amplify UI, the hosted Cognito login UI or a Lambda. Then the asset is accessed via a GET request, for example https://image.example.com/funny.png . The request requires a cookie with the name token and the Cognito token as value.

Remember this is necessary if you want to use the HTML img tag. The img tag does not accept tokens in the header. Alternatively, you could code the token as URL parameter. As a curl command it would look something like this:

```bash
curl --location --request GET "https://image.example.com/funny.png" --cookie "Cookie: token=ey..."
```

For testing the URL, I recommend Postman because it can also display images in the response.

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

With the optional **assetBucketName** a name is assigned to the created bucket. If you omit this property, the name is determined by the CDK naming algorithm, a composition of stackname, constructname and random postfix. If you prefer to import an existing bucket you can do this with **assetBucketNameImport**. In this case the previous property is ignored.

The **customDomain** object with the properties **zone** and **domainName** allows the assignment of a custom domain like e.g. https://mail.example.com . It is important that the zone is in control of the running AWS account and that the domainName is also part of the zone. Last but not least the user pool infos are specified with **userPoolId** and **userPoolClientId**. This way the Lambda@Edge knows against where the token has to be verified.

## Outlook

It would be cool if other identity providers besides Cognito like Google or Okta could be used to validate the token.

What is also missing are private user scopes. Those would be basically subdirectories in the private bucket which only the validated user can access. Currently, the validated users can still access all assets in the bucket.

It would also be great to try Cloudfront Function instead of Lambda@Edge. Cloudfront Functions are a slimmed-down version of Lambda@Edge. They have reduced functionality and resources. But they are cheaper in general. I am very confident that Cloudfront Functions will be sufficient to validate the tokens.

If you already need one of the features mentioned here or have other cool feature ideas feel free to write me or create issues directly in the Construct Repo https://github.com/mmuller88/cdk-private-asset-bucket . You can also write PRs to get your feature implemented.

## Summary

Private S3 assets like images or videos are almost always needed in modern apps. Until now they could only be kept private via unhandy presigned URLs. But this solution doesn't seem optimal as it doesn't use user tokens to access the assets. Here in this blog post, I presented a variant where you can make your private S3 assets available with Cognito user tokens. If you like this post or if you have any questions or suggestions, feel free to write me.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to English and saving me tons of time :).

To the wonderful readers of this article, I'm saying that feedback of any kind is welcome. In the future, I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>