---
title: ALPS API combined with AWS CDK
show: 'no'
date: '2020-12-12'
image: 'alps.png'
tags: ['eng', '2020', 'aws', 'swagger', 'cdk', 'alps', 'openapi', 'nofeed']
gerUrl: https://martinmueller.dev/alps-cdk
pruneLength: 50
---

Hi :).

AWS offers many exciting API technologies. These are for example the AWS API Gateway which is an implementation of a REST API or AWS Appsync which implements a GRAPH QL API.

Each of these AWS API implementations has its advantages and disadvantages. For example, the Appsync API can be built faster than the API Gateway, but it becomes more complicated when building queries and the Graph QL. Admittedly I don't know enough about the pros and cons of the different API implementations in AWS, but I don't have to now!

With my exciting work with ALPS in combination with AWS CDK, I can make the API freely selectable or even swap it for each other, all based on an ALPS specification (short Spec).

What exactly an ALPS Spec is and how to create complete APIs like Api Gateway or Appsync with the help of AWS CDK, I will explain in the next sections.

# ALPS API
ALPS is a specification for describing the bounded context of a service. ALPS can be used as a source material to generate lower abstracted specifications like OpenApi / Swagger, WSDL, RAML, WADL.

When I saw the YouTube video, I immediately found the idea of ALPS cool and exciting. Like every good developer I love abstractions and ALPS seems to be an extremely cool abstraction. I immediately had the idea to combine the ALPS Api with AWS CDK constructs. That's exactly what I did and I'll report more details in the next section.

# AWS CDK ALPS Constructs

