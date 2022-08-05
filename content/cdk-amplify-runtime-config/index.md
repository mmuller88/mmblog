---
title: AWS CDK und Amplify UI
show: "no"
date: "2022-07-10"
image: "lambda.png"
tags: ["de", "2022", "aws"] #nofeed
engUrl: https://martinmueller.dev/cdk-amplify-runtime-config-eng
pruneLength: 50 #du
---

Ahoi,

* Benutze AWS CDK als Backend wie AppSync, Cognito, S3 Static Website Bucket
* Für Frontend nutze ich eine SPA gebaut mit React TS und Amplify UI
* Amplify UI erfordert

Build Pipeline Workflow without runtime config:

* curl and store current endpoints wie user pool id, AppSynch endpoint and more
* build Amplify config file
* build react app
* cdk deploy react dist folder to S3

Build Pipeline Workflow with runtime config:

* build react app
* cdk deploy react dist folder and runtime config to S3

## CDK Beispiel

Der Komplette Code is in meinem [GitHub Senjuns Projekt](https://github.com/senjuns/senjuns/blob/main/backend/src/dashboard-stack.ts) einsehbar.

```ts
 const dashboard = new StaticWebsite(this, 'dashboard', {
    build: '../dashboard/build',
    recordName: 'dashboard',
    domainName: props.domainName,
    runtimeOptions: {
        jsonPayload: {
            region: core.Stack.of(this).region,
            identityPoolId: identityPool.ref,
            userPoolId: userPool.userPoolId,
            userPoolWebClientId: userPoolWebClient.userPoolClientId,
            appSyncGraphqlEndpoint: graphqlUrl.stringValue,
        },
    },
});
```

Die StaticWebsite ist ein simples L2 CDK Construct mit einem S3 static website bucket als Haupt-Ressource. Mehr Details siehst du [hier](https://github.com/senjuns/senjuns/blob/main/backend/src/construcs/static-website.ts). Die interessanten Details befinden sich aber im **runtimeOptions** Objekt. Dort werden also die Endpoints für die runtime config für Amplify hinterlegt. Dahinter steckt dann das S3 Bucket Deployment construct welches die Endpoints via **s3deploy.Source.jsonData(...)** in die JSON Datei runtime-config.json überführt:

```ts
const DEFAULT_RUNTIME_CONFIG_FILENAME = 'runtime-config.json';

...

new s3deploy.BucketDeployment(this, 'BucketDeployment', {
    sources: [
    s3deploy.Source.asset(props.build),
    ...(props.runtimeOptions
        ? [
        s3deploy.Source.jsonData(
            props.runtimeOptions?.jsonFileName ||
                DEFAULT_RUNTIME_CONFIG_FILENAME,
            props.runtimeOptions?.jsonPayload,
        ),
        ]
        : []),
    ],
    distribution,
    destinationBucket: siteBucket,
});
```

Das ist doch mal ne coole CDK integration :) !

## Vorteile

* Keine aufwendigen Scripts mehr nötig die die Endpoints curlen müssen
* 

## Workaround mit nested Stack Outputs

* 
* verwende keine nested stacks wenn möglich

## Fazit

Das catchen von Lambda Timeouts ist nervig. Mit ein wenig AWS CDK Code und der Lambda Duration Metrik ist das Problem schnell gelöst.

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
