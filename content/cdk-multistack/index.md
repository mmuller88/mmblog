---
title: AWS CDK Multistacks für Test und Produktion
description: AWS CDK Multistacks Verwendung für Test und Produktion
show: 'no'
date: '2020-04-18'
image: 'cloud.jpg'
tags: ['de', '2020', 'aws', 'lambda', 'cdk', 'production', 'github', 'travis']
# engUrl: https://martinmueller.dev/cdk-multistack-eng
pruneLength: 50
---

**UNDER CONSTRUCTION**

Hi AWS Fans,

Wie gut sich AWS CDK zur Beschreibung in Code der Infrastruktur eignet habe ich ja bereits in einem [vorherigen Beitrag](https://martinmueller.dev/cdk-example) beschrieben. In diesem Beitrag soll es darum gehen wie CDK in einer Test und Produktionsumgebung aussehen könnte. In meinem privaten Projekt habe ich bereits sowas wie eine Produktionsumgebung eingebaut und bin sehr begeistert davon. Kurz gesagt dafür benutze ich CDK's [Multiple Stack](https://docs.aws.amazon.com/cdk/latest/guide/stack_how_to_create_multiple_stacks.html). In den nächsten Abschnitten beschreibe ich wie mein Deployment aussieht.

# CDK Multiple Stack
Ein CDK Multiple Stack ist ein CDK Deployment welches mehrere Stacks verwaltet. Diese Stacks können in der gleichen oder anderen Region sein oder sogar in anderen AWS accounts. Die unterschiedlichen Stacks können dann einfach bei der Erstellung mit unterschiedlichen Parameter initialisiert werden. Nachfolgend ist ein Beispiel mit zwei Stacks:

```TypeScript
new MultiStack(app, "EuWest2Prod", {
    environment: 'prod',
    env: {
      region: "eu-west-2",
      account: 'ABC'
    },
    // disable create ec2 instance
    // createInstances: {
    //   imageId: 'ami-04d5cc9b88f9d1d39'
    // },
    domain: {
      domainName: 'api.nope.dev',
      zoneName: 'api.nope.dev.',
      hostedZoneId: 'AA',
      certificateArn: 'arn:aws:acm:eu-west-2:ABC:certificate/xyz'
    }
  });

new MultiStack(app, "EuWest2", {
  environment: 'dev',
  env: {
    region: 'eu-west-2',
    account: 'XYZ'
  },
  createInstances: {
    imageId: 'ami-0cb790308f7591fa6'
  }
});
```

Das ist ein Beispiel aus meinem Projekt, allerdings stark anonymisiert. Der erste Stack mit Namen EuWest2Prod beschreibt den Produktionsstack der sogar in einem anderen Account liegt. Der Zweite Stack EuWest2 ist der Teststack. Diese Art und Weise der Parametrisierung lässt sich hervorragend nutzen um Features an und auszuschalten. Im Produktionsstack habe ich mit der Auskommentierung von createInstances das Feature zur Erstellung von Ec2 Instanzen erstmal ausgestellt um Kosten zu sparen. Was ich persönlich wirklich toll an den Multi Stacks finde ist. Auch unterstützt das eine mögliche Migration zu einem anderen AWS Account.

In den nächsten Abschnitten will ich mehr über meinen Test Stack und Produktions Stack für mein Projekt sprechen. Mann muss aber fair erwähnen, dass ich noch keinen wirklichen Produktions Stack habe. Also sprich wirklich Kunden, die meinen Service nutzen. Ich hoffe dieses natürlich bald ändern zu können. Zum jetzigen Zeitpunkt versuche ich Erfahrungen zu sammeln wie ich eine echte Produktion möglichst gut am laufen halten könnte, sprich neue Feature problemlos implementieren. Dafür eignen sich AWS ChangeSets für CloudFormation Stacks sehr gut. Diese ändern den jeweiligen Stack nur mit den erforderlichen Updates. Befor du weiterliest, es macht definitiv Sinn über AWS ChangeSets für CloudFormations sich zu informieren.

# Test Stack
Teststacks sollten in erster Linie günstig sein. Die Tests sollten ausgeführt worden sein und das Result dem Developer bekannt sein. Und kurz danach sollte der Stack die Ressourcen vernichten. Ist noch eine manuelle Begutachtung des Teststacks erwünscht kann man eine Verzögerung der Vernichtung nach den Tests implementieren.

Und natürlich sollte der Test Stack testen. Was das genau ist hängt von deinem Use Case ab. Bei mir teste ich gegen ein API GateWay welches im Hintergrund mehrere DynamoDB Tabellen, sowie EC2 Instanzen kreiert oder terminiert mittels StepFunctions. Das mache ich mit Postman. Falls dich das Testen mehr interessiert habe ich bereits darüber in meinem [vorherigen Post](https://martinmueller.dev/cdk-example-eng) berichtet.

An sich wars das. Wenn die Testphase erfolgreich war, kann das Update in die Produktions angewandt werden. Das wird im nächsten Abschnitt beschrieben.

# Produktions Stack
* Andere Regions im gleich account. Aufpassen Regions manchmal unterschiedlich.
* Anderer Account für Produktion

# DevOps Pipeline
* AWS ClouFormation super geeignet da Stack updates selbständig durchgeführt werden. Im Fall von Fehler automatisch reverted. Muss aber ehrlich sein mein Projekt bisher noch nicht in einer wirklich Produktion.
* Commit to master oder feature branch triggers update / creation
* Zuerst Test Stack creation dann Tests dann evtl. Manuelle Bestätigung dann Produktion update

# Zusammenfassung
* CDK Multistack super!

# Questions: 
Multistack von CDK oder von CloudFormation? 

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>