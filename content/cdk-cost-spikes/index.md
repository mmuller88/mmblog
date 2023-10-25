---
title: Catch AWS Cost Spikes quickly with AWS CDK
show: "no"
date: "2023-10-26"
image: "index.png"  
tags: ["2023", "aws", "cdk", "nofeed"] #nofeed
engUrl: https://martinmueller.dev/cdk-cost-spikes-eng
pruneLength: 50
---

* get notified asap your daily costs are higher than usually.
* everything written with aws cdk.
* Last year AWS released adjustable budget. We can use it to detect daily costs which are significant higher then they were in the last x days.
* A message will be sent to Slack which makes you aware of the cost spike
* choice between deploying to the root account and monitoring all costs at once or deploying to each environment account. Prefer the second one. Use a pipeline for CD.

Developing and running workloads in aws is fun. But you don't want spend more money then you really need. For that cost analysing tools like the AWS Cost Explorer are super important. Useful as well is the AWS Budget Service which allows you to setup a target budget and get notified if you are about to reach the target.

Just last year 2022 AWS released the [auto-adjusting AWS Budget](https://aws.amazon.com/about-aws/whats-new/2022/02/auto-adjusting-budgets/) which really great to catch sudden spike costs. It allows your to calculate the cost average over the last x days and if you reach more than 120 % of the average you get notified.

If my client would have implemented before he would have catched the cost spike seen here much earlier.

[![cost-spikes](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-cost-spikes/spike-costs.png)]

## CDK Stack

...


## Summary

...

I hope you enjoyed this post and I look forward to seeing you in the next one.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on the:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)