---
title: Make your picture rock with the AB Picturer 
show: "yes"
date: "2024-01-06"
image: "abtesting.png"
tags: ["eng", "2024", "aws", "abpicturer"] #nofeed
# engUrl: https://martinmueller.dev/ab-picturer
pruneLength: 50
---

Images are crucial to effective advertising! AI has made it incredibly easy to create images. But how do you know if an image will move your audience or not? You can try AB Picture Testing. With AB Picture Testing, two different image variants are used and pitted against each other. The one that performs better will be selected to increase traffic. To illustrate this, take a look at the image below, where the audience is separately looking at two different image variants.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/ab-picturer/abtesting.png" alt="drawing" width="400"/>.

## My AB Picture Use Case

I like to write technical blog posts on my [blog] (https://martinmueller.dev). For these posts, I like to use an image that can be used as the thumbnail and main image for the post.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/ab-picturer/blog.png" alt="drawing" width="400"/>.

Creating images has become incredibly easy with tools like ChatGPT. By simply prompting it with a request like "Make a cute cloud that sings "I've got the power" while maintaining a ratio of 1000:420", you can create beautiful images that are perfect for sharing your posts on social media.

I am building a tool called **AB Picturer**. It allows me to measure the performance of the image variations. In the next section I explain how it works.

## How does AB Picturer work?

The AB Picturer uses image urls like https://api.ab-picturer.com?projectId=ab&state=visitor to collect information like when the image was previewed and when the user decided to click on the post. This process is called click-through. AB Picturer can then calculate the click-through rate (CTR) for each image. The image with the higher CTR wins and can be used as the main image for the post.

The basic concept is to have two image urls that are part of the AB Picturer flow. The first is for the image preview and the second is for the image visitor. I'll describe these in more detail now.

### AB Picturer Flow

The preview url is the beginning of the AB Picturer flow. When the user views the preview url via your thumbnail or social media post, the flow starts. The user session is tracked and if the user uses the image visitor url, this counts as a click-through.

### AB Picturer Dashboard

The AB Picturer Dashboard shows you the CTR and other statistics for each image. The image with the higher CTR wins and can be used as the main image for the post. It is a very simple dashboard at the moment, but I plan to improve it in the future.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/ab-picturer/dashboard.png" alt="drawing" width="400"/>

## Join the AB Picturer Discord & Newsletter

I've set up a [Discord](https://discord.gg/ZSvMBCUeyA) for you to try out the AB Picturer and give me feedback. I'm super curious about your feedback as I plan to develop more features based on your needs.

Also, I think it is pretty cool to be part of a community. So join the [AB Picturer Discord](https://discord.gg/ZSvMBCUeyA) and let's have some fun together.

And please subscribe to our [Newsletter](https://app.ab-picturer.com/newsletter) if you want regular updates about AB Picturer.

In the next section I will show you how to integrate and use AB Picturer.

## Integrate AB Picturer into your blog

It doesn't matter what blog post engine you're using, as long as it supports displaying images, it should work.

### Gastby and AB Picturer

So on my blog post I have the two urls preview and visitor in the meta section:

```txt
imagePreviewUrl: "https://api.ab-picturer.com?projectId=sst&state=preview"
imageVisitorUrl: "https://api.ab-picturer.com?projectId=sst&state=visitor"
```

I then simply render these to the thumbnail, meta tags and post itself:

Here is the snippet to add it as a thumbnail:

```jsx
const { imagePreviewUrl } = node.frontmatter
...
<img src={imagePreviewUrl} ... />
...
```

See the complete example in my [repository](https://github.com/mmuller88/mmblog/blob/master/src/pages/index.js)

Add it to the [meta tags](https://github.com/mmuller88/mmblog/blob/master/src/templates/blog-post.js):

```jsx
<MetaTags
 title={title}
 description={props.data.markdownRemark.excerpt}
 thumbnail={(thumbnail && url + thumbnail) || imagePreviewUrl}
 url={url}
 pathname={props.location.pathname}
/>
```

And finally, add it to the [post](https://github.com/mmuller88/mmblog/blob/master/src/templates/blog-post.js)

```jsx
{
 imageVisitorUrl && <img src={imageVisitorUrl} alt="Title" /> }
}
```

This is cool, right? It is basically just a src url :)!

## Outlook

I'm a big fan of the blog post site [dev.to] (https://dev.to). I tried to get the AB pictures to work there but unfortunately I failed. I think they do some caching for the images. I'll try to contact them and see if we can get it to work.

I could collect more information like where the visitor is coming from or what country the user is from. If you would like to have this and other features, contact me in our AB Pictures Discord :)!

## Conclusion

Rating your images to see if your audience likes them is super important. In this article I have shown you how to do it with AB Picturer. Join the [AB Picturer Discord](https://discord.gg/ZSvMBCUeyA).
