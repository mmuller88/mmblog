---
title: ALPS Api kombiniert mit AWS CDK
show: 'no'
date: '2020-12-12'
image: 'alps.png'
tags: ['de', '2020', 'aws', 'swagger', 'cdk', 'alps', 'openapi', 'nofeed']
engUrl: https://martinmueller.dev/alps-cdk-eng
pruneLength: 50
---

Hi :).

AWS bietet viele spannende Api Technologien an. Solche sind z.B. das AWS Api Gateway welches eine Implementation einer REST Api ist oder AWS Appsync was eine GRAPH QL Api implementiert.

Jeder dieser AWS Api implementationen hat seine Vor- und Nachteile. Z.B. kann die Erstellung von Appsync schneller von der Hand gehen als das Api Gateway, allerdings wird es dann wieder komplizierter bei der Erstellung von Queries and das Graph QL. Zugegeben ich kenne mich zu wenig aus um die Vor- und Nachteile der verschieden Api Implementation in AWS gegeneiner abzuwägen, aber das muss ich jetzt auch nicht mehr!

Mit meiner aufregenden Arbeit mit ALPS in Kombination mit AWS CDK, kann ich die Api frei auswählbar machen oder sogar gegeneinander austauschen und das alles auf Grundlage von einer ALPS Spezifikation (kurz Spec).

Was genau eine ALPS Spec ist und wie daraus mit Hilfe von AWS CDK komplette Apis wie Api Gateway oder Appsync erstellt werden können, erkläre ich euch in den nächsten Abschnitten.

# ALPS Api
ALPS ist eine Spezifikation zur Beschreibung vom Context eines Services. ALPS kann verwendet werden als Spezifikationsinput zum generieren von niedrig abstrahierten Spezifikationen wie OpenApi / Swagger, WSDL, RAML, WADL.

