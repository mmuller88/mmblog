---
title: AWS CDK Api Gateway with Swagger
description: AWS CDK example mit Swagger for Api Gateway
show: 'no'
date: '2020-04-05'
image: 'swagger.png'
tags: ['eng', '2020', 'aws', 'swagger', 'cdk', 'cfd', 'github', 'travis']
gerUrl: https://martinmueller.dev/cdk-swagger
pruneLength: 50
---

Ahoi AWS'ler and Swagger fans

In the last post I showed how [AWS CDK](https://martinmueller.dev/cdk-example-eng) can be used as a welcome alternative to YAML for describing your cloud infrastructure. Working on my CDK project from I encountered a problem handling Swagger files. But first I want to explain what the Swagger definitions are. It should also be said that the new version of Swagger has been called OpenApi since 2018. When using AWS API Gateway, it is convenient to use Swagger for parameter validation such as Query, Path and Body Parameter. What exactly Swagger is and why I think it's so great I describe in the next section.

# What is Swagger
[Swagger](https://swagger.io/docs/specification/2-0/what-is-swagger/) is a YAML or JSON template language for describing RESTful APIs. Following I describe what is great about Swagger. First of all, the templates are extremely suitable as documentation about the API itself, because a stylish looking HTML UI can be generated out of the template, which describes the API endpoints very well. Such an UI can be seen in the cover of this blog post. Even more brilliant is the UI that can be used directly to test the endpoints, i.e. to send and receive requests and responses. Many API interfaces, like the AWS API Gateway, offer the parameter validation of requests with using Swagger. I give a little example for what I mean by parameter validation using the following example:

```YAML
parameters:
    - in: query
    name: userId
    description: Get items of that user
    required: true
    type: string
```

Here you can see a parameter of the type query. That means it would look something like this in the URL

```
http://<url>/items?userId=martin
```

With parameter validation, I can then define certain properties of the parameter, such as the name **userId**, whether it is required and what type the value should be, in our case as of the type string.

Another very powerful feature is that it is possible to generate client libaries from the Swagger definition (https://swagger.io/tools/swagger-codegen/). For example, Alfresco does this with the [API Explorer](https://api-explorer.alfresco.com/api-explorer/) (For more information, see [GitHub Api-Explorer](https://github.com/Alfresco/rest-api-explorer)) and [ADF](https://www.alfresco.com/abn/adf/) (or [ADF JS Github](https://github.com/Alfresco/alfresco-js-api)). There, for example, the [Swagger File](https://github.com/Alfresco/rest-api-explorer/blob/master/src/main/webapp/definitions/alfresco-core.yaml) becomes the JavaScript API Library generated, which can be used as a wrapper for the API requests and is also in [ADF Components Github](https://github.com/Alfresco/alfresco-ng2-components).

It's also cool, [Postman](https://www.postman.com/automated-testing) offers an import feature for Swagger definitions. Then a collection is created immediately. This is very handy if you want to start writing the requests in Postman.

# AWS Api Gatway with Swagger
All the features from the previous section sound very tempting, don't they? How nice that AWS API Gateway also offers to [extract](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-export-api.html) Swagger definitions from its deployments and also to import it using CloudFormation or CDK. Unfortunately in connection with [AWS CDK](https://github.com/aws/aws-cdk), extracted Swagger files are not so easy to reuse for their description. The biggest problem is that if, for example, a lambda is updated, its ARN also changes. However, the Swagger Files extracted from the API Gateway use exactly these ARNs when Lambda is used as a backend implementation for an endpoint. And since the ARN changes, they are outdated in the swagger file. Below is a Swagger Snippet and there you can see the Arn I'm talking about behind the **uri** keyword.

```YAML
paths:
  / items:
    get:
      responses:
        '200':
          description: Ok
          content: {}
        '401':
          description: Authorization information is missing or invalid
          content: {}
      x-amazon-apigateway-integration:
        uri:> -
          arn: aws: apigateway: [secure]: lambda: path/2015-03-31/functions/arn: aws: lambda: [secure]: [secure]: function: ApiLambdaCrudDynamoDBExam-getAllItemsFunction0B7A9-1KKCGIJ01C3NI/invocations
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
      parameters:
        - $ ref: '#/parameters/alfUserIdParam'
      x-amazon-apigateway-request-validator: Validator
```

The AWS CDK team knows about this problem and it is on the roadmap. So hopefully if you read this post the following workaround is no longer necessary. For completeness, I list the related issues here:

https://github.com/aws/aws-cdk/issues/723
https://github.com/aws/aws-cdk/issues/1461

# Workaround
To solved the problem with deploying CDK twice. The first deploy does not use a swagger definition but the second does. It is really interesting how I generated the Swagger file. In the following I try to describe the process, but please also look into [my GitHub repo](https://github.com/mmuller88/cdk-swagger) (there in .travis) for how I implemented this workaround.

1) I deploy or Swagger File with:

```
export WITH_SWAGGER = 'false' && cdk deploy --require-approval never
```

WITH_SWAGGER is an env variable in the CDK Deployment File index.ts. This means that no swagger file is used programmatically for the deployment.

2) Now I can use the AWS CLI to extract the swagger file from the API gateway:

```
aws apigateway get-export --parameters extensions = 'integrations' --rest-api-id $ REST_API_ID --stage-name prod --export-type swagger --accepts application/yaml tmp/swagger_new.yaml
```

The generated Swagger File tmp/swagger_new.yaml looks something like this:

```YAML
swagger: '2.0'
info:
    version: '2020-03-29T16: 59: 22Z'
    title: Items Service
host: hjtiuj2ou1.execute-api. [secure] .amazonaws.com
basePath:/prod
schemes:
    - https
paths:
    / items:
        get:
            responses:
                '200':
                description: Ok
                '401':
                description: Authorization information is missing or invalid
            x-amazon-apigateway-integration:
                uri:> -
                arn: aws: apigateway: [secure]: lambda: path/2015-03-31/functions/arn: aws: lambda: [secure]: [secure]: function: ApiLambdaCrudDynamoDBExam-getAllItemsFunction0B7A9-1MLKSKO1RUL3I/invocations
                passthroughBehavior: when_no_match
                httpMethod: POST
                type: aws_proxy
            x-amazon-apigateway-request-validator: Validator
        post Office:
    ...
```

3) It looks very good. However, the parameter validation is still missing. For this a second Swagger definition has to be created manually templates/swagger_validations.yaml and looks something like this:

```YAML
paths:
    / items:
        get:
        parameters:
            - Name: alfUserId
            in: query
            required: false
            type: string
            $ ref: '#/parameters/alfUserIdParam'
```

4) What we want now is a merge of both swagger files. NPM offers a useful tool for merging YAML files:

