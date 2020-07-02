---
title: Infrastruktur Optimieren mit CDK Solution Constructs Teil II.
show: 'no'
date: '2020-07-04'
image: 'cdkpattern.png'
tags: ['de', '2020', 'aws', 'lambda', 'cdk', 'github', 'nofeed']
engUrl: https://martinmueller.dev/cdk-solutions-constructs-2-eng
pruneLength: 50
---

Hi CDK Fans

Im vorherigen [Teil I](https://martinmueller.dev/cdk-solutions-constructs) habe ich das DynamoDB Stream to Lambda Solution Construct in mein [Alfresco Provisioner CDK Deployment](https://martinmueller.dev/alf-provisioner) eingebaut und den Gewinn dadurch diskutiert. Diese Woche habe ich weitere CDK Solutions Constructs eingebaut. CDK Solution Constructs sind CDK Constructs welche oft genutzte Cloudformation Pattern kapseln. Näheres darüber kannst du in [Teil I](https://martinmueller.dev/cdk-solutions-constructs) lesen.

# Cloudfront S3
Zu finden in GitHub ist das das [Cloudfront S3](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-cloudfront-s3) Solution Construct. Es implementiert ein Cloudfront vorangestellt einem S3 Bucket. Dadurch können Dateien performanter verteilt werden, da sie mittels eines Content Delivery Networks gecachet und verteilt werden. Mit dem Cloudfront S3 Solution Pattern kommen einige tolle well-architected Funktionalitäten wie z.B. HTTP Security Headers und buckets für CDN und S3 Access Logs.

```TypeScript
const { CloudFrontToS3 } = require('@aws-solutions-constructs/aws-cloudfront-s3');

new CloudFrontToS3(stack, 'test-cloudfront-s3', {
    deployBucket: true
});
```

Ich wollte dieses Pattern verwenden für eine S3 Static Webside, da diese bereits ein Cloudfront besitzt. Allerdings unterstützt das Cloudfront S3 Solution Construct keine Static Websides. Deshalb kann ich es leider nicht für meinen Stack benutzen. Egal was zählt ist, dass ich viel über das Solution Construct gelernt habe und nun weiß wofür ich es nicht verwenden kann, was ja auch nützlich ist!

# SQS Lambda
Das [SQS Lambda](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-sqs-lambda) Solution Construct ist ein spannendes Pattern welches eine Queue vom Simple Queue Service (kurz: SQS), mit einem Lambda verbindet und so die Queue Messages an das Lambda zur Weiterverarbeitung leitet. Die Queue und das Lambda bekommen dabei automatisch alle und die ausschließlich benötigten Permissions. Zusätzlich deployed das SQS Lambda Solution Construct noch eine Dead Letter Queue zum Speichern und Weiterverarbeiten von fehlgeschlagenden Messages.

```TypeScript
const { SqsToLambda } = require('@aws-solutions-constructs/aws-sqs-lambda');

new SqsToLambda(stack, 'SqsToLambdaPattern', {
    deployLambda: true,
    lambdaFunctionProps: {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.asset(`${__dirname}/lambda`)
    }
});
```

Ich benötigte dieses Solution Construct da das im [Teil I](https://martinmueller.dev/cdk-solutions-constructs) erwähnte DynamoDB Stream to Lambda Solution Construct ein komisches Verhalten aufgewiesen hat indem es anscheinend Event Messages dupliziert hat. Mit dem SQS Lambda Solution Construct konnte ich eine FIFO SQS erstellen welche nun zusätzlich die im vorherigen Absatz erwähnten Vorteile besitzt.

# Lambda DynamoDB
Ein simples aber dennoch tolles Solution Construct ist das [Lambda DynamoDB](https://github.com/awslabs/aws-solutions-constructs/tree/master/source/patterns/%40aws-solutions-constructs/aws-lambda-dynamodb). Es standardisiert die Verbindung eines Lambdas zu einer DynamoDB perfekt. Bedarfsweise kann eine existierende DynamoDB Tabelle übergeben oder eine neue erstellt werden:

```TypeScript
const { LambdaToDynamoDB } = require('@aws-solutions-constructs/aws-lambda-dynamodb');

new LambdaToDynamoDB(stack, 'test-lambda-dynamodb-stack', {
    deployLambda: true,
    lambdaFunctionProps: {
        code: lambda.Code.asset(`${__dirname}/lambda`),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler'
    },
    //optional existierende Tabelle übergeben
    existingTableObj: ddbTable
});
```

Als Teil des Solution Constructs werden die DynamoDB Zugriffsprivilegien and das Lambda erteilt. Ebenfalls wird nach der Erstellung oder Weiterleitung der Tabelle eine Environment Variable dem Lambda übergeben, welches den Namen der Tabelle enthält. Somit kann dann ohne jeglichen größeren Aufwand auf die Tabelle innerhalb des Lambdas zugegriffen werden:

```TypeScript
// Kopiert vom Solution Construct Repo
this.lambdaFunction.addEnvironment('DDB_TABLE_NAME', this.dynamoTable.tableName);

// Verwendung innerhalb des Lambdas
const DDB_TABLE_NAME = process.env.DDB_TABLE_NAME || ''
```

# Zusammenfassung
Somit konnten die nächsten CDK Solution Construct erfolgreich integriert werden. Bei dem Arbeiten mit den CDK Solution Constructs stellt sich bei mir die Frage ob es nicht auch Sinn täte eigene Solution Constructs zu bauen. Das hätte den Vorteil der Abstraktion der Infrastruktur. Allerdings sind die Nachteile, dass eventuell nicht viel Rücksicht auf das [well-architected Framework](https://aws.amazon.com/architecture/well-architected/) genommen wird. 

Ein weiterer Nachteil wäre, dass die selbsterstellten Solution Constructs maintained werden müssten. Ich denke es ist so wie es oft sein sollte, der Use Case wird über die Sinnhaftigkeit der Kreierung von Solution Constructs entscheiden. Bis dahin kann und sollte man ruhig die existieren AWS CDK Solution Constructs verwenden, denn diese sind Open Source auf Git und die starke AWS Community maintained und entwickelt diese kräftig weiter. Ich konnte sogar auch schon zurück kontributieren um einen Bug zu fixen. Lasst mich wissen wie eure Erfahrungen mit den CDK Solution Constructs sind!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>