AWS CDK Constructs are short source code for resources in AWS. They use abstract languages like TypeScript or Python and generate from the code cloudformation templates which are then applied with the AWS CDK framework. If you are interested in more details about AWS CDK, I have many posts about [CDK written here](https://martinmueller.dev/tags/cdk).

My goal was to build AWS APIs like Api Gateway and Appsync with the help of ALPS Specs. In the following I show an ALPS Spec example. Then I describe the construct where I build an AWS Api Gateway from an ALPS Spec, which implements a REST API. After that I show how to build an appsync from the same ALPS Spec, which implements a Graph QL.

The two following libraries are automatically released after [NPM](https://www.npmjs.com/) (for JavaScript and TypeScript) and [PYPI](https://pypi.org/) (for Python). In the future I plan to publish to a public Maven repository and .Net package repository.

## ALPS Spec Example

The following example is a simple TODO API.

```YAML

alps:
  version: '1.0'
  doc:
    value: 'Simple Todo list example'

  ####################################
  # metadata
  ext:
    - type: metadata
      name: title
      value: simpleTodo
      tags: 'oas'
    - type: metadata
      name: id
      value: http://alps.io/profiles/mamund/simpleTodo
      tags: 'oas'
    - type: metadata
      name: root 
      value: http://api.example.org/todo
      tags: 'oas'
  
  descriptor:
    # properties
    # - these are the data elements
    - id: id
      type: semantic
      text: storage id of todo item
      
    - id: body
      type: semantic
      text: content of todo item

    # groupings
    # - these are the storage objects
    - id: todoItem
      type: group
      text: todo item
      descriptor:
      - href: '#id'
      - href: '#body'

    # actions
    # - these are the operations
    - id: todoList
      type: safe
      rt: todoItem
      text: return list of todo items
            
    - id: todoAdd
      type: unsafe
      rt: todoItem
      text: create a new todo item
      descriptor:
      - href: '#todoItem'
      
    - id: todoRemove
      type: idempotent
      tags: delete
      rt: todoItem
      text: remove a single todo item
      descriptor:
      - href: '#id'

```

The element **todoItem** consists of an **id** and a todo string **body**. There are three actions defined **todoList** to list the todo entries, **todoAdd** to add new todos and **todoRemove** to delete todo entries.

## CDK ALPS REST API Construct Library

The first ALPS CDK Construct I implemented is the CDK ALPS REST API Construct in my [github repo](https://github.com/mmuller88/cdk-alps-spec-rest-api) . It creates an AWS Api Gateway using the [CDK SpecRestApi Constructs](_COPY19@aws-cdk_aws-apigateway.SpecRestApi.html). You only have to pass an openApi Spec generated from the ALPS to the AWS Api Gateway:

```ts
const api = new apigw.SpecRestApi(this, 'SpecRestApi', {
  apiDefinition: apigw.ApiDefinition.fromInline(oasSpecJSON),
});
```

## CDK ALPS Graph QL API Construct Library

The second ALPS CDK Construct was much more exciting for me, because I used AWS Appsync as Graph QL Api and it was completely new for me. But again it was very easy and I was able to finish the construct in a few hours here on [github](https://github.com/mmuller88/cdk-alps-graph-ql). The ALPS compiler translates the ALPS spec into the Graph QL Schema and passes it to the [CDK GraphqlApi Construct](_COPY19@aws-cdk_aws-appsync.GraphqlApi.html):

```ts
export class AlpsGraphQL extends appsync.GraphqlApi {

  constructor(scope: cdk.Construct, id: string, props: AlpsGraphQLProps) {
    // convert ALPS yaml to graph ql schema file in tmp/schema.graphql
    unified(props.alpsSpecFile);
    super(scope, id, {
      ...props,
      // schema: appsync.Schema.fromAsset(join(__dirname, '../tmp/schema.graphql')),
      schema: appsync.Schema.fromAsset(props.tmpFile),
    });

    new cdk.CfnOutput(this, 'GraphQlUrl', { value: thisexport class AlpsGraphQL extends appsync.GraphqlApi {

  constructor(scope: cdk.Construct, id: string, props: AlpsGraphQLProps) {
    // convert ALPS yaml to graph ql schema file in tmp/schema.graphql
    unified(props.alpsSpecFile);
    super(scope, id, {
      ...props,
      // schema: appsync.Schema.fromAsset(join(__dirname, '../tmp/schema.graphql')),
      schema: appsync.Schema.fromAsset(props.tmpFile),
    });

    new cdk.CfnOutput(this, 'GraphQlUrl', { value: this.graphqlUrl });
  }
}.graphqlUrl });
  }
}
```

## CDK Demo Deployment
Great! We now have these two constructs which can generate Apis from an ALPS spec AWS. Now we just have to do this :). For this I have created a new [Demo Github Repo](https://github.com/mmuller88/cdk-alps-constructs-demo).

The Demo Deployment uses the same ALPS spec TODO example which I already introduced. To save the TODO items DynamoDB is used:

```ts
const todoTable = new db.Table(stack, 'TodoTable', {
  removalPolicy: RemovalPolicy.DESTROY,
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
});
```

Then the Api Gateway and Appsync is created

```ts
new AlpsSpecRestApi(stack, 'AlpsSpecRestApi', {
  alpsSpecFile: 'src/todo-alps.yaml',
});
...

const graphQlApi = new AlpsGraphQL(stack, 'AlpsGraphQL', {
  name: 'demo',
  alpsSpecFile: 'src/todo-alps.yaml',
  tmpFile: join(__dirname, '../tmp/schema.graphql'),
});

...
```

That's it. Now just apply the CDK stack:

```
yarn build
yarn deploy [--profiles X]
```

Yeahh. So we have created an Api Gateway and an Appsync based on the ALPS API.

# Use Cases
Of course I thought about which Use Cases for the ALPS Spec abstraction there could be. Some of them came to my attention while I was creating the CDK ALPS Constructs.

I see it as an easy and safe way to migrate from Api Gateway to Appsync. The resolvers for the Graph QL could for example use the Lambda integrations from the rest of Api or maybe even do without them completely and for CRUD operations to a DB directly a mapping.

Since the ALPS spec is an abstraction of e.g. Rest Api, it should be possible for domain experts to write it themselves. It would be great if the domain expertise could be better abstracted and this could be possible with ALPS. So while the domain expert takes care of the technicalities, the developer can take care of the usage of the specific API and its implementation. Thus a better distribution of tasks is achieved.

# Summary
ALPS API is a fascinating idea about an abstraction from other APIs like REST API, Graph QL etc. Personally it helped me to understand Graph QL better because I had a common denominator by going back over the ALPS spec. Also the automatic generation of the Graph QL schema is great to understand the API better.

I myself noticed while creating the three repos that I don't know much about the ALPS syntax and want to learn more about it. If you are also interested in the ALPS topic, please write me. With the [ALPS Community](alps.io) we regularly organize community meetings online from all over the world. There you can meet exciting people and get involved if you want :).

I'm already working on a refreshed library to convert the ALPS spec to the lower abstracted APIs [here](https://github.com/mmuller88/alps-unified-ts). This will make it even easier to use ALPS unified as a library in your code:

```ts
// loaded from a YAML file
Alps.unified(Alps.loadYaml(...), { formatType: FormatType.OPENAPI })

// or direct via TypeScript Object
Alps.unified(Alps.spec({
    alps: {
      version: '1.0',
      doc: {
        value: 'Simple Todo list example',
      },
      ...
    }
});
```

In addition, the library should work in JavaScript, TypeScript, Python, Java and .NET and be available via public registries. More about this will be published in a separate blog post. Until then stay tuned!

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>