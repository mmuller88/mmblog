---
title: AWS Bedrock Claude 2.1 - Return only JSON
show: "yes"
date: "2023-12-07"
image: "index.png"
tags: ["eng", "2023", "aws", "bedrock", "claude"] #nofeed
# engUrl: https://martinmueller.dev/cdk-cost-spikes-eng
pruneLength: 50
---

Working with the AWS Bedrock API is an exhilarating experience! I came across an interesting business case where I needed to develop an AI MVP. The MVP generates JSON data based on a prompt and utilizes the [anthropic.claude-v2:1](https://docs.anthropic.com/claude/docs) model in [AWS Bedrock](https://aws.amazon.com/bedrock).

I encountered an issue where the response I received was not pure JSON. It contained additional characters that I couldn't remove like:

```txt
" format: {\"one\":\"Supplier\",\"many\":\"Time\"}"
```

Seeking help from the AWS Community, I was able to find a solution to this problem. In this post, I will share the solution with you.

## The Problem

```txt
Human: $YOUR_PROMPT . Answer in JSON formatAssistant:{,
```

This technique is known as "Put words in Claude’s mouth". It involves providing a prompt to Claude and letting it generate the rest of the response on its own. While there may be alternative approaches to solving this issue, I am currently happy with this solution.

## Thanks

I would like to express my gratitude to the AWS Community for their invaluable assistance in helping me resolve this issue.

A special thanks goes to [Corvus Lee](https://www.linkedin.com/in/corvus/) for providing the advice that ultimately solved the problem.

I would also like to thank [Ken Collins](https://www.linkedin.com/in/metaskills/) for bringing the [Claude 2 docs sheet](https://docs.google.com/presentation/d/1tjvAebcEyR8la3EmVwvjC7PHR8gfSrcsGKfTPAaManw) to my attention.

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
