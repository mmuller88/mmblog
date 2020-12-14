---
title: ALPS Helfer Library
show: 'no'
date: '2020-12-19'
image: 'alps.png'
tags: ['de', '2020', 'aws', 'swagger', 'cdk', 'alps', 'openapi', 'nofeed']
engUrl: https://martinmueller.dev/alps-cdk-eng
pruneLength: 50
---

Hi :).

Mike Amundsen von der alps.io Community hat eine tolle [ALPS Converter Library](https://github.com/mamund/alps-unified) geschrieben. Mit dieser ist es möglich eine ALPS Spezifikation (kurz Spec), geschrieben in YAML oder JSON, zu konvertieren nach z.B. OpenApi oder dem GraphQL Schema.

Allerdings ist die Library leider nur eine JavaScript CLI. Für meinen anderen Projekte mit ALPS hätte ich aber gerne eine Command Library die ich direkt benutzen kann wie z.B. so:

```ts
import { Alps, FormatType } from 'alps-unified-ts';

// geladen von einer YAML File
Alps.unified(Alps.loadYaml('todo-alps.yaml'), { formatType: FormatType.OPENAPI })
```

Wie man hier sieht besäße so eine Lirary auch den Vorteil von Typen. Dafür eignet sich natürlich TypeScript. Ich habe mich also rangemacht eine TypeScript Library Version von ALPS unified zu bauen. Weitere tolle Features meine ALPS unified TypeScript sind:

* automatische versioniertes Releasing nach [NPM](https://npmjs.com), [PyPi](https://pypi.com), [Maven](https://maven-central.com) und [Nuget](https://nuget.com) (für .NET)
* 

* Projen für Grundgerüßt

# ALPS API
ALPS is a specification for describing the bounded context of a service. ALPS can be used as a source material to generate lower abstracted specifications like OpenApi / Swagger, WSDL, RAML, WADL.

Als ich das YouTube Video gesehen habe, fand ich die Idee von ALPS sofort cool und spannend. Wie jeder gut Entwickler liebe ich Abstraktionen und ALPS scheint eine extrem coole Abstraktion zu sein. Mir kam dan sofort die Idee ob man die ALPS Api nicht mit AWS CDK Constructen verbinden könnte. Genau das habe ich gemacht und berichte mehr im Detail darüber im nächsten Abschnitt.

# Projen
* Was ist Projen
* Nutze für Publishing zu NPM, PYPI, Maven und Nuget

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

# ALPS Library in Action
* Alps.unified(Alps.fromYAML())

```ts
import { Alps, FormatType } from 'alps-unified-ts';

// geladen von einer YAML File
Alps.unified(Alps.loadYaml(...), { formatType: FormatType.OPENAPI })

// oder direct per TypeScript Object
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

# Zusammenfassung
Wenn euch auch das ALPS Thema interessiert, schreibt mir doch. Mit der [ALPS Community](alps.io) veranstalten wir regelmäßig Community Treffen online aus aller Welt. Dort trefft ihr spannende Leute und könnt euch einbringen wenn ihr wollt :).

Ich arbeite bereits an einer aufgefrischten Library zur Konvertierung der ALPS Spec zu den lower abstracted APIs [hier](https://github.com/mmuller88/alps-unified-ts). Damit wird es dann noch einfacher sein ALPS unified als Library in deinem Code zu benutzen:


Darüber hinaus soll die Library in JavaScript, TypeScript, Python, Java und .NET funktioniert und über öffentliche Registries erhältlicht sein. Mehr darüber kommt in einem separatem Blogpost. Bis dahin stay tuned!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>