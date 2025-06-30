---
title: A property listings AI chat with MCP integrations running in AWS 
show: "no"
date: "2025-07-07"
# imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=powertools&state=preview"
# imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=powertools&state=visitor"
tags: ["eng", "2025", "aws", "ai", "mcp", "cdk"]
pruneLength: 50
---

Hi there,

My Co-Founder [Michael Franz](https://www.linkedin.com/in/michael-franz-308943b8/) and I founded <https://hallocasa.com> a while back. That is a property listing and agency platform to list and search for properties <https://hallocasa.com/properties> or to find a property broker <https://hallocasa.com/brokers>.

As I'm a big fan of AWS, AI and MCP (Model Context Protocol <https://modelcontextprotocol.io/>), I wanted to build an AI chat with MCP integrations running in AWS to improve the property search experience. As well I believe the future of property search will be AI-driven and you basically write or speak to an AI to find a property.

## listings-mcp.com

I'm hosting the app on <https://listings-mcp.com> and you can try it out there. It is comparable with <https://www.perplexity.ai/> when you use it for property search. But yeah perplexity isn't working as good as I expected. It pretends to show properties but if you click on the source it only forwards you to the properties search. But what I really want is to see the property details and images like you get with <https://listings-mcp.com>.

## MCP Integration

I simply can use our [HalloCasa Zapier Integration](https://zapier.com/apps/hallocasa/integrations) as MCP integration. So basically I only need to provide the MCP server url and our chatbot can use it to search for properties in real-time.

This integration is incredible easy and powerful as it allows me to enhance the MCP quickly.

For putting together the AI Chat capabilities and the MCP integration, I'm using the AI libraries from Vercel [ai-sdk](https://ai-sdk.dev/). The [mcp-tools](https://ai-sdk.dev/cookbook/node/mcp-tools) make it incredible easy to build an AI chat with MCP integrations. Honestly I wrote everything down in a few hours. Of course cursor AI made most of the work.

## AWS Setup

I'm using AWS CDK to deploy AWS ECS Fargate to run a NextJS app which has access to the MCP server and Anthropic Claude 4 Sonnet via AWS Bedrock.

## Conclusion

So my new website <https://listings-mcp.com> is more for self-eduction. But I'm also curious if we can improve the property search experience by particular using MCP integrations from providers like [HalloCasa](https://hallocasa.com). I'm not that crazy of trying to compete with perplexity but maybe there is a niche for this.

If you want more details, like how I build the MCP integration, reach out to me on [LinkedIn](https://www.linkedin.com/in/martinmueller88/). I'm super eager to share my knowledge with you.

And don't forget to visit my site

<a href="https://martinmueller.dev"><img src="https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg" alt="drawing" width="400"/></a>