```
npm i -g merge-yaml-cli
```

The Swagger definition tmp/swagger_full.yaml now contains the current LambdaUri and the parameter validation:

```YAML
swagger: '2.0'
info:
  version: '2020-03-29T16: 59: 22Z'
  title: Items Service
host: hjtiuj2ou1.execute-api. [secure] .amazonaws.com
basePath:/prod
schemes:
  - https
paths:
  / items:
    get:
        parameters:
            - Name: alfUserId
            in: query
            required: false
            type: string
            $ ref: '#/parameters/alfUserIdParam'
        responses:
            '200':
            description: Ok
            '401':
            description: Authorization information is missing or invalid
        x-amazon-apigateway-integration:
            uri:> -
            arn: aws: apigateway: [secure]: lambda: path/2015-03-31/functions/arn: aws: lambda: [secure]: [secure]: function: ApiLambdaCrudDynamoDBExam-getAllItemsFunction0B7A9-1MLKSKO1RUL3I/invocations
            passthroughBehavior: when_no_match
            httpMethod: POST
            type: aws_proxy
        x-amazon-apigateway-request-validator: Validator
    post Office:
    ...
```

5) Now this swagger file can be used in the second CDK deployment:

```
export WITH_SWAGGER = 'true' && cdk deploy --require-approval never
```

Attention!: Always take care with creating a new stage deployment in AWS API Gateway. I do this in Travis with the AWS CLI:

```
aws apigateway create-deployment --rest-api-id $ REST_API_ID --stage-name prod
```

# Summary
Swagger Definitions are ideal for creating, editing, documenting and testing APIs such as those from AWS Api Gateway. They are not only useful directly in the backend. As well they are suited in the frontend because Swagger can generate amazing looking and useful Swagger UI to understand the backend better in a way shorter time.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>