---
title: AWS QuickSight DataSet und DataSource CDK Custom Constructs
show: 'no'
date: '2021-05-01'
image: 'ddb-qs.jpg'
tags: ['de', '2021', 'projen', 'cdk', 'aws', 'nofeed'] #nofeed
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
A QuickSight DataSource lets you define where the data is coming from you would like to use for the analysis. A good overview which sources you can take and which parameter you need to provide you can see at the [SDK documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSource-property). The DataSource Construct takes the parameter there as a type as well.

Das konkrete Interface findet ihr [hier](https://github.com/mmuller88/cdk-quicksight-constructs/blob/main/src/datasource.ts). Wenn man zum Beispiel Athena als DataSource definieren möchte sieht das so aus:

```ts
new DataSource(this, 'DataSource', {
  account: this.account,
  name: 'cdkdatasource',
  dataSourceParameters: {
    AthenaParameters: {
      WorkGroup: 'ddbworkgroup',
    },
  },
  users: ['martin.mueller'],
});
```
Das property **account** wird vom SDK benötigt und ist die account Id. **dataSourceParameters** ist der (getypte Parameter vom SDK)[https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSource-property]. Ich finde es ziemlich cool das wir hier nun Typesupport haben und so auch sehr einfach andere Quellen als DataSource wie Aurora oder RDS definieren können <3 . Die **WorkGroup** im Beispiel muss vorher erstellt sein. Das kann man manuell mit der AWS Console in Athena machen oder noch besser mit Athena. Wie genau das geht, habe ich bereits in einem vorherigen [Blogpost](https://martinmueller.dev/cdk-ddb-quicksight) erklärt.

# DataSet
A DataSet then lets you define how concrete your Data coming from DataSources shall look like. Here you can reuse the DataSources, join and transform them. Check out the possibilities with the [DataSet SDK documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSet-property). Important to know you need to set the Permissions on DataSources and DataSets correctly. For that see my Construct example.

Die Implementierung des DataSets ist [hier](https://github.com/mmuller88/cdk-quicksight-constructs/blob/main/src/dataset.ts). Nachfolgend schildere ich ein etwas komplexeres Beispiel bei dem logische Tabellen aus der DataSource gejoint werden.

```ts
new DataSet(this, 'DataSet', {
      account: this.account,
      name: 'cdkdataset3',
      users: users,
      physicalTableMap: {
        users: {
          CustomSql: {
            DataSourceArn: datasource.dataSourceArn,
            Name: 'users',
            SqlQuery: 'SELECT primarypractice, dateofbirth FROM "ddbconnector"."martin1"."martin1" WHERE groupid = \'users\' AND firstname is not null',
            Columns: [
              { Name: 'primarypractice', Type: 'STRING' },
              { Name: 'dateofbirth', Type: 'STRING' },
            ],
          },
        },
        practices: {
          CustomSql: {
            DataSourceArn: datasource.dataSourceArn,
            Name: 'practices',
            SqlQuery: 'SELECT id, name FROM "ddbconnector"."martin1"."martin1" WHERE groupid = \'medical-practices\' AND name is not null',
            Columns: [
              { Name: 'id', Type: 'STRING' },
              { Name: 'name', Type: 'STRING' },
            ],
          },
        },
      },
      logicalTableMap: {
        'users': {
          Alias: 'users',
          Source: {
            PhysicalTableId: 'users',
          },
        },
        'practices': {
          Alias: 'practices',
          Source: {
            PhysicalTableId: 'practices',
          },
        },
        'users-practices': {
          Alias: 'users-practices',
          Source: {
            JoinInstruction: {
              LeftOperand: 'users',
              RightOperand: 'practices',
              Type: 'INNER',
              OnClause: 'primarypractice = id',
            },
          },
          DataTransforms: [{
            CreateColumnsOperation: {
              Columns: [{
                ColumnName: 'age',
                ColumnId: 'age',
                Expression: 'dateDiff(parseDate(dateofbirth, "YYYY-MM-dd\'T\'HH:mm:ssZ"),now(), "YYYY")',
              }],
            },
          }],
        },
      },
    });
```

# Beispiel
...

# Ausblick
...

# Zusammenfassung
QuickSight ist ein cooles AWS Tool zum Visualisieren von Data Insights. Da ich ein riesen Fan von Infrastructure as Code bin will ich alle QuickSight Ressourcen in CDK haben. Leider sind die DataSource und DataSet noch nicht von Cloudformation unterstützt. Solange das noch so ist, werde ich und könnt ihr gerne meine CDK Custom Construct als Ersatz verwenden :).

Nochmal vielen Dank an [TAKE2](https://www.take2.co/) für das Sponsoring dieses Blogposts.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>