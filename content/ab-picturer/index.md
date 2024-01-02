---
title: DRAFTING!! Make your picture rock with the AB Picturer 
show: "no"
date: "2024-01-05"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=ab&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=ab&state=visitor"
tags: ["eng", "2024", "aws", "abpicturer", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/ab-picturer
pruneLength: 50
---

Pictures are crucial for effective advertising! With AI, generating pictures has become incredibly easy. But how can you determine if a picture is rocking your audience or not? You can try A/B Picture Testing. A/B Picture Testing involves using two different picture variants and pitting them against each other. The picture variant that performs better will be selected to improve visitor numbers.

## My A/B Picture Use Case

I like to write technical blog posts on my [blog](https://martinmueller.dev). For those post I like to use a picture which can be used as a thumbnail and main picture for the post.

![martinmueller.dev blog](https://github.com/mmuller88/mmblog/raw/master/content/ab-picturer/blog.png)

Actually it is super easy to create pictures with the help of like ChatGPT. I'll simply prompting it like `Make a cute cloud singing "I've got the power". Keep the ratio of 1000:420.` and it generates beautiful picture I love to useThe ratio 1000:420 is specifically good for sharing your posts on social medias.

I build a tool I call **AB Picturer**. With that I can measure performance of the picture variants. In the next section I explain how it works.

## How does my AB Picturer works?

Use picture Urls to collect information like when the picture was previewed and when the user decided to open the post. That process is called Click-Through. AB Picturer can then calculate the Click-Through-Rate (CTR) for each picture. The picture with the higher CTR wins and can be used as the main picture for the post.

The basic concept is to have two picture urls which are part of the AB Picturer Flow. The first is for the picture preview and the second for the picture visitor. I'll describe those more in detail now.

### AB Picturer Flow

The picture preview url is the beginning of the AB Picturer Flow. When the user views the preview url via your thumbnail or social media post the flow starts. The user session gets stored and if the user uses the picture visitor url that counts as Click-Through.

### AB Picturer Dashboard

The AB Picturer Dashboard shows you the CTR and other statistics for each picture. The picture with the higher CTR wins and can be used as the main picture for the post. So far it is only a very simple dashboard but I plan to improve it in the future.

![Pateron](https://github.com/mmuller88/mmblog/raw/master/content/ab-picturer/dashboard.png)

As you can see I simply show both picture variants

## Join the A/B Picturer Discord & Newsletter

I've setup a Discord for helping you guys to try out the A/B Picturer and provide feedback to me. I'm super curious about your feedback as I plan to develop more features based on your needs.

Additionally I think it is pretty cool to be part of a community. So join the [A/B Picturer Discord](https://discord.gg/ZSvMBCUeyA) and let's have fun together.

And please subscribe to my newsletter if you want regularly updates about the A/B Picturer.

In the next section, I will show you how to integrate and use the A/B Picture Testing Tool.

## Integrate AB Picturer in your Blog

It doesn't matter what exact blog post engine you are using as long as they support showing pictures it should work.

### Gastby and the AB Picturer

So on my blog post I have the two urls preview and visitor in the meta section:

```txt
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=sst&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=sst&state=visitor"
```

I then simply render those to the thumbnail, meta tags and post itself:

Here is the snippet for adding it as a thumbnail:

```jsx
const { imagePreviewUrl } = node.frontmatter
...
<img src={imagePreviewUrl} ... />
...
```

See the full example in my [repository](https://github.com/mmuller88/mmblog/blob/master/src/pages/index.js)

Adding it to the [meta tags](https://github.com/mmuller88/mmblog/blob/master/src/templates/blog-post.js):

```jsx
<MetaTags
 title={title}
 description={props.data.markdownRemark.excerpt}
 thumbnail={(thumbnail && url + thumbnail) || imagePreviewUrl}
 url={url}
 pathname={props.location.pathname}
/>
```

And finally adding it to the [post](https://github.com/mmuller88/mmblog/blob/master/src/templates/blog-post.js)

```jsx
{
 imageVisitorUrl && <img src={imageVisitorUrl} alt="Title" />
}
```

That is cool or? It is basically just a src url :)!

## Outlook

I'm a huge fan of the blog post site [dev.to](https://dev.to) . I tried to make the AB Pictures working there but unlucky I failed. I think they are doing some caching for the pictures. I'll try to reach out to them and see if we can make it work.

I could collect more information like where the visitor is referred from or the country the user is from. If you would like to have those and more features, reach out to me in our AB Pictures Discord :)!

## Conclusion

Evaluating your pictures if your audience are liking them is super important. In this post I showed you how you can do it with the AB Picturer.

I am passionate about contributing to Open Source projects. You can find many of my projects on [GitHub](https://github.com/mmuller88) that you can already benefit from.

If you found this post valuable and would like to show your support, consider supporting me back. Your support will enable me to write more posts like this and work on projects that provide value to you. You can support me by:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Pateron](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
