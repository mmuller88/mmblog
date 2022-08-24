---
title: AWS CDK und Amplify UI runtime-config
show: "no"
date: "2022-08-27"
image: "title.png"
tags: ["eng", "2022", "aws", "cdk"] #nofeed
gerUrl: https://martinmueller.dev/cdk-amplify-runtime-config
pruneLength: 50 #du
---

Hi,

Seamless integration of AWS CDK and Amplify apps used to be very cumbersome! With a runtime-config for the Amplify frontend React app, it's now much easier. Here I would like to introduce you to the idea of runtime-config.

In my fullstack projects, I regularly use AWS CDK as a backend. Here AppSync as a GraphQL implementation is the interface between the frontend and backend. The frontend is usually a React SPA (Single Page Application) hosted in an S3. I use AWS Cognito to manage and authenticate the users. I usually configure the frontend React app using AWS Amplify.

## Idea runtime-config

The runtime-config allows you to configure Amplify after the build phase to runtime. The dist folder of the SPA is given a file e.g. runtime-config.json in the public folder which is read out for the runtime of the app. This can look like this for example:

```json
{
  "region": "eu-central-1",
  "identityPoolId": "eu-central-1:cda9c404-0e74-439d-b40c-90204a0e1234",
  "userPoolId": "eu-central-1_Uv0E91234",
  "userPoolWebClientId": "1t6jbsr5b7utg6c9urhj51234",
  "appSyncGraphqlEndpoint": "https://wr2cf4zklfbt3pxw26bik12345.appsync-api.eu-central-1.amazonaws.com/graphql"
}
```

The runtime-config is then dynamically loaded in the React app via useEffect:

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

As you can see, a fetch to load the runtime-config.json is executed initially. After that Amplify is configured with the extracted properties.

You can also use [HTML window variables]() to set the Amplify parameters. However, I prefer the fetch solution presented here because it is potentially more responsive to a missing runtime-config.json or single missing properties. Also, window variables should be avoided as they get global access to the DOM.

## Workflows

The typical workflow without the runtime-config to build and deploy the React app sometimes went like this:

* curl and store current endpoints like user pool id, AppSynch endpoint and more.
* build Amplify config file
* build react app
* cdk deploy react dist folder to S3

Build pipeline workflow with runtime-config:

* build react app
* cdk deploy react dist folder and runtime config to S3

## CDK example

The complete code is available in my [GitHub Senjuns project](https://github.com/senjuns/senjuns/blob/main/backend/src/dashboard-stack.ts).

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

The StaticWebsite is a simple L3 CDK construct with an S3 static website bucket as the main resource. You can see more details [here](https://github.com/senjuns/senjuns/blob/main/backend/src/construcs/static-website.ts). But the interesting details are in the **runtimeOptions** object. There the endpoints for the runtime config for Amplify are stored. Behind this is the S3 Bucket Deployment Construct which transfers the endpoints via **s3deploy.Source.jsonData(...)** into the JSON file runtime-config.json:

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

This is a cool CDK integration :) ! Just giving the BucketDeployment Construct the two parameters like the React dist and the runtime-config is a pretty smart idea.

## Workaround with nested stack outputs

During my work with the runtime-config I encountered a problem. It is not possible to use CDK outputs from a nested stack for runtime-config. But there is a workaround using AWS Systems Manager parameters:

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

Cool, right? The nested stack output is simply stored in an SSM string parameter and can then be read later. Thanks to Adrian Dimech for the great [workaround](https://github.com/aws/aws-prototyping-sdk/issues/84) 🙏.

## Conclusion

AWS CDK and Amplify are a powerful combination. With the runtime-config presented here, this combination feels much better! I copied this solution from [aws-prototyping-sdk](https://github.com/aws/aws-prototyping-sdk). There are some interesting AWS CDK constructs being developed in this repo. So you should definitely check it out!

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
