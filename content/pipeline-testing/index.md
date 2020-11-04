---
title: AWS CDK - PipelineApp Library - Automated Testing
show: 'no'
date: '2020-11-07'
image: 'testing.jpg'
tags: ['de', '2020', 'aws', 'cdk', 'testing', 'nofeed']
engUrl: https://martinmueller.dev/cdk-pipeline-lib-eng
pruneLength: 50
---

Hi CDK Fans,

Kürzlich releaste ich einen Blogpost über die [AWS CDK PipelineApp Library](https://martinmueller.dev/cdk-pipeline-lib-eng) an der ich arbeite. Falls euch das Thema AWS CDK Pipeline interessiert sollten ihr unbedingt diesen Blogpost lesen! Mittlerweile habe ich die Library schon dutzende Male in meinen Projekten verwendet und somit auch weiterentwickelt.

In diesem Post möchte ich gerne darauf eingehen wie man mit meiner Library automatisierte Tests am der Pipeline ausführen kann.

Übrigens meine [CDK Library](https://github.com/mmuller88/alf-cdk-app-pipeline) kann direkt genutzt werden via npm depedency und erfordert kein npm Repository. Einfach die Dependency folgendermaßen angeben:

```JSON
 "dependencies": {
    "alf-cdk-app-pipeline": "github:mmuller88/alf-cdk-app-pipeline#v0.0.8",
    ...
 }
```

# Wofür testen wir?
Im Zeitalter der schnellen Releases zu Produktion ist es unerlässlich automatisierte Tests während dem Release Prozess in der Pipeline durchzuführen. Damit wird sichergestellt, dass alte und neue Features immer noch funktionieren.

# UI Stack Tests
Schon im letzten Blogpost habe ich meinen UI Stack vorgestellt. Nun möchte ich genauer auf den Test Part im **testCommands** Property eingehen.

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: 'alf-cdk-ec2',
  ...
  testCommands: (stageAccount) => [
    `curl -Ssf $InstancePublicDnsName
    aws cloudformation delete-stack --stack-name itest123 --region ${stageAccount.account.region}`,
  ],
};
```

...

# API GW Tests

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  repositoryName: 'alf-cdk',
  ...
  testCommands: (account) => [
    ...(account.stage==='dev'? [
      `npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json`,
      'echo done! Delete all remaining Stacks!',
      `aws cloudformation describe-stacks --query "Stacks[?Tags[?Key == 'alfInstanceId'][]].StackName" --region ${account.region} --output text |
      awk '{print $1}' |
      while read line;
      do aws cloudformation delete-stack --stack-name $line --region ${account.region};
      done`,
    ] : []),
  ],
};
```

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>