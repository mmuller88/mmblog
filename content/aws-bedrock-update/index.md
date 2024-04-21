---
title: AWS Bedrock Update from Claude v2.1 to Claude v3
show: "yes"
date: "2024-04-21"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=aws-bedrock-update&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=aws-bedrock-update&state=visitor"
# image: "titleGuitar.png"
tags: ["eng", "2024", "aws", "ai", "bedrock"] #nofeed
# engUrl: https://martinmueller.dev/ab-picturer
pruneLength: 50
---

Recently, AWS released Claude v3. It comes with the [Haiku](https://aws.amazon.com/about-aws/whats-new/2024/03/anthropics-claude-3-haiku-model-amazon-bedrock/) and [Sonnet](https://aws.amazon.com/about-aws/whats-new/2024/03/anthropics-claude-3-sonnet-model-amazon-bedrock/) flavors. Both are big improvements over the previous version. We recently updated our [arcBot](https://martinmueller.dev/arcbot-eng) to use Claude v3 Sonnet and are very impressed with the results. Not only are the responses more intelligent, but the speed of the responses is much faster. In the next section I will describe how an update can go as smoothly as it did for us.

## Upgrade

As mentioned above, we upgraded from Claude v2.1 to Claude v3 Sonnet for our gen AI database tool [arcBot](https://martinmueller.dev/arcbot-eng) (Try it out!).

When you do this there is a high risk that your answers will not be as good as before. But we were prepared and the answers are even better now. But how did we do it?

Simply with [Unit Testing](https://martinmueller.dev/aws-bedrock-unit-testing). I wrote a bunch of unit tests during the development with Claude v2.1 and they came in handy for the update to v3. It was basically just a matter of making those unit tests pass.

## Conclusion

Using AWS gen AI offerings like Claude is super fun. It can be challenging to make sure your answers are still as good as before. But with good test coverage, you can make sure that your answers are still as good as before, or even better. With our unit tests in place, we are confident that we can easily upgrade to a future version again, or if we wanted, change the LLM entirely. If you have any questions or thoughts about this, feel free to contact us :)!

## Bonus - AB Picturer

<img src="https://github.com/mmuller88/mmblog/raw/master/content/aws-bedrock-update/ab-picturer.png" alt="drawing" width="400"/>.

Did you notice the cool blog title picture? It is actually one of two randomly selected pictures. I love writing blog posts and choosing nice pictures for them. But often I want to choose THE BEST picture. So to find the best picture I'm using AB Testing. If you are curious about it, have a look at my [AB Picturer Tool](https://martinmueller.dev/ab-picturer) and provide me feedback or even better become an engaged tester :).
