---
title: AWS QuickSight DataSet und DataSource CDK Custom Constructs
show: 'no'
date: '2021-05-06'
image: 'ddb-qs.jpg'
tags: ['de', '2021', 'projen', 'cdk', 'aws', 'quicksight'] #nofeed
engUrl: https://martinmueller.dev/qs-quicksight-eng
pruneLength: 50
---

Hi.

In meinen vorherigen Blogposts habe ich bereits viel beschrieben und gezeigt wie man mit Hilfe von AWS QuickSight Analysen aus DynamoDB Tabelle generieren kann. Unglücklicherweise ist QuickSight nur minimal unterstützt von Cloudformation und QuickSight's DataSource und DataSet sind bisher nur auf der Roadmap https://github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/issues/274 .

Deshalb habe ich AWS CDK Custom Constructs für [DataSource und DataSet](https://github.com/mmuller88/cdk-quicksight-constructs) entwickelt. In diesem Post gehe ich etwas genauer darauf ein was QuickSight DataSources und DataSets sind und wie ich mittels AWS CDK Custom Construct deploybar mache.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die z.B. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.

# DataSource
Eine QuickSight DataSource definiert die Herkunft der Daten für die Analyse. Welche Datenquellen dabei möglich sind, seht ihr sehr gut in der [SDK Dokumentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSource-property). Das DataSource Construct benutzt dabei auch die SDK Parameterdefinition als typed Input.

Das konkrete Interface findet ihr [hier](https://github.com/mmuller88/cdk-quicksight-constructs/blob/main/src/datasource.ts). Wenn man zum Beispiel Athena als DataSource definieren möchte sieht das so aus:

```ts
const users=['martin.mueller'];

const datasource = new DataSource(this, 'DataSource', {
  name: 'cdkdatasource',
  dataSourceParameters: {
    athenaParameters: {
      workGroup: 'ddbworkgroup',
    },
  },
  users,
});
```

**dataSourceParameters** ist der [getypte Parameter vom SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSource-property). Ich finde es ziemlich cool das wir hier nun Typesupport haben und so auch sehr einfach andere Quellen als DataSource wie Aurora oder RDS definieren können <3 . Die **workGroup** im Beispiel muss vorher erstellt sein. Das kann man manuell mit der AWS Console in Athena machen oder noch besser mit Athena. Wie genau das geht, habe ich bereits in einem vorherigen [Blogpost](https://martinmueller.dev/cdk-ddb-quicksight) erklärt.

# DataSet
Eine DataSet kann dann verwendet werden um die DataSources zu verfeinern und zu konkretisieren. Dabei können zum Beispiel joins oder transforms definiert werden. Alle Möglichkeiten sehr ihr auch hier in der [DataSet SDK Dokumentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSet-property). Sehr wichtig zu wissen, es müssen die Permissions für DataSource und DataSet immer richtig gesetzt werden. Das habe ich zum Beispiel in den Constructs schon eingebaut.

Die Implementierung des DataSets ist [hier](https://github.com/mmuller88/cdk-quicksight-constructs/blob/main/src/dataset.ts). Nachfolgend schildere ich ein etwas komplexeres Beispiel bei dem logische Tabellen aus der DataSource gejoint werden.

```ts
new DataSetConstruct(stack, 'DataSetConstruct', {
  name: 'cdkdataset3',
  users: users,
  physicalTableMap: {
    users: {
      customSql: {
        dataSourceArn: datasource.dataSourceArn,
        name: 'users',
        sqlQuery: 'SELECT primarypractice, dateofbirth FROM "ddbconnector"."martin1"."martin1" WHERE groupid = \'users\' AND firstname is not null',
        columns: [
          { name: 'primarypractice', type: 'STRING' },
          { name: 'dateofbirth', type: 'STRING' },
        ],
      },
    },
    practices: {
      customSql: {
        dataSourceArn: datasource.dataSourceArn,
        name: 'practices',
        sqlQuery: 'SELECT id, name FROM "ddbconnector"."martin1"."martin1" WHERE groupid = \'medical-practices\' AND name is not null',
        columns: [
          { name: 'id', type: 'STRING' },
          { name: 'name', type: 'STRING' },
        ],
      },
    },
  },
  logicalTableMap: {
    'users': {
      alias: 'users',
      source: {
        physicalTableId: 'users',
      },
    },
    'practices': {
      alias: 'practices',
      source: {
        physicalTableId: 'practices',
      },
    },
    'users-practices': {
      alias: 'users-practices',
      source: {
        joinInstruction: {
          leftOperand: 'users',
          rightOperand: 'practices',
          type: 'INNER',
          onClause: 'primarypractice = id',
        },
      },
      dataTransforms: [{
        createColumnsOperation: {
          columns: [{
            columnName: 'age',
            columnId: 'age',
            expression: 'dateDiff(parseDate(dateofbirth, "YYYY-MM-dd\'T\'HH:mm:ssZ"),now(), "YYYY")',
          }],
        },
      }],
    },
  },
});
```

In diesem Beispiel werden virtuell erst die zwei Tabellen **users** und **practices** erzeugt und anschließend miteinander gejoined um herauszufinden zu welcher practice der user zugeordnet ist.

Auch führe ich hier ein Daten Transformation durch. Ich möchte gerne das **age** der user wissen, allerdings ist in den Daten nur das Geburtsdatum vermerkt. Also führe ich eine Tranformation durch bei der das Alter berechnet wird und als neue Spalte mit Namen **age** definiert wird.

# Zusammenfassung
QuickSight ist ein cooles AWS Tool zum Visualisieren von Data Insights. Da ich ein riesen Fan von Infrastructure as Code bin will ich alle QuickSight Ressourcen in CDK haben. Leider sind die DataSource und DataSet noch nicht von Cloudformation unterstützt. Solange das noch so ist, werde ich und könnt ihr gerne meine CDK Custom Construct als Ersatz verwenden :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>