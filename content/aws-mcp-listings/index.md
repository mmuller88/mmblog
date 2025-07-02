---
title: A property listings AI chat with MCP integrations running in AWS 
show: "no"
date: "2025-07-07"
image: "index.jpg" 
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

We do have a [HalloCasa Zapier Integration](https://zapier.com/apps/hallocasa/integrations). That is quite convenient because Zapier allow you to use your integration as MCP server <https://zapier.com/mcp>. So very conveniently with Zapier MCP you choose the Zapier integration like HalloCasa, choose which tools you want to use and configure the parameters (if you need at all). After that Zapier provides you with an MCP server url which you can use in your AI chat.

This approach is incredible easy and powerful as it allows me to enhance the MCP quickly.

For putting together the AI Chat capabilities and the MCP integration, I'm using the AI libraries from Vercel [ai-sdk](https://ai-sdk.dev/). The [mcp-tools](https://ai-sdk.dev/cookbook/node/mcp-tools) make it incredible easy to build an AI chat with MCP integrations. I wrote everything down in a few hours. Of course cursor AI made most of the work.

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

If you want more details, like how I build the MCP integration or how I deploy the NextJS app via AWS CDK, reach out to me on [LinkedIn](https://www.linkedin.com/in/martinmueller88/). I'm super eager to share my knowledge with you.
