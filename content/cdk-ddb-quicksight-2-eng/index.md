---
title: AWS DynamoDB Analysis with QuickSight and AWS CDK - Quite big Tables
date: '2021-04-21'
image: 'long-table.jpg'
tags: ['eng', '2021', 'projen', 'cdk', 'quicksight', 'aws'] #nofeed
gerUrl: https://martinmueller.dev/cdk-ddb-quicksight-2
pruneLength: 50
---

Hi.

In my [last blogpost](https://martinmueller.dev/cdk-ddb-quicksight), I covered exciting work with AWS Athena and AWS QuickSight. If you want to do analytics from small AWS DynamoDB tables, everything should work smoothly. By small I mean a relatively small number of columns in the table.

It happened to me that when processing the [TAKE2](https://www.take2.co/) data, the required columns for QuickSight were not displayed at all. Now the number of columns in the TAKE2 data is anything but small with more than 700! How I solved the problem and even cast it into code using AWS CDK, you will learn in the next sections.

Before that I would like to thank the sponsor [TAKE2](https://www.take2.co/) for this blogpost as well.

# Solution
The problem is that the DynamoDB table is way too big and the Lambda [AthenaDynamoDBConnector](https://github.com/awslabs/aws-athena-query-federation/blob/master/athena-dynamodb) is no longer reasonably able to recognize all the columns. Fortunately, the programmers of the connector have considered this case and have built in a possibility to define specific columns with their names and types.

The exact instructions are in this [repo](https://github.com/awslabs/aws-athena-query-federation/tree/master/athena-dynamodb#setting-up-databases--tables-in-glue). In short, an AWS Glue Table must be created. The connector can then detect the desired columns based on the columns defined there.

To visualize it using the AWS component diagram also used in the last post, all you need to do is add a Glue Table:

![pic](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-ddb-quicksight-2/ddb-qs-complex.png)

# AWS CDK Code
I packed the CDK Glue Table extension into its own [CDK Stack](https://github.com/mmuller88/ddb-quicksight/blob/main/src/glue-stack.ts). Here is the code snipped:

```ts
import * as glue from '@aws-cdk/aws-glue';
import * as cdk from '@aws-cdk/core';

interface GlueStackProps extends cdk.StackProps {
  readonly ddbTableName: string;
}

export class GlueStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: GlueStackProps) {
    super(scope, id, props);

    const database = new glue.Database(this, 'Database', {
      databaseName: props.ddbTableName,
      locationUri: 'dynamo-db-flag',
    });

    const gluetable = new glue.Table(this, 'GlueTable', {
      tableName: props.ddbTableName,
      database: database,
      columns: [{
        name: 'userid',
        type: glue.Schema.BIG_INT,
      }, {
        name: 'firstname',
        type: glue.Schema.STRING,
      }
      ...
      ],
      dataFormat: glue.DataFormat.JSON,
    });

    const cfngluetable = gluetable.node.defaultChild as glue.CfnTable;
    cfngluetable.addPropertyOverride('TableInput.Parameters.classification', 'dynamodb');
    cfngluetable.addPropertyOverride('TableInput.Parameters.columnMapping', 'userid=userId,firstname=firstName,...');
  }
}
```

The DynamoDB columns you would like to be parsed you simply need to define as columns in the glue table. Watch out here! Glue Table does not support certain characters like capslock and special characters. Therefore you may have to do a columnMapping!

After deployment the columns defined in **columns** can be used in Athena and QuickSight.

# Summary
Analyzing large DynamoDB tables is not that easy. However, with the use of AWS Glue Tables, the Lambda AthenaDynamoDBConnector can still reliably detect the desired columns.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

 