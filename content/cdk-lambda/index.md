---
title: AWS CDK Apps deployed mit Lambda
show: 'no'
date: '2020-07-11'
image: 'cloud.jpg'
tags: ['de', '2020', 'aws', 'lambda', 'cdk', 'cfd', 'nofeed']
engUrl: https://martinmueller.dev/cdk-lambda-eng
pruneLength: 50
---

Ahoi AWS CDK Fans

Mit CDK ist 

# Use Cases
* AlfPro
* Kunde dynamisch Stacks deployen in dev, qa, prod account with CodePipeline

# CDK Deploy via CodeBuild und Lambda
The CodeBuild Project sieht folgendermaßen aus:

```TypeScript
const createInstanceBuild = new Project(scope, 'LambdaBuild', {
    role: createInstanceBuildRole, // role needs all permission for deploying Stacks, accessing S3, logs ...
    source: gitHubSource, 
    buildSpec: codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
        install: {
            commands: [
                'cd src',
                'npm install -g aws-cdk',
                'npm install',
            ],
        },
        build: {
            commands: [
                'npm run build',
                'cdk deploy --require-approval never'
            ]
        },
    },
    }),
    environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
    },
});
```

Und so einfach gehts! So können CDK Apps mit CodeBuild innerhalb eines Accounts deployed werden. Willst du allerdings Cross Deploying machen, müssen die commands section nur leicht angepasst werden:

```TypeScript
...
phases: {
        install: {
            commands: [
                `aws --profile dev configure set aws_access_key_id $AWS_ACCESS_KEY_ID_DEV`,
                `aws --profile dev configure set aws_secret_access_key $AWS_ACCESS_KEY_ID_DEV`,
                `aws --profile dev configure set region $AWS_ACCESS_KEY_ID_DEV`,
                `aws --profile prod configure set aws_access_key_id $AWS_ACCESS_KEY_ID_PROD`,
                `aws --profile prod configure set aws_secret_access_key $AWS_ACCESS_KEY_ID_PROD`,
                `aws --profile prod configure set region $AWS_ACCESS_KEY_ID_PROD`,
                'cd src',
                'npm install -g aws-cdk',
                'npm install',
            ],
        },
        build: {
            commands: [
                'npm run build',
                'cdk deploy --require-approval never --profile dev'
            ]
        },
    },
}),
```

Falls man sich gerne vorher die benötigten Stack Änderungen anschauen will geht das auch ganz einfach mit ```cdk diff --profile dev```. Was jetzt noch fehlt ist die Lambda Implementation zur Ausführung des CodeBuild Projektes. Zuerst muss das Lambda erstellt werden:

```TypeScript
const createInstanceLambdaRole = new Role(scope, 'createInstanceLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });

    createInstanceLambdaRole.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: ['codebuild:StartBuild', 'logs:*']
    }));

new Function(scope, 'createCdkApp', {
    code: new AssetCode('lambda'),
    handler: 'create-cdk-stack.handler',
    runtime: Runtime.NODEJS_12_X,
    environment: {
        PROJECT_NAME: createInstanceBuild.projectName
    },
    role: createInstanceLambdaRole
});
```

Wie es schon der Lambda CDK Code andeutet befindet sich im Folder lambda die Lambda Funktion:

```TypeScript
import AWS = require("aws-sdk");
import { CodeBuild } from "aws-sdk";

var codebuild = new AWS.CodeBuild();

const PROJECT_NAME = process.env.PROJECT_NAME || ''

export const handler = async (event: any = {}): Promise<any> => {
  console.debug("create-cdk-stack event: " + JSON.stringify(event));

  const params: CodeBuild.Types.StartBuildInput = {
    projectName: PROJECT_NAME
  };
  console.debug("params: " + JSON.stringify(params));
  const startBuildResult = await codebuild.startBuild(params).promise();
  console.debug("startBuildResult: " + JSON.stringify(startBuildResult));
}
```

E voila und kann das Lambda selbstständig CDK Apps deployn.

# Zusammenfassung
CDK macht das Erstellen und Verwalten von Stacks einfach. Das will man auch so in dynamisch erstellten (z.B. mit einem Lambda) Stacks haben! Bei bisherigen Lösungen musste man damit immer mit Cloudformation Template Files rumhantieren und diese zum Beispiel in ein S3 hochladen welches dann als Source für ein Cloudformation Deploy dienen könnte. 

Mit der hier vorgestellten Lösung ist das nun nicht mehr notwendig und es kann sich mehr auf die Erstellung der CDK App selbst konzentriert werden. Ein weiterer Vorteil den ich sehr schätzen gelernt zu habe ist, dass ich separat die via Lambda deployten CDK Apps testen kann ohne quasi den kompletten CDK Parent Stack dafür deployen zu müssen. Das kombiniert mit CI CD Pipeline ist der wahrgewordene DevOps Traum!

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>