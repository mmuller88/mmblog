---
title: AWS QuickSight DataSet and DataSource CDK Custom Constructs
date: '2021-05-06'
image: 'ddb-qs.jpg'
tags: ['eng', '2021', 'projen', 'cdk', 'aws', 'quicksight'] #nofeed
gerUrl: https://martinmueller.dev/qs-quicksight
pruneLength: 50
---

Hi.

In my previous blog posts I showed how to generate analytics from DynamoDB table using AWS QuickSight. Unfortunately, QuickSight is only minimally supported by Cloudformation and QuickSight's DataSource and DataSet are only on the roadmap so far https://github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/issues/274 .

Therefore, I have developed AWS CDK Custom Constructs for [DataSource and DataSet](https://github.com/mmuller88/cdk-quicksight-constructs). In this post, I go into a little more detail about what QuickSight DataSources and DataSets are and how I deploy using AWS CDK Custom Construct.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) is an open source framework for creating and managing AWS resources. Using languages familiar to the developer such as TypeScript or Python, it describes the infrastructure as code. In doing so, CDK synthesizes the code into AWS Cloudformation Templates and can optionally deploy them right away.

AWS CDK has been experiencing a steady increase in enthusiastic developers since 2019 and already has a strong and helpful community that is very active on [Slack](https://cdk-dev.slack.com), for example. There is of course much more to say about AWS CDK and I recommend you explore it. Drop me a line if you have any questions.

# DataSource
A QuickSight DataSource defines the source of data for analysis. You can see which data sources are possible in the [SDK Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSource-property). The DataSource construct also uses the SDK parameter definition as typed input.

The concrete interface can be found [here](https://github.com/mmuller88/cdk-quicksight-constructs/blob/main/src/datasource.ts). For example if you want to define Athena as DataSource it looks like this:

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

**dataSourceParameters** is the [typed parameter from the SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSource-property). I think it's pretty cool that we have type support here now and so we can also define other sources as DataSource like Aurora or RDS very easily <3 . The **workGroup** in the example must be created before. You can do that manually with the AWS Console in Athena or even better with Athena. I already explained how exactly to do this in a previous [blogpost](https://martinmueller.dev/cdk-ddb-quicksight).

# DataSet
A DataSet can then be used to refine and concretize the DataSources. For example joins or transforms can be defined. All possibilities you can find here in the [DataSet SDK Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/QuickSight.html#createDataSet-property). Very important to know, the permissions for DataSource and DataSet must always be set correctly. I have already built this into the constructs for example.

The implementation of the DataSet is [here](https://github.com/mmuller88/cdk-quicksight-constructs/blob/main/src/dataset.ts). In the following I describe a more complex example where logical tables are joined from the DataSource.

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

In this example, the two tables **users** and **practices** are first created virtually and then joined together to find out to which practice the user is assigned.

I also perform a data transformation here. I would like to know the **age** of the user, but the data only contains the date of birth. So I perform a transformation where the age is calculated and defined as a new column named **age**.

# Summary
QuickSight is a cool AWS tool for visualizing data insights. Since I am a huge fan of Infrastructure as Code I want to have all QuickSight resources in CDK. Unfortunately, the DataSource and DataSet are not yet supported by Cloudformation. As long as this is still the case, I and you are welcome to use my CDK Custom Construct as a replacement :).

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

 