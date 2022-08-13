---
title: AWS CDK und Amplify UI runtime-config
show: "no"
date: "2022-08-10"
image: "lambda.png"
tags: ["de", "2022", "aws", "cdk"] #nofeed
engUrl: https://martinmueller.dev/cdk-amplify-runtime-config-eng
pruneLength: 50 #du
---

Ahoi,

Die nahtlose Integration von AWS CDK und Amplify Apps war bisher sehr umständlich! Mit einer runtime-config für die Amplify Frontend React App ist es nun wesentlich einfacher. Hier möchte ich dir gerne die Idee der runtime-config vorstellen.

In meinen Fullstack Projekten nutze ich regelmäßig AWS CDK als Backend. Dabei ist AppSync als GraphQL Implementation die Schnittstelle zwischen dem Frontend und Backend. Das Frontend ist normalerweise eine React SPA (Single Page Application) gehostet in einem S3. Zum Verwalten und Authentifizieren der User nutze ich AWS Cognito. Die Frontend React App konfiguriere ich üblicherweise mit AWS Amplify.

## Idee runtime-config

Die runtime-config erlaubt die Konfiguration von Amplify nach der Build-Phase zur Runtime. Dabei wird dem dist Folder der SPA einem File z.B. runtime-config.json im public Folder mitgegeben welcher zur Runtime der App ausgelesen wird. Diese kann dan zum Beispiel so aussehen:

```json
{
  "region": "eu-central-1",
  "identityPoolId": "eu-central-1:cda9c404-0e74-439d-b40c-90204a0e1234",
  "userPoolId": "eu-central-1_Uv0E91234",
  "userPoolWebClientId": "1t6jbsr5b7utg6c9urhj51234",
  "appSyncGraphqlEndpoint": "https://wr2cf4zklfbt3pxw26bik12345.appsync-api.eu-central-1.amazonaws.com/graphql"
}
```

Die runtime-config wird dann dynamisch in der React App geladen via useEffect:

```ts
useEffect(() => {
    fetch('/runtime-config.json')
      .then((response) => response.json())
      .then((runtimeContext) => {
        runtimeContext.region &&
          runtimeContext.userPoolId &&
          runtimeContext.userPoolWebClientId &&
          runtimeContext.identityPoolId &&
          Amplify.configure({
            aws_project_region: runtimeContext.region,
            aws_cognito_identity_pool_id: runtimeContext.identityPoolId,
            aws_cognito_region: runtimeContext.region,
            aws_user_pools_id: runtimeContext.userPoolId,
            aws_user_pools_web_client_id: runtimeContext.userPoolWebClientId,
            aws_appsync_graphqlEndpoint: runtimeContext.appSyncGraphqlEndpoint,
            aws_appsync_region: runtimeContext.region,
            aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
            Auth: {
              region: runtimeContext.region,
              userPoolId: runtimeContext.userPoolId,
              userPoolWebClientId: runtimeContext.userPoolWebClientId,
              identityPoolId: runtimeContext.identityPoolId,
            },
          });
      })
      .catch((e) => console.log(e));
  }, []);
```

Wie du siehst wird ein fetch zum laden der runtime-config.json initial ausgeführt. Danach wird Amplify mit der extrahierten properties konfiguriert.

Es können auch [HTML window variablen]() zum setzen der Amplify Parameter verwendet werden. Allerdings bevorzuge ich die hier vorgestellt fetch Lösung weil damit potentiell besser auf eine fehlende runtime-config.json oder einzeln fehlende Properties reagiert werden kann. Außerdem sollten window Variablen vermieden werden da diese globalen Zugriff auf den DOM bekommen.

## Workflows

Der typische Workflow ohne die runtime-config zum builden und deployen der React App lief bisweilen so ab:

* curl and store current endpoints wie user pool id, AppSynch endpoint and more
* build Amplify config file
* build react app
* cdk deploy react dist folder to S3

Build Pipeline Workflow mit runtime-config:

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

Die StaticWebsite ist ein simples L3 CDK Construct mit einem S3 static website bucket als Haupt-Ressource. Mehr Details siehst du [hier](https://github.com/senjuns/senjuns/blob/main/backend/src/construcs/static-website.ts). Die interessanten Details befinden sich aber im **runtimeOptions** Objekt. Dort werden also die Endpoints für die runtime config für Amplify hinterlegt. Dahinter steckt dann das S3 Bucket Deployment Construct welches die Endpoints via **s3deploy.Source.jsonData(...)** in die JSON Datei runtime-config.json überführt:

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

Während meiner Arbeit mit der runtime-config bin ich auf ein Problem gestoßen. Es ist nämlich nicht möglich CDK Outputs von einem Nested Stack für die runtime-config zu verwenden. Es gibt aber den Workaround mittels AWS Systems Manager Parameter:

```ts
const graphqlUrl = new ssm.StringParameter(this, 'GraphqlUrl', {
    parameterName: 'GraphqlUrl',
    stringValue: appSyncTransformer.appsyncAPI.graphqlUrl,
});

...

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

Cool oder? Der Nested Stack Output wird einfach in einem SSM String Parameter gespeichert und kann dann später ausgelesen werden. Vielen dank an Adrian Dimech für den tollen [Workaround](https://github.com/aws/aws-prototyping-sdk/issues/84) 🙏.

## Fazit

AWS CDK und Amplify sind eine starke Kombination. Mit der hier vorgestellten runtime-config fühlt sich diese Kombination wesentlich besser an! Ich hoffe ich konnte auch dir damit einen Anreiz geben mal die runtime-config auszuprobieren. Erzähl mir gerne wie es war.

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
