---
title: Strands TypeScript SDK - Building Production AI Agents
show: "no"
date: "2026-01-31"
image: "strands-agent.png"
tags: ["aws", "ai-agent", "strands", "typescript", "eng", "2026", "nofeed"]
pruneLength: 50
---

## Introduction

Building AI agents that work in production requires more than wrapping an LLM API. You need tool execution, streaming responses, cost management, and integration with existing systems. After evaluating several frameworks for [ai-secure.dev](https://ai-secure.dev), I chose the **Strands TypeScript SDK** from AWS.

**Why Strands over alternatives?**

| Framework | Pros | Cons |
|-----------|------|------|
| LangChain | Feature-rich, large ecosystem | Heavy, complex abstractions |
| Raw Anthropic/OpenAI API | Full control | Too low-level, no tool orchestration |
| **Strands SDK** | Lightweight, AWS-native, streaming-first | Newer, smaller community |

Strands hits the sweet spot: enough abstraction to be productive, low enough to maintain control. It's what I used to build the security audit agent behind ai-secure.dev.

## Agent Creation Basics

Creating an agent requires three things: a model, a system prompt, and tools.

```typescript
import { Agent, tool } from '@strands-agents/sdk'
import { z } from 'zod'

const agent = new Agent({
  model,                    // BedrockModel or custom provider
  systemPrompt: `You are a security auditor...`,
  tools: [httpSecurityCheck, dnsLookup, browserNavigate],
})

// Invoke the agent
const response = await agent.invoke('Audit https://example.com')

// Or stream for real-time updates
for await (const event of agent.stream(prompt)) {
  // Handle events: text deltas, tool calls, metadata
}
```

The SDK handles the agentic loop: model generates response → tool calls extracted → tools executed → results fed back → repeat until done.

## Defining Tools

Tools are functions the agent can call. The `tool()` helper wraps them with Zod schema validation:

```typescript
const calculatorTool = tool({
  name: 'calculator',
  description: 'Performs arithmetic. Params: operation, a, b',
  inputSchema: z.object({
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    a: z.number(),
    b: z.number(),
  }),
  callback: (input) => {
    let result: number
    switch (input.operation) {
      case 'add': result = input.a + input.b; break
      case 'subtract': result = input.a - input.b; break
      // ...
    }
    return `Result: ${result}`
  },
})
```

For domain-specific agents, design tools around your use case. My security agent has tools like:

- `http_security_check` - Headers, TLS inspection, redirect chain
- `dns_lookup` - SPF/DMARC/CAA records
- `browser_navigate` - Navigate and interact with pages
- `totp` - Generate 2FA codes for authenticated scans

**Complex tool example** (abbreviated):

```typescript
const httpSecurityCheckTool = tool({
  name: 'http_security_check',
  description: 'HTTP security analysis: headers, TLS cert, redirects',
  inputSchema: z.object({
    url: z.string().describe('URL to check'),
    method: z.enum(['GET', 'HEAD', 'OPTIONS']).optional(),
    includeTls: z.boolean().optional(),
  }),
  callback: async (input) => {
    // Make request, inspect TLS socket, check headers
    const securityHeaders = ['strict-transport-security', 'content-security-policy', ...]
    // ... implementation
    return JSON.stringify({ url, statusCode, securityHeaders, tls })
  },
})
```

Tools are the agent's "hands" - design them for your domain, not as generic utilities.

## Custom Model Provider

The SDK includes `BedrockModel` for AWS Bedrock, but you can create custom providers. I built `AnthropicModel` for direct Anthropic API access with features like message caching:

```typescript
export class AnthropicModel {
  constructor(config: AnthropicModelConfig) {
    this.client = new Anthropic({ apiKey: config.apiKey })
    this.config = {
      modelId: config.modelId || 'claude-sonnet-4-5-20250929',
      maxTokens: config.maxTokens || 16000,
      enableMessageCaching: config.enableMessageCaching ?? true,
    }
  }

  async *stream(messages, options) {
    // Convert messages to Anthropic format
    // Add cache_control blocks for cost reduction
    // Yield SDK-compatible events
  }
}
```

**Message caching** reduces costs by 90% on repeated context. Add `cache_control` to strategic messages:

```typescript
// Cache system prompt (reused every call)
request.system = [{
  type: 'text',
  text: systemPrompt,
  cache_control: { type: 'ephemeral', ttl: '1h' }
}]

// Cache last tool definition
tools[tools.length - 1].cache_control = { type: 'ephemeral', ttl: '1h' }
```

**Cost tracking** built into the model:

```typescript
const MODEL_PRICING = {
  'claude-sonnet-4-5-20250929': { input: 3.00, output: 15.00, cacheRead: 0.30 },
  'claude-haiku-4-5-20251001': { input: 1.00, output: 5.00, cacheRead: 0.10 },
}

function calculateCost(modelId, inputTokens, outputTokens, cacheReadTokens) {
  const pricing = MODEL_PRICING[modelId]
  return (inputTokens * pricing.input + outputTokens * pricing.output 
          + cacheReadTokens * pricing.cacheRead) / 1_000_000
}
```

## Model Routing for Cost Optimization

Not every request needs your most powerful model. Route simple tasks to cheaper models:

```typescript
function classifyTask(prompt: string) {
  const lower = prompt.toLowerCase()
  
  // Complex patterns → Sonnet
  const complexPatterns = [
    /security|vulnerabil|audit/i,
    /iso\s*27001|compliance/i,
    /investigate|analyze|assess/i,
  ]
  
  // Simple patterns → Haiku (10x cheaper)
  const simplePatterns = [
    /^(hi|hello|hey)/i,
    /^(thanks|thank\s*you)/i,
    /^(yes|no|ok)/i,
  ]
  
  for (const pattern of complexPatterns) {
    if (pattern.test(prompt)) {
      return { complexity: 'complex', model: 'claude-sonnet-4-5' }
    }
  }
  
  for (const pattern of simplePatterns) {
    if (pattern.test(lower)) {
      return { complexity: 'simple', model: 'claude-haiku-4-5' }
    }
  }
  
  // URLs always complex (security audits need full power)
  if (prompt.includes('http://') || prompt.includes('https://')) {
    return { complexity: 'complex', model: 'claude-sonnet-4-5' }
  }
  
  return { complexity: 'complex', model: 'claude-sonnet-4-5' } // Default safe
}
```

Log cost comparisons in production to validate routing:

```
📊 Tokens: 15420 in, 2341 out | $0.0812 (sonnet-4-5)
   Alternative: $0.4102 (opus-4-5) → +$0.329 (+405%)
```

## Streaming Architecture

For real-time UX, stream agent events via Server-Sent Events (SSE):

```typescript
app.post('/invocations', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  
  const sendEvent = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`)
  }
  
  for await (const event of agent.stream(prompt)) {
    // Text streaming
    if (event.type === 'modelContentBlockDeltaEvent') {
      const delta = event.delta
      if (delta?.type === 'textDelta') {
        sendEvent('text', { content: delta.text })
      }
    }
    
    // Tool execution tracking
    if (event.type === 'modelContentBlockStartEvent') {
      const start = event.start
      if (start?.type === 'toolUseStart') {
        sendEvent('tool_start', { tool: start.name })
      }
    }
    
    if (event.type === 'afterToolsEvent') {
      sendEvent('tool_end', { tool: currentTool })
    }
    
    // Token usage
    if (event.type === 'modelMetadataEvent') {
      totalTokens += event.usage?.totalTokens || 0
    }
  }
  
  sendEvent('done', { usage: { totalTokens } })
  res.end()
})
```

**Key event types:**

| Event | When | Use |
|-------|------|-----|
| `modelContentBlockDeltaEvent` | Text/tool input streaming | Real-time display |
| `modelContentBlockStartEvent` | Tool call begins | Show "Analyzing..." |
| `afterToolsEvent` | Tool finished | Show result |
| `modelMetadataEvent` | Tokens counted | Cost tracking |

## OpenAI-Compatible Adapter

Want your agent to work with Cline, Continue.dev, or other tools expecting OpenAI API? Wrap it:

```typescript
export function createOpenAIAdapter(config) {
  const router = Router()
  
  router.get('/v1/models', (_, res) => {
    res.json({
      data: [{ id: config.modelName, owned_by: 'strands-agents' }]
    })
  })
  
  router.post('/v1/chat/completions', async (req, res) => {
    const { messages, stream } = req.body
    const prompt = extractPromptFromMessages(messages)
    
    const { agent } = config.createAgent()
    
    if (stream) {
      // Stream SSE chunks in OpenAI format
      res.setHeader('Content-Type', 'text/event-stream')
      for await (const event of agent.stream(prompt)) {
        // Convert to OpenAI chunk format
        res.write(`data: ${JSON.stringify(chunk)}\n\n`)
      }
      res.write('data: [DONE]\n\n')
    } else {
      // Collect and return
      const response = await agent.invoke(prompt)
      res.json({ choices: [{ message: { content: response } }] })
    }
  })
  
  return router
}

