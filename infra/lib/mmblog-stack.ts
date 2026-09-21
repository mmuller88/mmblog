import * as path from "path"
import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib"
import * as acm from "aws-cdk-lib/aws-certificatemanager"
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2"
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as events from "aws-cdk-lib/aws-events"
import * as targets from "aws-cdk-lib/aws-events-targets"
import * as iam from "aws-cdk-lib/aws-iam"
import * as lambda from "aws-cdk-lib/aws-lambda"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import * as logs from "aws-cdk-lib/aws-logs"
import * as route53 from "aws-cdk-lib/aws-route53"
import * as targets53 from "aws-cdk-lib/aws-route53-targets"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager"
import * as ses from "aws-cdk-lib/aws-ses"
import { NagSuppressions } from "cdk-nag"
import { Construct } from "constructs"

const DOMAIN = "martinmueller.dev"
const WWW = `www.${DOMAIN}`
const FROM_EMAIL = `noreply@${DOMAIN}`
const TO_EMAIL = `office@${DOMAIN}`
const ALERT_EMAIL = `office+netlify@${DOMAIN}`
const GITHUB_REPO = "mmuller88/mmblog"

export class MmblogStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const zone = route53.HostedZone.fromLookup(this, "Zone", {
      domainName: DOMAIN,
    })

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Cert",
      "arn:aws:acm:us-east-1:981237193288:certificate/f6a8bfc2-da88-4967-b38a-79be2f8ae650"
    )

    const siteBucket = new s3.Bucket(this, "Site", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    })

    const likesTable = new dynamodb.Table(this, "Likes", {
      partitionKey: { name: "slug", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      removalPolicy: RemovalPolicy.RETAIN,
    })

    const secrets = new secretsmanager.Secret(this, "Secrets", {
      description:
        "mmblog JSON: OPENAI_ADS_CAPI_KEY, CALENDLY_WEBHOOK_SIGNING_KEY, CONVERSION_HEALTH_ALERT_URL",
      removalPolicy: RemovalPolicy.RETAIN,
    })

    // Domain already verified in this account; do not recreate (DKIM records exist).
    new ses.EmailIdentity(this, "SesOffice", {
      identity: ses.Identity.email(TO_EMAIL),
    })
    new ses.EmailIdentity(this, "SesAlert", {
      identity: ses.Identity.email(ALERT_EMAIL),
    })

    const sharedEnv = {
      SECRETS_ARN: secrets.secretArn,
      FROM_EMAIL,
    }

    const likesFn = this.apiFn("LikesFn", "likes.ts", {
      ...sharedEnv,
      LIKES_TABLE: likesTable.tableName,
    })
    likesTable.grantReadWriteData(likesFn)

    const webhookFn = this.apiFn("WebhookFn", "calendly-webhook.ts", sharedEnv)
    secrets.grantRead(webhookFn)

    const formsFn = this.apiFn("FormsFn", "forms.ts", {
      ...sharedEnv,
      TO_EMAIL,
    })
    this.grantSesSend(formsFn)

    const healthFn = this.apiFn(
      "HealthFn",
      "conversion-health.ts",
      {
        ...sharedEnv,
        ALERT_EMAIL,
        WEBHOOK_URL: `https://${DOMAIN}/api/calendly-webhook`,
      },
      Duration.seconds(60)
    )
    secrets.grantRead(healthFn)
    this.grantSesSend(healthFn)

    const httpApi = new apigwv2.HttpApi(this, "Api")

    httpApi.addRoutes({
      path: "/api/likes",
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration("LikesInt", likesFn),
    })
    httpApi.addRoutes({
      path: "/api/calendly-webhook",
      methods: [apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration("WebhookInt", webhookFn),
    })
    httpApi.addRoutes({
      path: "/api/forms",
      methods: [apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration("FormsInt", formsFn),
    })

    new events.Rule(this, "HealthDaily", {
      schedule: events.Schedule.cron({ minute: "0", hour: "7" }),
      targets: [new targets.LambdaFunction(healthFn)],
    })

    const viewerFn = new cloudfront.Function(this, "ViewerReq", {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, "viewer-request.js"),
      }),
    })
    const viewerAssoc: cloudfront.FunctionAssociation = {
      function: viewerFn,
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
    }

    const apiOrigin = new origins.HttpOrigin(
      `${httpApi.apiId}.execute-api.${this.region}.amazonaws.com`,
      { protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY }
    )

    const distribution = new cloudfront.Distribution(this, "Cdn", {
      comment: DOMAIN,
      domainNames: [DOMAIN, WWW],
      certificate,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        functionAssociations: [viewerAssoc],
      },
      additionalBehaviors: {
        "/api/*": {
          origin: apiOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          functionAssociations: [viewerAssoc],
        },
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/404.html",
        },
      ],
    })

    const manageDns = String(this.node.tryGetContext("manageDns")) === "true"
    if (manageDns) {
      const target = route53.RecordTarget.fromAlias(
        new targets53.CloudFrontTarget(distribution)
      )
      new route53.ARecord(this, "ApexA", { zone, target })
      new route53.AaaaRecord(this, "ApexAaaa", { zone, target })
      new route53.ARecord(this, "WwwA", { zone, recordName: "www", target })
      new route53.AaaaRecord(this, "WwwAaaa", {
        zone,
        recordName: "www",
        target,
      })
    }

    const githubProvider =
      iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
        this,
        "GitHubOidc",
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`
      )

    const deployRole = new iam.Role(this, "GitHubDeploy", {
      assumedBy: new iam.FederatedPrincipal(
        githubProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
          StringLike: {
            "token.actions.githubusercontent.com:sub": [
              `repo:${GITHUB_REPO}:ref:refs/heads/master`,
              `repo:${GITHUB_REPO}:environment:production`,
            ],
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      description: "GitHub Actions deploy mmblog",
      maxSessionDuration: Duration.hours(1),
    })

    siteBucket.grantReadWrite(deployRole)
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        ],
      })
    )
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["sts:AssumeRole"],
        resources: [
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-deploy-role-${this.account}-${this.region}`,
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-file-publishing-role-${this.account}-${this.region}`,
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-image-publishing-role-${this.account}-${this.region}`,
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-lookup-role-${this.account}-${this.region}`,
        ],
      })
    )
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/cdk-bootstrap/hnb659fds/version`,
        ],
      })
    )

    new CfnOutput(this, "BucketName", { value: siteBucket.bucketName })
    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    })
    new CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    })
    new CfnOutput(this, "DeployRoleArn", { value: deployRole.roleArn })
    new CfnOutput(this, "SecretsArn", { value: secrets.secretArn })

    this.nag(likesFn, webhookFn, formsFn, healthFn, deployRole)
  }

  private apiFn(
    id: string,
    entry: string,
    environment: Record<string, string>,
    timeout = Duration.seconds(30)
  ): NodejsFunction {
    return new NodejsFunction(this, id, {
      entry: path.join(__dirname, "../lambda", entry),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_24_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout,
      environment,
      logGroup: new logs.LogGroup(this, `${id}Logs`, {
        retention: logs.RetentionDays.ONE_MONTH,
        removalPolicy: RemovalPolicy.DESTROY,
      }),
      bundling: {
        minify: true,
        sourceMap: false,
        target: "node24",
      },
    })
  }

  private grantSesSend(fn: NodejsFunction): void {
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail"],
        resources: [
          `arn:aws:ses:${this.region}:${this.account}:identity/${DOMAIN}`,
        ],
      })
    )
  }

  private nag(
    likesFn: NodejsFunction,
    webhookFn: NodejsFunction,
    formsFn: NodejsFunction,
    healthFn: NodejsFunction,
    deployRole: iam.Role
  ): void {
    NagSuppressions.addStackSuppressions(this, [
      {
        id: "AwsSolutions-CFR1",
        reason: "Public global blog, no geo restriction",
      },
      {
        id: "AwsSolutions-CFR2",
        reason: "Shield Standard; WAF later for cost",
      },
      {
        id: "AwsSolutions-CFR3",
        reason: "Skip CF access logs for cost on a personal blog",
      },
      {
        id: "AwsSolutions-S1",
        reason: "Skip S3 access logs for cost on a personal blog",
      },
      {
        id: "AwsSolutions-SMG4",
        reason: "API keys rotated manually; no rotation Lambda",
      },
      {
        id: "AwsSolutions-APIG1",
        reason: "HTTP API access logs skipped for cost",
      },
      {
        id: "AwsSolutions-APIG4",
        reason: "Public likes/forms/webhook; webhook HMAC verified in Lambda",
      },
      {
        id: "AwsSolutions-COG4",
        reason: "No Cognito; public blog API",
      },
    ])

    for (const fn of [likesFn, webhookFn, formsFn, healthFn]) {
      NagSuppressions.addResourceSuppressions(
        fn,
        [
          {
            id: "AwsSolutions-IAM4",
            reason: "AWSLambdaBasicExecutionRole for CloudWatch logs",
          },
          {
            id: "AwsSolutions-IAM5",
            reason: "NodejsFunction log group wildcard is CDK-generated",
          },
        ],
        true
      )
    }

    NagSuppressions.addResourceSuppressions(
      deployRole,
      [
        {
          id: "AwsSolutions-IAM5",
          reason: "GitHub deploy needs s3:* on site bucket objects + cdk roles",
        },
      ],
      true
    )
  }
}
