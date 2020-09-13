---
title: AWS CDK Let's build a Platform - Api Gateway
date: '2020-09-13'
image: 'api-gw.png'
tags: ['eng', '2020', 'aws', 'react', 'cdk']
gerUrl: https://martinmueller.dev/cdk-platform-api-gw
pruneLength: 50
---

Hi CDK Fans,

Welcome back to my little series "AWS CDK Let's build a platform". In the previous episode [AWS CDK Let's build a Platform - Frontend](https://martinmueller.dev/cdk-platform-frontend) I explained how we build a cool static React Web App with AWS CDK for my company [unimed.de](https://unimed.de).

AWS CDK is a framework for creating and using Cloudformation templates. You can choose between common programming languages like Java, Python or TypeScript. We have decided to use TypeScript. If you want to know more about AWS CDK I recommend my other posts here in my blog like [cdk-example](https://martinmueller.dev/cdk-example).

In this episode I will talk about the AWS Api Gateway which is used by the frontend application to retrieve or store internal data.

# Api Gateway
The AWS Api Gateway is the heart of many AWS deployments. It is a rest api for processing requests and the following responses. For example, if internal data is to be requested, this could be done with this request:

```
GET https://example.com/users
```

The response body could then look like this:

```JSON
[
    {"user": "Alice", "age":18},
    {"user": "Bob", "age":19}
]
```

So the Api Gateway receives a request, forwards it to an integration and then returns a response. The integration can be chosen from different technologies like Mock, HTTP Proxy, Lambda Proxy or other AWS services. When creating the API gateway, we decided to use the variant with the openApi specification. I already wrote about this in a [previous post](https://martinmueller.dev/cdk-swagger) and recommend you to read it.

In short, using an openApi specification offers some advantages like schema validation of the request parameters and a great documentation about the expected responses and possible error messages. Especially when using a NoSQL database like DynamoDB the validation of the request parameters is extremely important because the database itself does not provide a schema! And this is how an openApi Api Gateway looks like in CDK:

```TypeScript
const api = new SpecRestApi(this, this.stackName, {
    apiDefinition: ApiDefinition.fromAsset(join(__dirname, './path/to/api-gw.yaml')),
});
```

The openApi specification here called api-gw.yaml could look like this:

```YAML
openapi: "3.0.1
info:
  title: "example-endpoints"
  version: "2020-09-01T13:03:56Z"
paths:
  /enumerations:
    get:
      security:
      x-amazon-apigateway integration:
        type: "aws_proxy"
        uri: "arn:aws:apigateway:${AWS::region}:lambda:path/2015-03-31/functions/arn:aws:lambda:${AWS::region}:${AWS::AccountId}:function:example/invocations"
        passthroughBehavior: "when_no_match
        httpMethod: "POST
        credentials: "arn:aws:iam::@@ACCOUNT_ID@@@:role/apiRole"
    options:
      responses:
        200:
          description: "200 responses"
    ...
```

If you use Lambdas for your integrations you can also allow the Api Gateway to access your Lambdas right here:

```TypeScript
const apiRole = new Role(this, 'apiRole', {
    assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
});

apiRole.addToPolicy(new PolicyStatement({
    resources: ['*'],
    actions: ['lambda:InvokeFunction'],
}));
```

Alternatively, the Lambdas themselves could give the Api Gateway permission to call them.

Part of our staging pipeline, which I will explain in one of the following parts, are integration tests that are executed after each commit. At the moment it is "only" postmant tests that are executed via Newman:

```
npx newman run test/postman/example-com.postman_collection.json --env-var baseUrl=http://example.com --env-var keycloakUrl=http://keycloak-dev.example.com --env-var user=${testUserName} --env-var pass=${testUserPassword} -r cli,json --reporter-json-export tmp/newman/report.json
```

The user credentials are previously set in the build via secure environment variables, which are loaded from AWS SecurityManager.

# Summary
In this part of the "AWS CDK Let's build a Platform" series I have explained how the backend stack could look rough. What I left out on purpose is the information what comes behind the Api Gateway or Lambdas. Usually you access data from memory like maybe DynamoDB or RDS. But you might also want to trigger more complex processing with AWS Step Functions.

A great example how to do a CRUD implementation with API Gateway, Lambda and DynamoDB is described in another post (https://martinmueller.dev/cdk-example). Did you like the next part of my "AWS CDK Let's build a Platform" series? What do you want to know next? Let me know.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>