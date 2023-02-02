---
title: Amplify AppSync Permission
show: "no"
date: "2023-02-10"
image: "index.png"
tags: ["de", "2023", "aws", "cdk", "amplify"]
engUrl: https://martinmueller.dev/amplify-permission-eng
pruneLength: 50 #ihr
---

Hi,

Mit Amplify AppSync ist es möglich mit deklarativem Code ein AWS AppSync zu konfigurieren. Mit [Directives](https://docs.amplify.aws/cli-legacy/graphql-transformer/directives/) wie __@model__, __auth__ oder __function__ können andere AWS Services wie DynamoDB, Cognito oder Lambda sinnvoll mit AppSync verbunden werden. Das macht es in meinen Augen zu einem sehr mächtigen Werkzeug. Mit nur wenigen Zeilen GraphQL Code kann quasi schon sehr viel in AWS konfiguriert werden. Nachfolgend siehst du ein Amplify AppSync Beispiel:

```graphql
type User
  @model
  @key(fields: ["email"])
  @auth(
    rules: [
      { allow: groups, groups: ["Admin"] }
      { allow: private, provider: iam }
      { allow: owner, ownerField: "email", identityClaim: "email" }
    ]
  ) {
  email: String!
  role: Role!
  ...
}
```

Hier passiert eine ganze Menge! Mit der @model Directive wird automatisch eine DynamoDB Tabelle mit dem Namen User erzeugt welche die User Einträge als DynamoDB Items speichert. Mit @key wird die email als PK (Partition Key) festgelegt. Die Permission, wer also auf die Items zugreifen darf, wird mit @auth festgelegt. Ein User in der Admin Group darf also alle Items querien, mutieren und subscriben.

Mit { allow: private, provider: iam } darf eine IAM Entität welche die erforderlichen Permissions besitzt ebenfalls die Items querien, mutieren und subscriben. Das verwende ich zum Beispiel bei Lambdas die bestimmte Aufgaben durchführen sollen wie dem Erstellen von neuen Usern.

Zu guter Letzt mit { allow: owner, ownerField: "email", identityClaim: "email" } dürfen Cognito User, welche sich über oauth2 identifiziert haben auf ihre Items zugreifen. Der identity claim email wird dabei über das Cognito JWT Token mitgeliefert und wird anschliessend mit der im Item definierten email abgeglichen.

Ziemlich cool oder? Mir nur diesen wenigen Zeilen Amplify AppSync GraphQL Code bekommen wir sehr viel Funktionalität.

## Permission für Shared Items

Die Permission zu definieren mit @auth funktioniert sehr gut für einfache Fälle wie dem hier gezeigtem User Beispiel. Aber was ist wenn auf Items von mehreren Benutzern zugegriffen werden soll? Nun hier gibt es verschiedene Möglichkeiten die ich vorstellen möchte und für welche ich mich entschieden habe. Aber zuerst stelle ich die Tabelle mit den gesteilten Items vor:

```graphql
type Project
  @model
  @auth(
    rules: [
      { allow: groups, groups: ["Admin"] }
      { allow: private, provider: iam }
    ]
  ){
  id: ID!
  projektNummer: Int!
  ...
}
```

Ein Project soll für mehrere User zugreifbar sein. Der wohl einfachste Ansatz wäre die User in einer String-List zu speichern.

## String-List

Der Code muss dafür nur minimal angepasst werden mit:

```graphql
type Project
  @model
  @auth(
    rules: [
      { allow: groups, groups: ["Admin"] }
      { allow: private, provider: iam }
      { allow: owner, ownerField: "userEmails", identityClaim: "email" }
    ]
  ){
  id: ID!
  projektNummer: Int!
  userEmails: [String] # <-- User String-List
  ...
}
```

Die userEmails String-List muss nun einfach nur mit den emails von den Usern, die darauf zugreifen können, aktuell gehalten werden. Das Verwalten der userEmails ist aber aufwendig und erfordert zusätzlichen code und Platz im Item.

## Virtuelle Lambda

Wir könnten aber auch eine virtuelle Lambda benutzen welche dynamisch berechnet ob der jeweilige User Zugriff haben soll oder nicht.

```graphql
type Project
  @model
  @auth(
    rules: [
      { allow: groups, groups: ["Admin"] }
      { allow: private, provider: iam }
      { allow: owner, ownerField: "userEmail", identityClaim: "email" }
    ]
  ){
  id: ID!
  projektNummer: Int!
  userEmail: String @function("userEmailLambda")
  ...
}
```

Die Lösung besticht durch den reduzieren Platz in der DynamoDB Tabelle. Bei einer grossen Menge an Items würde es aber eine grosse Anzahl an Lambda-Aufrufen bedeuten welche die Kosten in die Höhe treiben. Auch kann der Delay durch den Lambda-Aufruf zu signifikant sein.

## OwnerField

```graphql
type Project
  @model
  @auth(
    rules: [
      { allow: groups, groups: ["Admin"] }
      { allow: private, provider: iam }
      { allow: owner, ownerField: "id", identityClaim: "currentProjectId" }
    ]
  ){
  id: ID!
  projektNummer: Int!
  ...
}
```

## Permission



## Fazit

...

Ich liebe es, an Open-Source-Projekten zu arbeiten. Viele Dinge kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88). Wenn du meine Arbeit dort und meine Blog-Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

Und schau doch mal auf meiner Seite vorbei

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)