---
title: ALPS API combined with AWS CDK
date: '2020-12-14'
image: 'alps.png'
tags: ['eng', '2020', 'aws', 'swagger', 'cdk', 'alps', 'openapi']
gerUrl: https://martinmueller.dev/alps-cdk
pruneLength: 50
---

Hi :).

AWS offers many exciting Api technologies. Those include the AWS Api Gateway which is an implementation of a REST Api or AWS Appsync which implements a GRAPH QL Api.

Each of these AWS Api implementations has its advantages and disadvantages. For example, Appsync can be faster to build than the Api Gateway, but then again it gets more complicated when creating queries to the Graph QL. Admittedly, I don't know enough to weigh the pros and cons of the different Api implementations in AWS, but I don't have to anymore!

With my exciting work with ALPS in combination with AWS CDK, I can make the Api freely selectable or even interchangeable and all based on an ALPS specification (Spec for short). As AWS says itself. Choice Matter! :)

What exactly an ALPS Spec is and how Api implementations like Api Gateway or Appsync can be created from it, I will explain in the next sections.

# ALPS Api
ALPS is a specification to describe the context of a service. ALPS can be used as specification input to generate low abstracted specifications like OpenApi / Swagger, WSDL, RAML, WADL.

When I saw the [YouTube video](https://www.youtube.com/watch?v=oG6-r3UdenE) with [Mike Amundsen](https://twitter.com/mamund), I immediately thought the idea of ALPS was cool and exciting. Like any good developer I love abstractions and ALPS seems to be an extremely cool abstraction. I immediately had the idea to connect the ALPS Api with an AWS CDK construct. That's exactly what I did and I tell more in details about it in the next section.

# AWS CDK ALPS Constructs
AWS CDK Constructs are, in short, source code for deploying resources or services in AWS. For this it uses abstract languages like TypeScript or Python and generates cloudformation templates from the code which are then also applied. If you are interested in the topic of AWS CDK, I have written a lot of posts about [CDK here](https://martinmueller.dev/tags/cdk).

So my goal was to have targeted AWS Apis like Api Gateway and Appsync built using an ALPS specs. Below, I first show an ALPS Spec example. Then I describe the construct where I generate an AWS Api Gateway from an ALPS Spec. After that, an Appsync is built from the same ALPS Spec.

The two subsequent libraries are automatically released after [NPM](https://www.npmjs.com/) (for JavaScript and TypeScript) and [PYPI](https://pypi.org/) (for Python). In the future I also plan to publish to a public Maven repository and .Net package repository.

## ALPS Spec Example
The following example is a simple TODO list api.

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
      tags: 'oas
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

The **todoItem** element consists of an **id** and a todo string **body** . Three actions are defined **todoList** to list the todo items, **todoAdd** to insert new todos and **todoRemove** to delete todo items.

## CDK ALPS REST Api Construct Library
The first ALPS CDK Construct I implemented is the CDK ALPS REST Api Construct in my [github repo](https://github.com/mmuller88/cdk-alps-Spec-rest-api) . It creates an AWS Api Gateway using the [CDK SpecRestApi Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.SpecRestApi.html). This then just needs to be passed an openApi Spec generated from the ALPS:

```ts
const api = new apigw.SpecRestApi(this, 'SpecRestApi', {
  apiDefinition: apigw.ApiDefinition.fromInline(oasSpecJSON),
});
```

## CDK ALPS Graph QL Api Construct Library
The second ALPS CDK Construct was much more exciting for me, because I used AWS Appsync as Graph QL Api and it was completely new for me. But against all expectations it was very easy and I was able to finish the construct in a few hours here on [github](https://github.com/mmuller88/cdk-alps-graph-ql). The ALPS compiler translates the ALPS spec into the Graph QL schema and passes it to the [CDK GraphqlApi Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-appsync.GraphqlApi.html):

```ts
export class AlpsGraphQL extends appsync.GraphqlApi {

  constructor(scope: cdk.Construct, id: string, props: AlpsGraphQLProps) {
    // convert ALPS yaml to graph ql schema file in tmp/schema.graphql
    const sdl = Alps.unified(Alps.loadYaml(props.alpsSpecFile), { formatType: FormatType.SDL });
    fs.writeFileSync('tmp/schema.graphql', sdl);
    super(scope, id, {
      ...props,
      schema: appsync.Schema.fromAsset('tmp/schema.graphql'),
    });

    new cdk.CfnOutput(this, 'GraphQlUrl', { value: this.graphqlUrl });
  }
}
```

## CDK Demo Deployment
Sweet! We now have these two constructs which can generate AWS Apis from an ALPS Spec. Now we just need to do that :). For this I created a new [Demo Github Repo](https://github.com/mmuller88/cdk-alps-constructs-demo).

The demo deployment uses the same ALPS Spec TODO example I already presented. DynamoDB is used to store the TODO items:

```ts
const todoTable = new db.Table(stack, 'TodoTable', {
  removalPolicy: RemovalPolicy.DESTROY,
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
});
```

Then the Api Gateway and Appsync are created

```ts
new AlpsSpecRestApi(stack, 'AlpsSpecRestApi', { alpsSpecFile: 'src/todo-alps.yaml' });
...

const graphQlApi = new AlpsGraphQL(stack, 'AlpsGraphQL', { alpsSpecFile: 'src/todo-alps.yaml' });

...
```

That's it. Now just apply the CDK stack with:

```
yarn build
yarn deploy [--profile X]
```

Yeahh. So we have created an Api Gateway and an Appsync based on the ALPS Api.

# Use Cases
Of course I thought about what use cases there could be for the ALPS spec abstraction. Some of them came to my mind while I was creating the CDK ALPS Constructs.

I see it as an easy and safe way to migrate from Api Gateway to Appsync. For example, the resolvers for the Graph QL could use the Lambda integrations from the Rest Api, or possibly even do away with them entirely and map directly to a DB for CRUD operations.

Since the ALPS spec is an abstraction of e.g. Rest Api, it should be possible for domain experts to write it themselves. It would be great if the domain specific context could be abstracted better and this could be possible with ALPS. So while the domain expert takes care of the domain specificity, the developer can work on the concrete api and its implementation. Thus, a better modular work is made possible.

# Summary
ALPS Api is a fascinating idea about abstraction from other apis like REST, Graph QL etc. Personally, it helped me understand Graph QL better as I had a common denominator by going back through the ALPS spec. Also the auto-generation of Graph QL schema is super great to understand the api better as well.

I myself realized while creating the three repos that I still don't know much about the ALPS syntax and want to learn more about it. If you are also interested in the ALPS topic, please write me. With the [ALPS Community](https://alps.io) we regularly organize community meetings online from all over the world. There you can meet exciting people and get involved if you want :).

I am already working on a refreshed library to convert the ALPS spec to the lower abstracted Apis [here](https://github.com/mmuller88/alps-unified-ts). This will make it even easier to use ALPS unified as a library in your code:

```ts
// loaded from a YAML file
Alps.unified(Alps.loadYaml(...), { formatType: FormatType.OPENApi })

// or directly via TypeScript object
Alps.unified(Alps.Spec({
    alps: {
      version: '1.0',
      doc: {
        value: 'Simple Todo list example',
      },
      ...
    }
});
```

In addition, the library should work in JavaScript, TypeScript, Python, Java and .NET and be available through public registries. More about this will come in a separate blog post. Until then stay tuned!

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>