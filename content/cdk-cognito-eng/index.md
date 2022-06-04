---
title: AWS Cognito Auth Mock
date: '2020-11-16'
image: 'cognito.jpg'
tags: ['eng', '2020', 'aws', 'cdk', 'postman', 'cognito']
gerUrl: https://martinmueller.dev/cdk-cognito
pruneLength: 50
---

Ahoi AWS'ler

In my [AWS project](https://martinmueller.dev/alf-provisioner-eng), where I can start, stop and schedule instances of Alfresco via REST API, I use AWS Cognito as identity provider for user management. Cognito makes it easy for me to create new users and give them the rights to access the REST API.

The REST API is implemented using AWS API Gateway and a Cognito Authorizer allows users from the Cognito Identity Pool to access the endpoints.

The Cognito Authorizer is especially important because I have implemented a permission layer that prevents users from manipulating Alfresco instances of other users. Basically the Permission Layer works with the User ID returned by the Cognito Authorization process if the authorization was successful.

This works great, but I would like to have automated tests to test the functionality of the permission layer. It would be great if I could use Postman for this. Unfortunately this is not possible because the authentication process with Cognito requires user interaction to retrieve the credentials.

The solution for me was to write a Mock Authentication Layer which simulates the exact behavior of the Cognito Authorizer. For this I used Middy. What Middy is and how exactly my solution looks like I will describe in the next sections.

# Middy as Mock Auth Layer
[Middy](https://github.com/middyjs/middy) is a simple framework for building layers in Lambda functions. With this framework it is possible to encapsulate all features that are not directly related to business logic in layers. In my case I want to implement a Mock Auth Layer that simulates the Cognito authorization. This layer should be optionally switchable by environmental variables.

The complete code for the Auth Layer can be found on [GitHub](https://github.com/mmuller88/alf-cdk/blob/master/src/util/mockAuthLayer.ts).

```TypeScript
const mockAuthLayer = (config?: MockAuthLayerConfig) => {
  return {
    before: (handler: any, next: () => void) => {
      handler.event = handler.event ?? {};
      handler.event.headers = handler.event.headers ?? {};
      const mockHeaderPrefix = config?.mockHeaderPrefix || 'MOCK_AUTH_';
      Object.keys(handler.event.headers)
        .filter((headerKey) => {
          return headerKey.startsWith(mockHeaderPrefix);
        })
        .forEach((headerKey) => {
          const headerValue = handler.event.headers[headerKey] || 'martin';
          handler.event.requestContext = handler.event.requestContext ?? {};
          handler.event.requestContext.authorizer = handler.event.requestContext.authorizer ?? {};
          handler.event.requestContext.authorizer.claims = handler.event.requestContext.authorizer.claims ?? {};
          handler.event.requestContext.requestContext.authorizer.claims[
            headerKey.substring(mockHeaderPrefix.length).replace(/&/g, ':')
          ] = headerValue;
          console.log(`shifted header ${JSON.stringify(handler)}`);
        });
      next();
    },
  };
};
```

Ok let's have a look at the code.

```TypeScript
const mockHeaderPrefix = config?.mockHeaderPrefix || 'MOCK_AUTH_';
  Object.keys(handler.event.headers)
    .filter((headerKey) => {
      return headerKey.startsWith(mockHeaderPrefix);
      ...
```

So I filter all headers that start with a certain prefix. If none is set I use **MOCK_AUTH**.

```TypeScript
const headerValue = handler.event.headers[headerKey] || 'martin';
  handler.event.requestContext = handler.event.requestContext ?? {};
  handler.event.requestContext.authorizer = handler.event.requestContext.authorizer ?? {};
  handler.event.requestContext.authorizer.claims = handler.event.requestContext.authorizer.claims ?? {};
  handler.event.requestContext.requestContext.authorizer.claims[
    headerKey.substring(mockHeaderPrefix.length).replace(/&/g, ':')
  ] = headerValue;
```

Then the headers are copied into the Authorizer Claims area which would also contain the Cognito Values. This way my Lambda has access to the authenticated user and role. How to set the **MOCK_AUTH_** headers is shown in the next section.

At the end with **.replace(/&/g, ':')** there is a small symbol replacement because Postman does not allow to use double colons **:** in the header key.

# Lambda Unit Tests
For my Lambdas I have written unit tests which should also take the authorization into account. From my code I pick a unit test file on [GitHub](https://github.com/mmuller88/alf-cdk/blob/master/test/get-all-conf-api.spec.ts) and explain it in more detail.

```TypeScript
...
it('from himself will success', async (done) => {
  awsSdkPromiseResponse.mockReturnValueOnce({ Items: [{ instanceId: 'i123', userId: 'martin' }] });
  await handler(
    {
      headers: {
        'MOCK_AUTH_cognito:username': 'martin',
        'MOCK_AUTH_cognito:groups': 'Admin',
      },
      queryStringParameters: { userId: 'martin' },
    },
    {} as Context,
    (_, result) => {
      expect(result?.statusCode).toBe(200);
      ...
```

So as we can see here I use the mock header **MOCK_AUTH_cognito:username': 'martin'** and **'MOCK_AUTH_cognito:groups': 'Admin'** . With this I simply simulate the authorization behavior of Cognito and make the username and user groups known to the Lambda at runtime. Fair enough.

# Postman Tests
Of course my Postman tests should also be able to use the new Auth Mock Layer. On [GitHub](https://github.com/mmuller88/alf-cdk-api-gw/blob/master/test/alf-cdk.postman_collection.json) I have a Postman Collection with over 40 requests. The whole collection is executed by Newman after building the DEV environment as an integration test:

```TypeScript
  ...
  testCommands: (stageAccount) => [
    ...(stageAccount.stage === "dev"
      ? [
          `npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json; RESULT=$? || \,
          ./scripts/cleanup.sh
          exit $RESULT`,
        ]
      : []),
  ],
  ...
```

To use the Mock Auth Layer you just have to set the headers, like you did with the unit tests in the previous section:

```
MOCK_AUTH_cognito&username = martin
MOCK_AUTH_cognito&groups = Admin
```

But I had to make one change. Postman does not allow to have a double colon in the header key. So I had to add a symbol replacement. The AND character **&** is translated to the double colon **:** in the code.

If you are interested in testing with CDK, I can recommend my blog post from [last week](https://martinmueller.dev/pipeline-testing-eng).

# Summary
AWS Cognito is mega cool and fast to set up. It offers a range of great user management functions. Unfortunately, it is not possible to run the Cognito authorization process completely automated, e.g. for automated tests. But that doesn't matter because I simply simulate the Cognito authorization with my Auth Mock Layer. Now to you. Did you like the article? Do you want to know more? Let me know.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>