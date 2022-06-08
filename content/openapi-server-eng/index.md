---
title: OpenApi generated Restic REST Server
description: How with OpenApi Specs create an Restic REST Server
date: '2020-06-06'
image: 'swagger.png'
tags: ['eng', '2020', 'openapi', 'automate', 'github-actions', 'postman']
gerUrl: https://martinmueller.dev/openapi-server
pruneLength: 50
---

Hello folks :).

In this article I want to tell you how easy it can be to create a backend REST server using OpenApi specifications. My ultimate goal is to make backups and the restore process of Alfresco data as easy as possible. After much research I decided to use [Restic](https://github.com/restic/restic) as my backup and restore engine. In my previous deployments all Alfresco data, i.e. blob data, DB data, Solr data etc. is stored in the /data folder. The automated backup works fine so far. Many thanks at this point [lobaro](https://github.com/lobaro/restic-backup-docker) and his brilliant restic backup work which helped me a lot in the part automated backup.

But now the restoring part is still to be done. And as it seems there is no tooling for it yet. So the administrator would have to do the restoring manually with restic. That means logging into the machine and executing the necessary Restic Restore commands, which restore the desired snapshot. I want to simplify this process and provide the administrator with a convenient UI for restoring. For this I use the OpenApi technologies. In the next sections I will tell you more about OpenApi and what exactly I did.

# OpenApi
[OpenApi](https://swagger.io/docs/specification/about/) which was formerly called Swagger is a YAML or JSON template language for describing RESTful APIs. In the following I describe what is great about OpenApi. First of all, the templates are extremely well suited as documentation about the API itself, because a nice looking HTML UI can be generated from the template, which describes the API endpoints very well. Such a UI can be seen on the cover of this blog post. Even more ingenious is the UI can be used directly to test the endpoints, i.e. to send and receive requests and responses. Many API interfaces, such as AWS API Gateway, offer to do the parameter validation of requests via OpenApi files. What is meant by parameter validation I will try to explain with the following example:

```YAML
parameters:
    - in: query
    name: userId
    description: Get items of that user
    required: true
    type: string
```

Here you can see a parameter of type Query. This means it would look like this in the URL
```
http://<url>/items?userId=martin
```

With the parameter validation I can then define certain properties of the parameter, like here the name **userId** if it is required and what type the value should have, in our case as of type string.

Also very powerful is the property that it is possible to generate from OpenApi files [client libraries and server stubs](https://swagger.io/tools/swagger-codegen/). For example, Alfresco generates JavaScript clients using the [API Explorer](https://api-explorer.alfresco.com/api-explorer/) (see [GitHub Api-Explorer](https://github.com/Alfresco/rest-api-explorer)) and [ADF](https://www.alfresco.com/abn/adf/) (or [ADF JS Github](https://github.com/Alfresco/alfresco-js-api)). There you can create a JavaScript API library from the [Swagger File](https://github.com/Alfresco/rest-api-explorer/blob/master/src/main/webapp/definitions/alfresco-core.yaml) which can be used as a wrapper for the API requests in the [ADF Components Github](https://github.com/Alfresco/alfresco-ng2-components).

Also cool is, [Postman](https://www.postman.com/automated-testing) offers an import function for OpenApi files. Then a collection is created from it. This is very handy if you want to start writing the requests in Postman.

# Server generation
In this part I tell you more about my implementation in [Github](https://github.com/mmuller88/restic-backup-restore-docker/). The [OpenApi Generator](https://github.com/OpenAPITools/openapi-generator-cli) is a powerful tool for creating client libs and server stubs of OpenApi specifications like the one I have in repo ./restic.yaml . But at the moment I'm only interested in the server stub generation. It can be chosen from a variety of different server technologies like Go, Kotlin, Java, JavaScript. I have specifically chosen the NodeJS Express Server. To generate the server the following command is executed in ./build_server:

```BASH
PWD=$(pwd)
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
-i /local/restic.yaml \
-g nodejs-express-server \
-o local/server
```

An additional bonus. The NodeJS Express Server also generates a Swagger UI which is then accessible on /api-doc . Since I don't want to implement the handlers for the endpoints again and again when generating the server, I have placed them in a designated folder ./handlers . Then you only have to refer to it in the OpenApi Spec:

```YAML
operationId: getSnapshots
description: List all snapshots
x-eov operation handler: handlers/default controller
```

The x-eov-operation-handler property refers to the handler function. The ./handlers folder then only needs to be copied to the Docker image.

# Testing
For testing, I'm using the new GitHub build engine GitHub Actions to generate workflows. In my previous project, I tested GitHub Actions extensively with a [Let's Encrypt SSL Docker Companion](https://martinmueller.dev/alf-lets-encrypt-eng) and found it to be good. In my test workflow under ./.github/workflows/action.yml the image is started with Docker Compose and tested extensively with the help of Postman. If you are more interested in automated testing with Postman just click [here](https://martinmueller.dev/tags/postman)

# Summary
Building REST servers is usually a complex process that requires writing a lot of code. Request parameters in the path or body must be validated for correctness. Or Url mapping algorithms must be equipped with request and response handler logic. And so that the user of the REST server does not despair, the REST API should be well documented. All these tasks and many more can be solved by the OpenApi approach. 

With great works like the [OpenApi Generator](https://github.com/OpenAPITools/openapi-generator-cli) you can easily generate rest servers and document them with Swagger HTML UI. Also the REST server can be tested without any problems in the Swagger HTML UI with the try out function and postman tests can be generated directly from the OpenApi Spec File. Working with OpenApi specs is very exciting for me and I hope I could animate you to try OpenApi technologies. Let me hear how it went for you!

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>