Als ich das [YouTube Video](https://www.youtube.com/watch?v=oG6-r3UdenE) mit [Mike Amundsen](https://twitter.com/mamund) gesehen habe, fand ich die Idee von ALPS sofort cool und spannend. Wie jeder gut Entwickler liebe ich Abstraktionen und ALPS scheint eine extrem coole Abstraktion zu sein. Mir kam dan sofort die Idee ob man die ALPS Api nicht mit AWS CDK Constructen verbinden könnte. Genau das habe ich gemacht und berichte mehr im Detail darüber im nächsten Abschnitt.

# AWS CDK ALPS Constructs
AWS CDK Constructs sind kurzgefasst Quellcode für Resourcen in AWS. Dafür benutzen sie abstrakte Sprachen wie TypeScript oder Python und generieren aus dem Code Cloudformation Templates welche dann auch noch mit dem AWS CDK Framework applyed werden. Wenn euch das Thema AWS CDK mehr im Detail interessiert, ich habe sehr viele Posts über [CDK hier geschrieben](https://martinmueller.dev/tags/cdk).

Mein Ziel war es also mit Hilfe von einer ALPS Specs gezielt AWS Apis wie Api Gateway und Appsync aufbauen zu lassen. Nachfolgend zeige ich zuerst ein ALPS Spec Beispiel. Dann beschreibe ich das Construct bei dem ich aus einer ALPS Spec ein AWS Api Gateway generiere. Danach wird aus der selben ALPS Spec ein Appsync gebaut.

Die beiden nachfolgenden Libraries werden automatisch nach [NPM](https://www.npmjs.com/) (für JavaScript und TypeScript) und [PYPI](https://pypi.org/) (für Python) released. In Zukunft plane ich auch zu einem öffentlichen Maven Repository und .Net package Repository zu publishen.

## ALPS Spec Beispiel
Das folgende Beispiel ist eine simple TODO List Api.

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

## CDK ALPS REST Api Construct Library
Das erste ALPS CDK Construct das ich implementiert habe ist das CDK ALPS REST Api Construct in meinem [github repo](https://github.com/mmuller88/cdk-alps-Spec-rest-api) . Es erstellt ein AWS Api Gateway mit Hilfe des [CDK SpecRestApi Constructs](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-apigateway.SpecRestApi.html). Dieses muss dann nur noch eine aus dem ALPS generierte openApi Spec übergeben werden:

```ts
const api = new apigw.SpecRestApi(this, 'SpecRestApi', {
  apiDefinition: apigw.ApiDefinition.fromInline(oasSpecJSON),
});
```

## CDK ALPS Graph QL Api Construct Library
Das zweite ALPS CDK Construct war wesentlich spannender für mich, da ich dafür AWS Appsync als Graph QL Api verwendet habe und das noch komplett neu für mich war. Wieder allen Erwartungen war das aber sehr leicht und ich hab in wenigen Stunden das Construct hier auf [github](https://github.com/mmuller88/cdk-alps-graph-ql) fertigstellen können. Dabei übersetzt der ALPS compiler die ALPS Spec in das Graph QL Schema und übergabt das dem [CDK GraphqlApi Construct](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-appsync.GraphqlApi.html):

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
Super! Wir haben nun diese zwei Constructs welche aus einer ALPS Spec AWS Apis generieren können. Jetzt müssen wir das nur noch machen :). Dafür habe ich ein neues [Demo Github Repo](https://github.com/mmuller88/cdk-alps-constructs-demo) erstellt.

Das Demo Deployment verwendet das gleich ALPS Spec TODO Beispiel welches ich schon vorgestellt habe. Zum Speichern der TODO items wird DynamoDB verwendet:

```ts
const todoTable = new db.Table(stack, 'TodoTable', {
  removalPolicy: RemovalPolicy.DESTROY,
  partitionKey: {
    name: 'id',
    type: db.AttributeType.STRING,
  },
});
```

Dann wird das Api Gateway und Appsync erstellt

```ts
new AlpsSpecRestApi(stack, 'AlpsSpecRestApi', { alpsSpecFile: 'src/todo-alps.yaml' });
...

const graphQlApi = new AlpsGraphQL(stack, 'AlpsGraphQL', { alpsSpecFile: 'src/todo-alps.yaml' });

...
```

Das wars. Jetzt nur noch den CDK Stack applyen mit:

```
yarn build
yarn deploy [--profile X]
```

Yeahh. Wir haben somit ein Api Gateway und ein Appsync erstellt auf Grundlage der ALPS Api.

# Use Cases
Natürlich hab ich mir gedanken gemacht welche Use Cases für die ALPS Spec Abstraktion es geben könnte. Einige sind mir aufgefallen, während ich die CDK ALPS Constructs erstellt habe.

Ich sehe es als einfachen und sicheren Weg für eine Migration vom Api Gateway zu Appsync. Die Resolver für das Graph QL könnten zum Beispiel die Lambda Integrationen von der Rest Api nutzen oder eventuell sogar komplett auf diese verzichten und für CRUD Operationen auf eine DB direkt ein Mapping.

Da die ALPS Spec eine Abstraktion von z.B. Rest Api ist, sollte es möglich sein für Domaineexperten diese selber schreiben zu können. Es wäre super wenn der domainspezifische Context besser abstrahiert werden könnte und das könnte mit ALPS möglich sein. Während sich also der Domaineexperte um die Fachlichkeit kümmert, kann der Entwickler an der konkreten Api und dessen Implementation arbeiten. Somit wird eine besseres modulares Arbeiten ermöglicht.

# Zusammenfassung
ALPS Api ist eine faszinierende Idee über die Abstraktion von anderen Apis wie REST, Graph QL usw. Mir persönlich hat es geholfen Graph QL besser zu verstehen da ich durch den Rückweg über den ALPS Spec einen gemeinsamen Nenner hatte. Auch die automatische Generierung des Graph QL Schemas ist super toll um ebenfalls die Api besser zu verstehen.

Ich selber habe bei der Erstellung der drei Repos gemerkt, dass ich noch nicht viel über die ALPS Syntax weiß und mehr darüber lernen möchte. Wenn euch auch das ALPS Thema interessiert, schreibt mir doch. Mit der [ALPS Community](https://alps.io) veranstalten wir regelmäßig Community Treffen online aus aller Welt. Dort trefft ihr spannende Leute und könnt euch einbringen wenn ihr wollt :).

Ich arbeite bereits an einer aufgefrischten Library zur Konvertierung der ALPS Spec zu den lower abstracted Apis [hier](https://github.com/mmuller88/alps-unified-ts). Damit wird es dann noch einfacher sein ALPS unified als Library in deinem Code zu benutzen:

```ts
// geladen von einer YAML File
Alps.unified(Alps.loadYaml(...), { formatType: FormatType.OPENApi })

// oder direct per TypeScript Object
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

Darüber hinaus soll die Library in JavaScript, TypeScript, Python, Java und .NET funktioniert und über öffentliche Registries erhältlicht sein. Mehr darüber kommt in einem separatem Blogpost. Bis dahin stay tuned!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>