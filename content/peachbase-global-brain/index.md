---
title: My Global Brain with PeachBase
show: "no"
date: "2026-03-02"
image: "index.png"
tags: ["peachbase", "ai-agent", "eng", "2026", "nofeed"]
audio: "audio.mp3"
audioTiming: "audio-timing.json"
pruneLength: 50
---

## The Problem: Context Amnesia Across AI Agents

I work with multiple AI agents every day — Cursor IDE, OpenClaw, ChatGPT. On top of that, I juggle dozens of repositories spanning CDK infrastructure, Rust libraries, Python bindings, MCP servers, and blog content. Every time I switch context, I repeat myself. The agent in Cursor doesn't know what I discussed in ChatGPT. The agent in project A has no idea what I learned in project B.

There is no shared memory. No global brain.

What I really want is a knowledge layer that sits across all my agents and projects — something I can write to from any context and query from any other. A persistent, searchable memory that any MCP-compatible agent can tap into.

That's exactly what we're building with [PeachBase](https://aws.amazon.com/marketplace/pp/prodview-prod-r43hytg6uuaw4).

## What is PeachBase?

PeachBase is a serverless vector database written in Rust, deployed on AWS Lambda. It combines vector similarity search (via Google's ScaNN algorithm) with BM25 lexical search and hybrid fusion — all in a single-file `.pdb` format optimized for Lambda's constraints.

Key characteristics:

- **Sub-50ms search latency** on datasets up to 100K+ documents
- **Hybrid search**: vector similarity + BM25 full-text, fused via Reciprocal Rank Fusion
- **MongoDB-style filters**: `$eq`, `$in`, `$gte`, `$or`, etc. on filterable fields
- **Serverless-first**: runs on ARM64 Lambda with S3 Express One Zone storage, no persistent servers
- **Multi-tenant**: API key isolation with usage metering via AWS Marketplace

The cloud API exposes a REST interface for collections, documents, and search:

```
GET  /v1/collections              # List collections
POST /v1/collections              # Create collection with schema
POST /v1/collections/{name}/documents  # Insert documents
POST /v1/collections/{name}/search     # Vector/lexical/hybrid search
```

## The PeachBase MCP Server

The REST API is powerful but requires you to manage embeddings yourself. The MCP server removes that friction entirely. It wraps the REST API and adds **auto-embedding via AWS Bedrock Titan Text Embeddings V2** — meaning you just send text and the server handles vectorization.

The MCP server exposes six tools:

| Tool | What it does |
|------|-------------|
| `create_collection` | Create a collection with typed schema |
| `list_collections` | List all collections for the tenant |
| `delete_collection` | Drop a collection |
| `insert_documents` | Batch-add docs; auto-embeds text when no vector provided |
| `search` | Semantic, lexical, or hybrid search; auto-embeds text queries |
| `describe_collection` | Get doc count, dimension, size stats |

It also serves static knowledge resources (API reference, search recipes, filter syntax) so the agent can self-serve documentation without you having to paste it.

**Two transport modes:**

| Mode | Transport | Connection |
|------|-----------|------------|
| Remote | Streamable HTTP | `{gateway-url}/prod/mcp` with `x-api-key` header |
| Local | stdio | `npx peachbase-mcp` with env vars |

The remote mode runs as a Lambda behind API Gateway — the same infrastructure as the main API. The local stdio mode is useful for development and testing.

## Getting Started

### 1. Get a PeachBase API Key

PeachBase is available on [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-prod-r43hytg6uuaw4). The onboarding flow creates an API Gateway API key and assigns it to the free usage plan automatically.

1. Subscribe to PeachBase on AWS Marketplace
2. Click **Set Up Your Account** — you'll be redirected to the PeachBase onboarding page
3. The page shows your **API key** and **endpoint URL** — save both

![PeachBase Onboarding](peachbase-onboarding.png)

The free tier includes 50,000 requests/month with a burst limit of 100 req/s. If you need higher limits, upgrade to the Developer or Team plan via AWS Marketplace.

If you want an API key for testing without AWS Marketplace, reach out to me directly — happy to set one up.

### 2. Verify with a Quick curl

Your API key is passed via the `x-api-key` header on every request. Test it:

```bash
curl -H "x-api-key: YOUR_KEY" https://ENDPOINT/v1/collections
```

You should get back an empty list `[]` — that means you're authenticated and ready.

### 3. Connect the MCP Server in Cursor

Add PeachBase to your Cursor MCP configuration with the endpoint and API key from step 1:

```json
{
  "mcpServers": {
    "peachbase": {
      "url": "https://YOUR_ENDPOINT/prod/mcp",
      "headers": {
        "x-api-key": "YOUR_API_KEY"
      }
    }
  }
}
```

### 4. Start Using It

Once connected, your agent can create collections, insert knowledge, and search — all through natural language:

> "Create a collection called project-notes with a text field for content and a filterable string field for project."

> "Insert a document into project-notes: the CDK stack uses S3 Express One Zone in us-east-1a for storage, with a single-AZ VPC and no NAT gateway."

> "Search project-notes for how the Lambda connects to S3."

The auto-embedding means you never deal with vectors. Send text in, get relevant results back.

## How It Works Under the Hood

When you insert a document without a vector, the MCP server:

1. Extracts all text/string fields from the document
2. Calls Bedrock Titan V2 to generate a 1024-dimensional embedding
3. Attaches the vector and forwards to the REST API

When you search with a text query in semantic or hybrid mode:

1. The query text is embedded via Bedrock Titan V2
2. The resulting vector is sent alongside the text to the REST API
3. Hybrid mode fuses BM25 lexical scores with vector cosine similarity via RRF

The search response strips embedding vectors from results to keep payloads small for LLM consumption — the agent sees document fields and scores, not raw float arrays.

## The Global Brain Pattern

Here's how I use PeachBase as a shared memory across projects:

**Writing knowledge**: whenever I learn something important — an architecture decision, a debugging insight, a configuration detail — I tell the agent to store it. The MCP tools handle the rest.

**Reading knowledge**: when I'm in a different project and need context, I search. The hybrid search combines semantic understanding (what I mean) with lexical matching (exact terms), which works well for technical content where both matter.

**Cross-project**: since every Cursor workspace connects to the same PeachBase endpoint and API key, knowledge flows between projects automatically. What I learn while debugging the CDK stack is searchable when I'm writing this blog post.

This is the real value — not just search, but persistent cross-agent, cross-project memory that accumulates over time.

## Conclusion

The biggest bottleneck in my AI-assisted workflow isn't model quality — it's context loss. Every time I switch agents or projects, I start from scratch. PeachBase gives me a persistent, searchable knowledge layer that any MCP-compatible agent can read and write. Hybrid search ensures I find what I need whether I remember the exact term or just the concept.

If you're working across multiple AI agents and projects and tired of repeating yourself, give PeachBase a try. The MCP server makes integration trivial — connect it once and your agents share a brain.

---

Questions or feedback? Connect on [LinkedIn](https://www.linkedin.com/in/martinmueller88/).
