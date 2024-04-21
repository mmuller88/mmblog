---
title: AWS Bedrock Update from Claude v2.1 to Claude v3
show: "no"
date: "2024-04-17"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=aws-bedrock-update&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=aws-bedrock-update&state=visitor"
# image: "titleGuitar.png"
tags: ["eng", "2024", "aws", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/ab-picturer
pruneLength: 50
---

Quite recently AWS introduced the Claude v3. It comes with the flavors of [Haiku](https://aws.amazon.com/about-aws/whats-new/2024/03/anthropics-claude-3-haiku-model-amazon-bedrock/) and [Sonnet](https://aws.amazon.com/about-aws/whats-new/2024/03/anthropics-claude-3-sonnet-model-amazon-bedrock/). Both are great improvements over the previous version. We recently updated our [arcBot](https://martinmueller.dev/arcbot-eng) to use Claude v3 Sonnet and are super impressed by the results. Not only are feeling the answers more intelligent as well the speed of the answers is much faster. In the next section I want to describe how an update can go as smoothly as it went for us.

## Update

As mentioned we upgraded from Claude v2.1 to Claude v3 Sonnet. But if you do such think is includes like high risks that your answers are not as good as before. But we were prepared and the answers are now even better. But how did we do it?

Simply with [Unit Testing](https://martinmueller.dev/aws-bedrock-unit-testing). I wrote a bunch of unit tests during development with Claude v2.1 and those came in very handy for the update to v3. It basically was just a matter of making those unit tests passing.

## Conclusion

Using AWS gen AIs offers like Claude is super fun. It can get challenging when ensuring your answers are still as good as before. But with a good test coverage you can make sure that your answers are still as good as before or even better. With our unit tests in place wer are confident that we easily can update to a future version easily again or if we wanted change the LLM entirely. Any questions or thoughts on this reach out :)!

## AB Picturer - Bonus

<img src="https://github.com/mmuller88/mmblog/raw/master/content/aws-bedrock-update/ab-picturer.png" alt="drawing" width="400"/>.

Did you notice the cool blog title picture? It is actually one from two randomly choosen. I love writing blog post and choosing a nice picture. But often I want to choose the best picture. So for figuring out the best picture I'm using AB Testing. If you are curios about that have a look at my [AB Picturer Tool](https://martinmueller.dev/ab-picturer).