// Mount the adapter
app.use(createOpenAIAdapter({ modelName: 'security-agent', createAgent }))
```

Now point Cline at `http://localhost:8080/v1` and it works.

## Production Tips

**Session management with TTL:**

```typescript
const sessions = new Map<string, Session>()
const SESSION_TTL_MS = 30 * 60 * 1000 // 30 min

setInterval(() => {
  const now = Date.now()
  for (const [id, session] of sessions) {
    if (now - session.lastAccessedAt > SESSION_TTL_MS) {
      sessions.delete(id)
    }
  }
}, 60 * 1000)
```

**Issue tracking during scans:**

```typescript
const issueTrackerTool = tool({
  name: 'issue_tracker',
  description: 'Track problems during audit: auth failures, timeouts, etc.',
  inputSchema: z.object({
    type: z.enum(['auth_failed', 'access_denied', 'timeout', 'credentials_required']),
    title: z.string(),
    description: z.string(),
  }),
  callback: (input) => {
    session.issues.push(input)
    return `Issue tracked: ${input.title}`
  },
})
```

Include issues in the final report so users know what couldn't be tested.

## Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Frontend  │────▶│  Agent Server    │────▶│   Tools     │
│   (Next.js) │     │  (Strands SDK)   │     │ (http, dns, │
└─────────────┘     │                  │     │  browser)   │
      ▲             └────────┬─────────┘     └─────────────┘
      │                      │
   SSE Events           ┌────▼────┐
                        │  Model  │
                        │ Provider│
                        └─────────┘
```

**Cost comparison (per 1M tokens):**

| Model | Input | Output | Cache Read | Best For |
|-------|-------|--------|------------|----------|
| Haiku 4.5 | $1.00 | $5.00 | $0.10 | Simple queries, greetings |
| Sonnet 4.5 | $3.00 | $15.00 | $0.30 | Security audits, analysis |
| Opus 4.5 | $5.00 | $25.00 | $0.50 | Complex reasoning |

With routing + caching, typical security audit costs ~$0.08-0.15 vs $0.40+ without.

## Conclusion

The Strands TypeScript SDK provides a solid foundation for building production AI agents. Key takeaways:

1. **Tools are everything** - Design domain-specific tools, not generic utilities
2. **Cache aggressively** - Message caching saves 90% on repeated context
3. **Route by complexity** - Not every request needs your best model
4. **Stream for UX** - Users need to see progress during long operations
5. **Track costs** - Log token usage and compare models in production

The SDK handles the agentic loop so you can focus on domain logic. For [ai-secure.dev](https://ai-secure.dev), that meant security analysis - not prompt engineering infrastructure.

---

Questions or building your own agent? Connect on [LinkedIn](https://www.linkedin.com/in/martinmueller88/).
