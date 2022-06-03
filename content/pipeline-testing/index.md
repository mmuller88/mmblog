---
title: AWS CDK - PipelineApp Library - Automated Testing
show: 'no'
date: '2020-11-09'
image: 'testing.jpg'
tags: ['de', '2020', 'aws', 'cdk', 'testing', 'postman']
engUrl: https://martinmueller.dev/pipeline-testing-eng
pruneLength: 50
---

Hi CDK Fans,

Kürzlich erst veröffentlichte ich einen Blogpost über die [AWS CDK PipelineApp Library](https://martinmueller.dev/cdk-pipeline-lib) an der ich arbeite. Falls euch das Thema AWS CDK Pipeline interessiert sollten ihr unbedingt diesen Blogpost lesen! Mittlerweile habe ich die Library schon dutzende Male in meinen Projekten verwendet und somit auch weiterentwickelt.

In diesem Post möchte ich gerne darauf eingehen wie man mit meiner Library automatisierte Tests mit der Pipeline ausführen kann.

Übrigens meine [CDK Library](https://github.com/mmuller88/alf-cdk-app-pipeline) kann direkt genutzt werden via npm Dependency und erfordert kein npm Repository. Einfach die Dependency folgendermaßen angeben:

```JSON
 "dependencies": {
    "alf-cdk-app-pipeline": "github:mmuller88/alf-cdk-app-pipeline#v0.0.8",
    ...
 }
```

## Wofür testen wir?
Im Zeitalter der schnellen Releases zu Produktion ist es unerlässlich automatisierte Tests während dem Releaseprozess in der Pipeline durchzuführen. Damit wird sichergestellt, dass alte und neue Features immer noch funktionieren.

## Cloudformation Stack Tests
Schon im letzten Blogpost habe ich meinen Ec2 Stack vorgestellt. Nun möchte ich genauer auf den Test Part im **testCommands** Property eingehen.

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  ...
  testCommands: (stageAccount) => [
    `curl -Ssf $InstancePublicDnsName
    aws cloudformation delete-stack --stack-name itest123 --region ${stageAccount.account.region}`,
  ],
};
```

Mit dem Command `curl -Ssf $InstancePublicDnsName` teste ich ob die Ec2 Instanz erfolgreich gestartet ist. Danach findet ein Cleanup statt mit Verwendung der AWS CLI. Dadurch das die Commands als eine Liste von Strings `string[]` übergeben werden und sequenziell abgearbeitet wird kann der Cleanup nach dem curl Befehl noch stattfinden bevor die Teststage den nächsten Command abarbeitet oder ein Fail zurückgibt.

Die Variable **$InstancePublicDnsName** wurde im Ec2 Stack definiert und explizit in die Test Command gerendert. Wie es definiert wurde siehst du hier:

```TypeScript
const instancePublicDnsName = new CfnOutput(this, 'InstancePublicDnsName', {
  value: instance.instancePublicDnsName
});
this.cfnOutputs['InstancePublicDnsName'] = instancePublicDnsName;
```

## API Gateway Tests
In meinem AWS API GW Stack lasse ich Postman Tests laufen. Es sind mittlerweile mehr als 40 Requests die gegen das API GW laufen und das Backend ausgiebig testen. Wenn dich Postman Tests interessieren findest du auf meiner Blogseite viele Beiträge über das Thema auf https://martinmueller.dev/tags/postman .

```TypeScript
const pipelineAppProps: PipelineAppProps = {
  branch: 'master',
  ...
  testCommands: (stageAccount) => [
    ...(stageAccount.stage === 'dev'? [
      `npx newman run test/alf-cdk.postman_collection.json --env-var baseUrl=$RestApiEndPoint -r cli,json --reporter-json-export tmp/newman/report.json --export-environment tmp/newman/env-vars.json --export-globals tmp/newman/global-vars.json
      aws cloudformation describe-stacks --query "Stacks[?Tags[?Key == 'alfInstanceId'][]].StackName" --region ${stageAccount.account.region} --output text |
      awk '{print $1}' |
      while read line;
      do aws cloudformation delete-stack --stack-name $line --region ${stageAccount.account.region};
      done`,
    ] : []),
  ],
};
```

Mit dem CLI Tool **newman** kann die Postman Collection, welche die mehr als 40 Requests Tests enthält, ausgeführt werden. Ab `aws cloudformation ...` erfolgt auch hier ein Aufräumen von allen übrig gebliebenen Cloudformation Stacks.

# Zusammenfassung
Es fühlt sich an, dass meine AWS CDK Pipeline Library nützlicher und robuster wird. Mit jedem neuen Projekt von mir schleife ich etwas an ihr und sie wird somit ein Stück ausgefeilter. Ich bin sehr gespannt wo die Reise mit meiner Library noch hingehen wird.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   