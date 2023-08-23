---
title: Run your AI LangChain on AWS
show: "no"
date: "2023-07-15"
image: "index.png"  
tags: ["de", "2023", "aws", "ai", "langchain", "nofeed"] #nofeed
engUrl: https://martinmueller.dev/langchain-eng
pruneLength: 50
---

Der LLM Hype scheint unaufhaltbar. Es ist faszinierend was mittlerweile mit LLMs möglich ist! LLMs sind aber dennoch gewissen Grenzen aufgesetzt. Mit der LangChain lassen sich die Grenzen verschieben und die Nützlichkeit der LLMs werden erhöht. In diesem Post möchte ich euch erklären was die LangChain ist und welche coolen Features es ermöglichen mehr aus LLMs rauszuholen.

* Die LangChain Library verspricht eine nützliche Abstraktion zu sein um die Möglichkeiten der vorhandenen LLMs zu erweitern.
* Es hat coole Features wie Chains, Memory, Agents und Vector Machines
* Auch lassen sich die LLMs beliebig austauschen und ermöglicht somit eine höhere Unabhängigkeit zu Platzhirschen wie OpenAI

## LangChain

Die LangChain ist eine SDK Library um die Erstellung von LLM Applikationen zu vereinfachen. Die Library bietet dabei eine Möglichkeit mit LLMs programmatisch zu kommunizieren.

Das SDK unterstützt [Python](https://github.com/hwchase17/langchain) und [JavaScript/TypeScript](https://github.com/hwchase17/langchainjs) als Programmiersprachen. Die Nützlichkeit der Library wird massgeblich durch die folgenden Features bestimmt.

### Sequence Chains

So können z.B. einzelne LLM calls miteinander verschachtelt werden.

### Memory

Persisting state (like conversations) between calls of a chain/agent

### Agents

Involve an LLM making decisions about which Actions to take

### Vector Machines

“Train” the LangChain LLM with your specific data

## Kritik

* LangChain Library ist noch sehr am Anfang. Du wirst also in Probleme stossen. Perfekte Gelegenheit zu kontributieren.


...

## Zusammenfassung

In one of my next posts, I give you deeper insight into the T3 Stack like how it works. I also show you how to use it to develop a Prototype or MVP.

A huge thanks to the [T3 Stack community](https://create.t3.gg/) for their hard work and support. And a special thanks to [Theo](https://www.youtube.com/@t3dotgg) for creating this amazing stack and thriving it. I love your content on [YouTube](https://www.youtube.com/@t3dotgg). Keep up the amazing work!

I hope you enjoyed this post and I look forward to seeing you in the next one.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on the:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)