---
title: ALPS API kombiniert mit AWS CDK
show: 'no'
date: '2020-12-11'
image: 'swagger.png'
tags: ['de', '2020', 'aws', 'swagger', 'cdk', 'cfd', 'github', 'travis', 'nofeed']
engUrl: https://martinmueller.dev/alps-cdk-eng
pruneLength: 50
---

Hi :).

AWS bietet viele spannende API Technologien an. Solche sind z.B. das AWS API Gateway welches eine Implementation einer REST API ist oder AWS Appsync was eine GRAPH QL API implementiert.

Jeder dieser AWS API implementationen hat seine Vor- und Nachteile. Z.B. kann die Erstellung von Appsync schneller von der Hand gehen als das API Gateway, allerdings wird es dann wieder komplizierter bei der Erstellung von Queries and das Graph QL. Zugegeben ich kenne mich zu wenig aus um die Vor- und Nachteile der verschieden API Implementation in AWS gegeneiner abzuwägen, aber das muss ich jetzt auch nicht mehr!

Mit meiner aufregenden Arbeit mit ALPS in Kombination mit AWS CDK, kann ich die API frei auswählbar machen oder sogar gegeneinander austauschen und das alles auf Grundlage von einer ALPS Spezifikation (kurz Spec).

Was genau eine ALPS Spec ist und wie daraus mit Hilfe von AWS CDK komplette APIs wie Api Gateway oder Appsync erstellt werden können, erkläre ich euch in den nächsten Abschnitten.

# ALPS API
ALPS is a specification for describing the bounded context of a service. ALPS can be used as a source material to generate lower abstracted specifications like OpenApi / Swagger, WSDL, RAML, WADL.

Als ich das YouTube Video gesehen habe, fand ich die Idee von ALPS sofort cool und spannend. Wie jeder gut Entwickler liebe ich Abstraktionen und ALPS scheint eine extrem coole Abstraktion zu sein. Mir kam dan sofort die Idee ob man die ALPS Api nicht mit AWS CDK Constructen verbinden könnte. Genau das habe ich gemacht und berichte mehr im Detail darüber im nächsten Abschnitt.

# AWS CDK ALPS Constructs

AWS CDK Constructs sind kurzgefasst Quellcode für Resourcen in AWS. Dafür benutzen sie abstrakte Sprachen wie TypeScript oder Python und generieren aus dem Code Cloudformation Templates welche dann auch noch mit dem AWS CDK Framework applyed werden. Wenn euch das Thema AWS CDK mehr im Detail intressiert, ich habe sehr viele Posts über [CDK hier geschrieben](https://martinmueller.dev/tags/cdk).

Mein Ziel war es also mit Hilfe von ALPS Specs gezielt AWS APIs wie Api Gateway und Appsync aufbauen zu lassen. Nachfolgend zeige ich zuerst eine ALPS Spec Beispiel. Dann beschreibe ich das Construct bei dem ich aus einer ALPS Spec ein AWS Api Gateway, welches ein REST API implementiert. Danach zeige ich wie auch aus der selben ALPS Spec ein Appsync, welches ein Graph QL implementiert, gebaut werden kann.

Die beiden nachfolgenden Libraries werden automatisch nach [NPM](https://www.npmjs.com/) (für JavaScript und TypeScript) und [PYPI](https://pypi.org/) (für Python) released. In Zukunft plane ich auch zu einem öffentlichen Maven Repository und .Net package repository zu publishen.

## ALPS Spec Beispiel

Das folgende Beispiel ist eine simple TODO API.

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

Das Element **todoItem** besteht aus einer **id** und einem todo string **body** . Es sind drei Aktionen definiert **todoList** zum listen der todo Einträge, **todoAdd** zum Einfügen neuer todos und **todoRemove** zum Löschen von todo Einträgen.

## CDK ALPS REST API Construct Library

Das erste ALPS CDK Construct das ich implementiert habe ist das CDK ALPS REST API Construct in meinem [github repo](https://github.com/mmuller88/cdk-alps-spec-rest-api) . Es erstellt ein AWS Api Gateway mit Hilfe des [CDK SpecRestApi Constructs](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.SpecRestApi.html). Dieses muss dann nur noch eine aus dem ALPS generierte openApi Spec übergeben werden:

```ts
const api = new apigw.SpecRestApi(this, 'SpecRestApi', {
  apiDefinition: apigw.ApiDefinition.fromInline(oasSpecJSON),
});
```

## CDK ALPS Graph QL API Construct Library

Das zweite ALPS CDK Construct war wesentlich spannender für mich, da ich dafür AWS Appsync als Graph QL Api verwendet habe und das noch komplett neu für mich war. Wieder allen Erwartungen war das aber sehr leicht und ich hab in wenigen Stunden das Construct hier auf [github](https://github.com/mmuller88/cdk-alps-graph-ql) fertigstellen können. Dabei übersetzt der ALPS compiler die ALPS spec in das Graph QL Schema und übergabt das dem [CDK GraphqlApi Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-appsync.GraphqlApi.html):

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
* Nutzen der zwei Libraries

# Use Cases
* Sichere Migration von z.B. REST API zu Graph QL
* Bessere Abstraction der API Definition da die ALPS spec von dem Domainenexperten erstellt werden. Da simple und nur Domainenwissen enthällt

# Zusammenfassung
...

* Next steps

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>