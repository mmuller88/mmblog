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

Mit Amplify AppSync ist es möglich mit declarativem Code ein AWS AppSync zu konfigurieren. Mit [Directives](https://docs.amplify.aws/cli-legacy/graphql-transformer/directives/) wie __@model__, __auth__ oder __function__ können andere AWS Services wie DynamoDB, Cognito oder Lambda sinnvoll mit AppSync verbunden werden. Das macht es in meinen Augen zu einem sehr mächtigen Werkzeug. Mit nur wenigen Zeilen GraphQL Code kann quasi schon sehr viel in AWS konfiguriert werden. Nachfolgend siehst du ein Amplify AppSync Beispiel:

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

Hier passiert eine ganze Menge! Mit der @model Directive wird automatisch eine DynamoDB Tabelle mit dem Namen User erzeugt welche die User Einträge als DynamoDB Items speichert. Mit @key wird die email als PK (Partition Key) festgelegt. @auth erlaubt eine Definition der Permission. Wer also auf die Items zugreifen darf. Ein User in der Admin Group darf also alle Items querien, mutations und subscriptions durchführen.

Mit { allow: private, provider: iam } darf eine IAM Entität welche die erforderlichen Permissions besitzt ebenfalls die Items querien, mutieren und subscriben. Das verwende ich zum Beispiel bei Lambdas die bestimmte Aufgaben durchführen sollen wie dem Erstellen von neuen Usern.

Zu guter Letzt mit { allow: owner, ownerField: "email", identityClaim: "email" } dürfen Cognito User, welche sich über oauth2 identifiziert haben auf ihre Items zugreifen bzw. diese querien, mutieren oder subscriben.

Ziemlich cool oder? Mir nur diesen wenigen Zeilen Amplify AppSync GraphQL Code bekommen wir sehr viel Funktionalität.

## Amplify AppSync

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