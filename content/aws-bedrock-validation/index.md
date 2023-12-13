---
title: Validate your AWS Bedrock response
show: "no"
date: "2023-12-17"
image: "index.png"
tags: ["eng", "2023", "aws", "bedrock", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/cdk-cost-spikes-eng
pruneLength: 50
---

Validating the response from your LLM (Language Learning Model) is a crucial step in the development process. It is important to ensure that the response is in the correct format and that it contains the expected data. If you do the evaluation always manually you will be very tired very soon, as you need to repeat the evaluation every time when you did a change to your LLM.

So it is strongly recommended to automate or at least partly automate the validation process. In this post, I will demonstrate how you an automated validation attempt could look like.

## Before

With LLM I mean the use of existing foundation models via AWS Bedrock like Claude, LLama2, etc. You can find more about AWS Bedrock [here](https://aws.amazon.com/bedrock/). As well other techniques you are using to enhance the response with like prompt refinements, RAG (Retrieval Augmentation. Use of Vector Databases) or ultimately fine-tuning.

## Idea

Responses from LLMs are often non-deterministic which means that another response can be different even when it had the same prompt. Sure this can be adjusted a bit with LLM parameters like temperature.

* identify parts of your response which are not non-deterministic so indeed deterministic.

## Example

* Response is JSON. JSON has a schema we can check on
* Making multiple prompts and some of them are indeed deterministic

## How to test deterministic Responses

...

### How to test non-deterministic Responses

* compare answer with golden answer

## Thanks

I would like to express my gratitude to the AWS Community for their invaluable assistance in helping me resolve this issue.

A special thanks goes to [Chris Miller](https://www.linkedin.com/in/chris-t-miller) for giving me a lot of thoughts and feedback on my validation approach. [Neylson Crepalde](https://www.linkedin.com/in/neylsoncrepalde/) for making me aware and explaining the golden response validation method.

Once again, thank you all for your support and contributions.

## Conclusion

Working with AWS Bedrock AI is incredibly enjoyable. The field is constantly evolving, and there is always something new to learn. In this post, I demonstrated how to obtain a pure JSON response from AWS Bedrock Claude 2.1. As AI technology continues to advance rapidly, you may not encounter this issue in the future. However, if you are working with Claude 2.1 or newer, be sure to refer to the [documentation](https://docs.anthropic.com/claude/docs) for more information.

I hope you found this post helpful, and I look forward to sharing more with you in the future.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on the:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
