---
title: A property listings AI chat with MCP integrations running in AWS 
show: "no"
date: "2025-07-09"
image: "index.png" 
# imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=powertools&state=preview"
# imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=powertools&state=visitor"
tags: ["eng", "2025", "aws", "ai", "mcp", "cdk"]
pruneLength: 50
---

Hi there,

My Co-Founder [Michael Franz](https://www.linkedin.com/in/michael-franz-308943b8/) and I founded <https://hallocasa.com> a while back. It is a property listing and agency platform to list and search for properties <https://hallocasa.com/properties> or to find a property broker <https://hallocasa.com/brokers>.

As I'm a big fan of AWS, AI and MCP (Model Context Protocol <https://modelcontextprotocol.io/>), I wanted to build an AI chat with MCP integrations running in AWS to improve the property search experience. I also believe the future of property search will be AI-driven and you basically write or speak to an AI to find a property.

## listings-mcp.com

I'm hosting the app on <https://listings-mcp.com> and you can try it out there. It is comparable with <https://www.perplexity.ai/> when you use it for property search. But perplexity isn't working as good as I expected. It pretends to show properties but if you click on the source it only forwards you to the properties search. But what I really want is to see the property details and images like you get with <https://listings-mcp.com>.

## MCP Integration

We do have a [HalloCasa Zapier Integration](https://zapier.com/apps/hallocasa/integrations). That is quite convenient because Zapier allows you to use your integration as MCP server <https://zapier.com/mcp>. So very conveniently with Zapier MCP you choose the Zapier integration like HalloCasa, choose which tools you want to use and configure the parameters (if you need at all). After that Zapier provides you with an MCP server url which you can use in your AI chat.

This approach is incredible easy and powerful as it allows me to enhance the MCP quickly.

For putting together the AI Chat capabilities and the MCP integration, I'm using the AI libraries from Vercel [ai-sdk](https://ai-sdk.dev/). The [mcp-tools](https://ai-sdk.dev/cookbook/node/mcp-tools) make it incredible easy to build an AI chat with MCP integrations. I wrote everything down in a few hours. Of course cursor AI made most of the work.

Here is the code for the nextJS page route `/api/chat`:

```typescript
import { openai } from "@ai-sdk/openai"
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock"
import { fromNodeProviderChain } from "@aws-sdk/credential-providers"
import { streamText, experimental_createMCPClient } from "ai"
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import { getEnabledMCPServers, validateMCPConfig, type MCPServerConfig } from "@/lib/mcp-config"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { randomUUID } from "crypto"

export const maxDuration = 30

// Model configuration - you can switch between providers here
const MODEL_PROVIDER = process.env.MODEL_PROVIDER || "bedrock" // "openai" or "bedrock"

// DynamoDB configuration
const dynamoDBClient = new DynamoDBClient({ 
  region: process.env.AWS_REGION || "us-east-1",
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
    }
  } : {
    credentialProvider: fromNodeProviderChain()
  })
})
const docClient = DynamoDBDocumentClient.from(dynamoDBClient)
const CHAT_SESSIONS_TABLE = process.env.DYNAMODB_CHAT_SESSIONS_TABLE || "listings-mcp-chat-sessions"

// Helper functions for session management
interface ChatMessage {
  sessionId: string
  messageId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  userId?: string
  includePropertyPictures?: boolean
  toolCalls?: any[]
  toolResults?: any[]
  metadata?: any
  ttl?: number // TTL for automatic cleanup (30 days from now)
}

function generateSessionId(): string {
  return randomUUID()
}

function generateMessageId(): string {
  return randomUUID()
}

function getUserId(req: Request): string {
  // Try to extract user ID from headers, auth token, or IP address
  const userAgent = req.headers.get('user-agent') || 'unknown'
  const forwarded = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  
  // For now, create a simple hash-based user ID
  // In production, this should come from authentication
  const userIdentifier = `${userAgent}-${forwarded}`.replace(/[^a-zA-Z0-9-]/g, '_')
  return userIdentifier.substring(0, 50) // Limit length
}

async function saveMessageToDynamoDB(message: ChatMessage): Promise<void> {
  try {
    const ttl = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days from now
    
    await docClient.send(new PutCommand({
      TableName: CHAT_SESSIONS_TABLE,
      Item: {
        ...message,
        ttl
      }
    }))
    
    console.log(`[DynamoDB] Saved message ${message.messageId} to session ${message.sessionId}`)
  } catch (error) {
    console.error('[DynamoDB] Error saving message:', error)
    // Don't throw - we don't want to break the chat if DB fails
  }
}

// Create Bedrock provider with region configuration
// In ECS, credentials are automatically provided via the task role
// Only set explicit credentials if they exist (for local development)
const bedrockConfig: any = {
  region: process.env.AWS_REGION || "us-east-1", // Default to us-east-1 if not set
}

// Check if explicit credentials are provided (for local development)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  bedrockConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID
  bedrockConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  if (process.env.AWS_SESSION_TOKEN) {
    bedrockConfig.sessionToken = process.env.AWS_SESSION_TOKEN
  }
} else {
  // Use AWS credential provider chain for automatic credential resolution
  // This will work with ECS task roles, EC2 instance profiles, etc.
  bedrockConfig.credentialProvider = fromNodeProviderChain()
}

const bedrock = createAmazonBedrock(bedrockConfig)

function getModel() {
  switch (MODEL_PROVIDER) {
    case "openai":
      return openai("gpt-4o")
    case "bedrock":
    default:
      // Use inference profile ID for cross-region access to Claude Sonnet 4
      return bedrock("us.anthropic.claude-sonnet-4-20250514-v1:0")
  }
}

async function connectToMCPServers(enabledServers: MCPServerConfig[]): Promise<{ clients: any[], allTools: any }> {
  const clients: any[] = []
  let allTools = {}
  
  console.log(`[MCP] Attempting to connect to ${enabledServers.length} MCP servers...`)
  
  for (const serverConfig of enabledServers) {
    console.log(`[MCP] Processing server: ${serverConfig.name} (${serverConfig.type})`)
    
    // Validate configuration before attempting connection
    if (!validateMCPConfig(serverConfig)) {
      console.warn(`[MCP] Invalid MCP server configuration for ${serverConfig.name}`)
      continue
    }
    try {
      console.log(`[MCP] Creating client for ${serverConfig.name}...`)
      let client

      switch (serverConfig.type) {
        case 'sse':
          client = await experimental_createMCPClient({
            transport: {
              type: 'sse',
              url: serverConfig.url!
            }
          })
          break
        
        case 'http':
          const transport = new StreamableHTTPClientTransport(new URL(serverConfig.url!))
          client = await experimental_createMCPClient({
            transport
          })
          break
          
        case 'stdio':
          console.log(`[MCP] Creating stdio transport for ${serverConfig.name} with command: node ${serverConfig.command}`)
          const stdioTransport = new Experimental_StdioMCPTransport({
            command: 'node',
            args: [serverConfig.command!]
          })
          console.log(`[MCP] Creating MCP client for ${serverConfig.name}...`)
          client = await experimental_createMCPClient({
            transport: stdioTransport
          })
          console.log(`[MCP] Client created for ${serverConfig.name}, waiting for initialization...`)
          // Give stdio process more time to fully initialize
          await new Promise(resolve => setTimeout(resolve, 2000))
          console.log(`[MCP] Initialization wait complete for ${serverConfig.name}`)
          break
      }

      if (client) {
        clients.push({ client, config: serverConfig })
        
        // Get tools from this MCP server with retry logic
        let serverTools: any = {}
        let attempts = 0
        const maxAttempts = 3
        
        while (attempts < maxAttempts) {
          try {
            console.log(`[MCP] Attempt ${attempts + 1} to get tools from ${serverConfig.name}...`)
            serverTools = await client.tools()
            console.log(`[MCP] Successfully retrieved ${Object.keys(serverTools).length} tools from ${serverConfig.name}`)
            break // Success, exit retry loop
          } catch (toolError) {
            attempts++
            console.warn(`[MCP] Attempt ${attempts} failed to get tools from ${serverConfig.name}:`, toolError)
            if (attempts < maxAttempts) {
              // Wait before retrying (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, 500 * attempts))
            } else {
              console.error(`[MCP] Failed to get tools from ${serverConfig.name} after ${maxAttempts} attempts`)
              throw toolError
            }
          }
        }
        
        // Prefix tool names with server name to avoid conflicts
        const prefixedTools = Object.keys(serverTools).reduce((acc, toolName) => {
          const prefixedName = `${serverConfig.name}_${toolName}`
          const originalTool = serverTools[toolName]
          
          // Use the original tool directly from MCP client
          // The AI SDK should handle MCP tools correctly without modification
          acc[prefixedName] = originalTool
          console.log(`[MCP] Added tool ${prefixedName} with original MCP interface`)
          return acc
        }, {} as any)
        
        allTools = { ...allTools, ...prefixedTools }
        
        console.log(`[MCP] Successfully connected to MCP server: ${serverConfig.name} with ${Object.keys(serverTools).length} tools`)
      }
    } catch (error) {
      console.warn(`[MCP] Failed to connect to MCP server ${serverConfig.name}:`, error)
      // Continue with other servers even if one fails
    }
  }

  console.log(`[MCP] Connection process complete. Connected to ${clients.length} servers with ${Object.keys(allTools).length} total tools`)
  return { clients, allTools }
}

export async function POST(req: Request) {
  const { messages, includePropertyPictures, sessionId: existingSessionId } = await req.json()
  console.log(`[API] Received chat request with ${messages.length} messages`)
  console.log(`[API] Include property pictures: ${includePropertyPictures}`)
  console.log(`[API] Existing session ID: ${existingSessionId || 'none'}`)

  // Generate or use existing session ID
  const sessionId = existingSessionId || generateSessionId()
  const userId = getUserId(req)
  const timestamp = Date.now()

  // Track tool usage for this session
  const toolUsageTracker = {
    totalSteps: 0,
    toolCalls: [] as any[],
    toolResults: [] as any[]
  }

  console.log(`[API] Session ID: ${sessionId}, User ID: ${userId}`)

  // Save user messages to DynamoDB (only new messages)
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'user') {
      const userMessage: ChatMessage = {
        sessionId,
        messageId: generateMessageId(),
        role: 'user',
        content: lastMessage.content,
        timestamp,
        userId,
        includePropertyPictures,
        metadata: {
          userAgent: req.headers.get('user-agent'),
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
        }
      }
      
      // Save user message (don't await to avoid blocking)
      saveMessageToDynamoDB(userMessage).catch(console.error)
    }
  }

  try {
    // Get enabled MCP servers
    const enabledServers = getEnabledMCPServers()
    console.log(`[API] Found ${enabledServers.length} enabled MCP servers`)
    
    // Connect to MCP servers and get tools
    const startTime = Date.now()
    const { clients, allTools } = await connectToMCPServers(enabledServers)
    const connectionTime = Date.now() - startTime
        console.log(`[API] MCP connection process took ${connectionTime}ms`)
    console.log(`[API] Available tools:`, Object.keys(allTools))

    console.log('[API] Starting streamText...')
    console.log('[API] Tool count:', Object.keys(allTools).length)
    console.log('[API] Tool names:', Object.keys(allTools))
    
    // Build system prompt with conditional instructions
    const pictureInstruction = includePropertyPictures 
      ? "- When returning property data, make sure to include the first picture\n"
      : ""
    
    const result = streamText({
      model: getModel(),
      system: `You are a knowledgeable international real estate assistant helping clients find properties worldwide. You have access to various property platforms and tools through MCP (Model Context Protocol) integrations.

You should:
- Help clients explore property options in different countries
- Use MCP tools to fetch real-time property data when available
- Provide insights about local real estate markets, prices, and trends
- Discuss legal requirements for foreign property buyers
- Suggest popular areas and neighborhoods
- Explain visa/residency requirements related to property ownership
- Offer guidance on property types, investment potential, and lifestyle factors
- Be friendly, professional, and thorough in your responses
- Ask clarifying questions to better understand their needs
- When returning property data, include the source and the property url of the data in the response.
${pictureInstruction}
When using MCP tools, mention which platform the data is coming from to build trust and transparency.

Available MCP integrations: ${enabledServers.map((s: MCPServerConfig) => `${s.name} (${s.description})`).join(', ')}

IMPORTANT: When users ask about properties or real estate data, you MUST use the available MCP tools to fetch current data. Always try to use tools like demo_search_properties, demo_get_market_data, or demo_get_property_details when relevant. The tool results will contain the property data you need to include in your response.

Always be helpful and informative while encouraging them to consult with local real estate professionals for specific transactions.`,
      messages,
      tools: allTools,
      maxRetries: 3,
      maxSteps: 3, // Allow multiple steps for tool execution and response
      onStepFinish: async ({ text, toolCalls, toolResults, finishReason, usage }) => {
        toolUsageTracker.totalSteps++
        
        console.log(`[AI] Step ${toolUsageTracker.totalSteps} finished:`)
        console.log(`[AI]   - Text generated: ${text ? text.substring(0, 100) + '...' : 'none'}`)
        console.log(`[AI]   - Tool calls: ${toolCalls?.length || 0}`)
        
        if (toolCalls && toolCalls.length > 0) {
          toolCalls.forEach((call, idx) => {
            console.log(`[AI]   - Tool ${idx + 1}: ${call.toolName} with args:`, call.args)
            
            // Track tool calls with step information
            toolUsageTracker.toolCalls.push({
              step: toolUsageTracker.totalSteps,
              toolCallId: call.toolCallId,
              toolName: call.toolName,
              args: call.args,
              timestamp: Date.now()
            })
          })
        }
        
        console.log(`[AI]   - Tool results: ${toolResults?.length || 0}`)
        if (toolResults && toolResults.length > 0) {
          toolResults.forEach((result, idx) => {
            console.log(`[AI]   - Result ${idx + 1}:`, JSON.stringify(result, null, 2))
            
            // Track tool results with step information
            toolUsageTracker.toolResults.push({
              step: toolUsageTracker.totalSteps,
              toolCallId: result.toolCallId,
              toolName: result.toolName,
              result: result.result,
              timestamp: Date.now()
            })
          })
        }
        console.log(`[AI]   - Finish reason:`, finishReason)
      },
      onFinish: async (result) => {
        console.log(`[AI] Chat finished. Tool calls made:`, result.toolCalls?.length || 0)
        if (result.toolCalls && result.toolCalls.length > 0) {
          result.toolCalls.forEach((toolCall, index) => {
            console.log(`[AI] Tool call ${index + 1}:`, { 
              name: toolCall.toolName, 
              args: toolCall.args
            })
           })
        }
        console.log(`[AI] Final response length:`, result.text.length)
        console.log(`[AI] Response sample:`, result.text.substring(0, 200) + '...')
        
        // Save assistant response to DynamoDB
        const assistantMessage: ChatMessage = {
          sessionId,
          messageId: generateMessageId(),
          role: 'assistant',
          content: result.text,
          timestamp: Date.now(),
          userId,
          includePropertyPictures,
          toolCalls: toolUsageTracker.toolCalls,
          toolResults: toolUsageTracker.toolResults,
          metadata: {
            usage: result.usage,
            finishReason: result.finishReason,
            warnings: result.warnings,
            modelProvider: MODEL_PROVIDER,
            totalSteps: toolUsageTracker.totalSteps,
            toolUsageSummary: {
              totalToolCalls: toolUsageTracker.toolCalls.length,
              uniqueTools: [...new Set(toolUsageTracker.toolCalls.map(tc => tc.toolName))],
              callsPerTool: toolUsageTracker.toolCalls.reduce((acc, tc) => {
                acc[tc.toolName] = (acc[tc.toolName] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            }
          }
        }
        
        // Save assistant message (don't await to avoid blocking cleanup)
        saveMessageToDynamoDB(assistantMessage).catch(console.error)
        
        // Clean up MCP clients when streaming is finished
        for (const { client } of clients) {
          try {
            await client.close()
          } catch (error) {
            console.warn('Error closing MCP client:', error)
          }
        }
      },
      onError: async (errorObj) => {
        console.error('[AI] Streaming error occurred:', {
          error: errorObj.error,
          errorString: String(errorObj.error)
        })
        // Clean up MCP clients on error
        for (const { client } of clients) {
          try {
            await client.close()
          } catch (closeError) {
            console.warn('Error closing MCP client on error:', closeError)
          }
        }
      }
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Failed to initialize chat with MCP:', error)
    
    // Build system prompt with conditional instructions for fallback
    const pictureInstruction = includePropertyPictures 
      ? "- When returning property data, make sure to include the first picture\n      "
      : ""
    
    // Fallback to basic chat without MCP if initialization fails
    const result = streamText({
      model: getModel(),
      system: `You are a knowledgeable international real estate assistant helping clients find properties worldwide.

You should:
      
      - Help clients explore property options in different countries
      - Provide insights about local real estate markets, prices, and trends
      - Discuss legal requirements for foreign property buyers
      - Suggest popular areas and neighborhoods
      - Explain visa/residency requirements related to property ownership
      - Offer guidance on property types, investment potential, and lifestyle factors
      - Be friendly, professional, and thorough in your responses
      - Ask clarifying questions to better understand their needs
      ${pictureInstruction}
      Note: Advanced property platform integrations are temporarily unavailable.
      
      Always be helpful and informative while encouraging them to consult with local real estate professionals for specific transactions.`,
      messages,
      onFinish: async (result) => {
        console.log(`[AI] Fallback chat finished. Response length:`, result.text.length)
        
        // Save assistant response to DynamoDB (fallback mode)
        const assistantMessage: ChatMessage = {
          sessionId,
          messageId: generateMessageId(),
          role: 'assistant',
          content: result.text,
          timestamp: Date.now(),
          userId,
          includePropertyPictures,
          metadata: {
            usage: result.usage,
            finishReason: result.finishReason,
            warnings: result.warnings,
            modelProvider: MODEL_PROVIDER,
            mcpFallback: true
          }
        }
        
        // Save assistant message (don't await to avoid blocking)
        saveMessageToDynamoDB(assistantMessage).catch(console.error)
      }
    })

    return result.toDataStreamResponse()
  }
}
```

## AWS Setup

I'm using AWS CDK to deploy AWS ECS Fargate to run a NextJS app which has access to the MCP server and Anthropic Claude 4 Sonnet via AWS Bedrock. The nextjs app is configured as NextJS standalone app.

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export interface ListingsMcpServiceStackProps extends cdk.StackProps {
  cluster: ecs.Cluster;
}

export class ListingsMcpServiceStack extends cdk.Stack {
  public readonly fargateService: ecsPatterns.ApplicationLoadBalancedFargateService;

  constructor(scope: Construct, id: string, props: ListingsMcpServiceStackProps) {
    super(scope, id, props);

    const domainName = 'listings-mcp.com';

    // Look up the existing hosted zone for the domain
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName,
    });

    // Create an ACM certificate for the domain
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Create a Fargate service with an Application Load Balancer
    this.fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ListingsMcpService', {
      cluster: props.cluster,
      memoryLimitMiB: 512,
      cpu: 256,
      desiredCount: 1,
      enableExecuteCommand: true,
      certificate: certificate,
      domainName,
      domainZone: hostedZone,
      redirectHTTP: true,
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:3000/ || exit 1'],
      },
      
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('..'),
        containerPort: 3000,
        environment: {
          NODE_ENV: 'production',
          NEXT_TELEMETRY_DISABLED: '1',
          HOSTNAME: '0.0.0.0',
          TRUST_PROXY: '1',
          AWS_REGION: this.region,
          NEXT_PUBLIC_BASE_URL: '/'
        },
      },
    });

    // Add SES permissions to the task role for sending verification emails
    (this.fargateService.taskDefinition.taskRole as iam.Role).addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ses:SendEmail',
        'ses:SendRawEmail',
      ],
      resources: [
        `arn:aws:ses:${this.region}:${this.account}:identity/*`,
      ],
    }));

    // Add Cognito permissions to the task role for user management operations
    (this.fargateService.taskDefinition.taskRole as iam.Role).addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'cognito-idp:ListUsers',
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminUpdateUserAttributes',
        'cognito-idp:AdminGetUser',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:AdminInitiateAuth',
        'cognito-idp:InitiateAuth',
        'cognito-idp:RespondToAuthChallenge',
      ],
      resources: [
        `arn:aws:cognito-idp:${this.region}:${this.account}:userpool/${props.userPoolId}`,
      ],
    }));

    // Add STS permissions for getting AWS account information
    (this.fargateService.taskDefinition.taskRole as iam.Role).addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'sts:GetCallerIdentity',
      ],
      resources: ['*'],
    }));

    // Add CloudWatch Logs permissions for better logging and debugging
    (this.fargateService.taskDefinition.taskRole as iam.Role).addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'logs:DescribeLogStreams',
      ],
      resources: [
        `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/ecs/*`,
      ],
    }));

    // Add Bedrock permissions for AI model access
    (this.fargateService.taskDefinition.taskRole as iam.Role).addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream',
      ],
      resources: [
        `arn:aws:bedrock:*:${this.account}:inference-profile/*`,
        `arn:aws:bedrock:*::foundation-model/*`,
      ],
    }));

    // Add base URL environment variable after service creation
    this.fargateService.taskDefinition.defaultContainer?.addEnvironment(
      'NEXT_PUBLIC_BASE_URL',
      `https://${domainName}`
    );

    // Output the load balancer URL
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: this.fargateService.loadBalancer.loadBalancerDnsName,
      description: 'The DNS name of the load balancer',
    });

    // Output the custom domain URL
    new cdk.CfnOutput(this, 'ApplicationURL', {
      value: `https://${domainName}`,
      description: 'The URL of the application',
    });

    // Output the certificate ARN
    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
      description: 'The ARN of the SSL certificate',
    });
  }
} 
```

## Conclusion

So try out <https://listings-mcp.com> and let me know what you think. I'm curious if we can improve the property search experience by particular using MCP integrations from providers like [HalloCasa](https://hallocasa.com). I'm not that crazy of trying to compete with perplexity but maybe there is a niche for this. Maybe we can become a market place specifically for property MCP integrations.

If you need help with MCP integrations, let me know. I'm happy to help you.

If you want more details, like how I build the MCP integration or how I deploy the NextJS app via AWS CDK, reach out to me on [LinkedIn](https://www.linkedin.com/in/martinmueller88/). I'm super eager to share my knowledge with you.
