---
title: AI Software Development with Ninox and arcBot
show: "yes"
date: "2024-02-14"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=arcbot&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=arcbot&state=visitor"
tags: ["eng", "2024", "ninox", "ai"] #nofeed
gerUrl: https://martinmueller.dev/arcbot
pruneLength: 50
---

AI is boosting the corporate landscape. Many simple and complex processes in companies can be greatly simplified or even completely automated using AI. Jakob, my co-founder, and I see it as an exciting challenge to simplify access to AI for small and medium-sized companies. We believe we have found an exciting approach with the low-code platform [Ninox](https://ninox.com) and our AI chatbot [arcBot](https://app.arcbot.de). In this blog post, I would like to introduce you to this approach.

## Ninox.com

[Ninox.com](https://ninox.com) is a cloud-based low-code platform for building software solutions for small and medium-sized companies. Ninox was founded in 2013 in Germany by [Frank Böhmer](https://www.linkedin.com/in/frank-boehmer/). Here are some ways Ninox can support businesses:

Business process automation: With Ninox, companies can automate their daily tasks and processes to increase efficiency.

Customizability: Because Ninox is a low-code platform, companies can adapt their applications to their specific needs without complex programming knowledge.

Integration: Ninox can be integrated with a variety of other tools and platforms, enabling seamless data exchange between different systems.

Cost efficiency: Compared to developing custom software from scratch, using a low-code platform like Ninox can result in significant cost savings.

Fast implementation: With Ninox, companies can build and implement their applications quickly, resulting in a faster time to market.

A few months ago, I created an MVP with Ninox. You can read about my experiences [here](https://martinmueller.dev/ninox-mvp). In the next chapter, I'll explain how we use arcBot to simplify the build for your software solution in ninox.

## arcBot

The arcBot is a ChatGPT-like AI for quickly creating and modifying Ninox tables. We use the AWS Bedrock API to create the Ninox table responses. An example prompt to create Ninox tables could look like this:

`Create customer and product tables in a many to many relationship.`

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/createTable.gif" alt="Drawing" width="800"/>

Cool, right? arcBot creates many tables for customers and products. Remarkably, arcBot can even set the ninox-typical inverse fields. In the next prompt we want to add the last name to a customer.

`Add last name to customer table`

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/addLastName.gif" alt="drawing" width="800"/>

For the response, arcBot uses the [Claude v2.1 model](https://docs.anthropic.com/claude/docs/claude-2p1-guide), which is made available via the [AWS Bedrock API](https://docs.aws.amazon.com/bedrock/).

How do we ensure that the quality of the answers is as high as possible? We have built in a feedback loop. The user can give feedback after the answer. This feedback is then used to improve arcBot.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/feedback1.png" alt="Drawing" width="800"/>
<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/feedback2.png" alt="Drawing" width="800"/>

I am also in close contact with other Gen AI experts who help me to improve the quality of arcBot answers. I would like to take this opportunity to thank these experts. They are mainly AWS community members and AWS employees who have already given me many valuable tips. Thank you very much 🙏

## Ninox Connector

It's cool that we can create Ninox tables with arcBot, but how can we process the data in Ninox? This is where the Ninox Connector comes into play. The Ninox Connector can read and update Ninox tables. The following image shows the Ninox Connector.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/ninox-connector.png" alt="Drawing" width="800"/>.

The Ninox Connector needs some information like the Ninox Url, Team Id, Database Id and the Ninox API Key. Currently the Ninox Connector is only available via Early Access. But you can easily get it on https://app.arcbot.de/.

## Discord Community

Become part of our [Discord Community](https://discord.gg/MMWZSHSrEQ). We already have some members who give us valuable feedback and feature requests for the arcBot.

## Summary

In this blog post I have shown you how we simplify the creation and updating of Ninox tables by combining Ninox and arcBot. We look forward to your feedback. Thank you for reading.

I am passionate about contributing to Open Source projects. You can find many of my projects on [GitHub](https://github.com/mmuller88) that you can already benefit from.

If you found this post valuable and would like to show your support, consider supporting me back. Your support will enable me to write more posts like this and work on projects that provide value to you. You can support me by:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Pateron](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

<a href="https://martinmueller.dev"><img src="https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg" alt="drawing" width="400"/></a>
