---
title: AWS Bedrock AgentCore - AI Agent Development from Local to Cloud
show: "no"
date: "2026-01-09"
image: "robot-climbing.png"
tags: ["eng", "2026", "aws", "ai", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/ab-picturer
pruneLength: 50
---

## Introduction

Building production-ready AI agents requires more than just a prompt and an LLM. You need infrastructure for state management, tool execution, and secure deployment. I recently built **https://ai-secure.dev**, a SaaS for automated security compliance audits, using **AWS Bedrock AgentCore**. This post explores how AgentCore simplifies the transition from a local prototype to a scalable cloud agent.

## What is AWS Bedrock AgentCore?

AgentCore is AWS's managed runtime for AI agents. Think of it as "Fargate for AI agents" - you bring your container, AWS handles scaling, networking, and infrastructure.

**Key features:**

- **Container-based**: Package agent as Docker image, push to ECR, deploy via CDK
- **VPC networking**: Agents run in private subnets with NAT for outbound (Anthropic API, target websites)
- **AgentCore Browser**: Managed Chromium browser for web automation - no Playwright/Puppeteer infra needed
- **Memory**: Built-in conversation memory across sessions
- **Streaming**: SSE responses for real-time progress updates

## https://ai-secure.dev

A security compliance scanner that uses an AI agent to audit websites.

**How it works:**

1. User submits URL + selects security compliance framework (ISO 27001, NIST, SOC2, COBIT)

![New Scan](1_new_scan.png)

2. Agent navigates site using AgentCore Browser, shows real-time progress

![Scan Progress](2_scan_progress.png)

3. Scan completes with summary

![Scan Finished](3_scan_finished.png)

4. User views detailed report with findings + recommendations

![Scan Report](4_scan_report.png)

**Architecture:**

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Frontend  │────▶│  AgentCore       │────▶│  AgentCore  │
│  (Next.js)  │     │  Runtime         │     │   Browser   │
└─────────────┘     │  (your container)│     │  (Chromium) │
                    └──────────────────┘     └─────────────┘
                           │
                     ┌─────▼─────┐
                     │  Claude   │
                     │ (Anthropic)│
                     └───────────┘
```

**Tech stack:**

| Component | Tech |
|-----------|------|
| Agent | [Strands TypeScript SDK](https://github.com/strands-agents/sdk-typescript) + Claude (Anthropic) |
| Browser | AgentCore Browser (cloud) / Playwright MCP (local) |
| Frontend | Next.js 16 + React 19 + Tailwind |
| Auth | AWS Cognito |
| Database | DynamoDB |
| Infra | AWS CDK → AWS ECS Fargate + AWS Bedrock AgentCore Runtime |
| Payments | Stripe |

**Agent tools:**

- `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type` - web automation
- `http_security_check` - headers, TLS, redirects
- `dns_lookup` - SPF/DMARC/CAA records
- `totp` - 2FA code generation for authenticated scans
- `issue_tracker` - tracks problems during scan

**Model routing for cost optimization:**

```typescript
// Simple tasks → Haiku (~10x cheaper)
// Complex tasks → Sonnet
const classification = classifyTask(prompt)
const model = classification.complexity === 'simple' 
  ? 'claude-haiku-4-5' 
  : 'claude-sonnet-4-5'
```

## Learnings

**Agent development:**

- Don't build an agent from scratch initially. Validate your use case works with existing agents (Cursor, Claude Code, Kiro). If they can't solve it, your custom agent probably won't either. Your goal: beat them on speed, accuracy, cost for your specific domain.
- Develop locally first using Docker. Same container runs locally and in AgentCore.
- Use Server-Sent Events (SSE) streaming for real-time progress - users need to see what the agent is doing.

**Browser automation:**

- AgentCore Browser is game-changer. No more managing Playwright/Puppeteer infrastructure.
- For local dev, use existing MCP Docker images (playwright-mcp). Your custom implementation won't be better.
- Browser tools need good error handling - pages don't always load, elements move, auth flows vary.

**Cost optimization:**

- Model routing: Haiku for greetings/simple queries, Sonnet for audits
- Message caching: 90% cost reduction on repeated context
- Disable extended thinking unless needed (~$0.15/call)

**Production gotchas:**

- AgentCore logs are separate from your app logs. Use CloudWatch SDK directly for application logging.
- Use Infrastructure as Code (IaC) to deploy your agent to AgentCore.

## Conclusion

AWS Bedrock AgentCore provides a robust foundation for building complex, stateful AI agents. By offloading the heavy lifting of runtime management and browser infrastructure to AWS, I was able to focus on the core logic of [https://ai-secure.dev](https://ai-secure.dev) - creating high-quality security audits - rather than debugging infrastructure. If you're building agents that need to browse the web or maintain long-term state, AgentCore is a powerful accelerator.
