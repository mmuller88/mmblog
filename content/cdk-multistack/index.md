---
title: AWS CDK Multistacks für Test und Produktion
description: AWS CDK Multistacks Verwendung für Test und Produktion
show: 'no'
date: '2020-04-18'
image: 'cloud.jpg'
tags: ['de', '2020', 'aws', 'lambda', 'cdk', 'production', 'github', 'travis']
engUrl: https://martinmueller.dev/cdk-multistack-eng
pruneLength: 50
---

Hi AWS Fans,

Wie gut sich AWS CDK zur Beschreibung in Code der Infrastruktur eignet habe ich ja bereits in einem [vorherigen Beitrag](https://martinmueller.dev/cdk-example) beschrieben. In diesem Beitrag soll es darum gehen wie CDK in einer Test- und Produktionsumgebung aussehen könnte. In meinem privaten Projekt habe ich bereits so etwas wie eine Produktionsumgebung implementiert und bin sehr begeistert davon. Kurz gesagt dafür benutze ich CDK's [Multistack](https://docs.aws.amazon.com/cdk/latest/guide/stack_how_to_create_multiple_stacks.html). In den nächsten Abschnitten beschreibe ich wie mein Deployment aussieht.

# CDK Multistack
Ein CDK Multistack ist ein CDK Deployment welches mehrere Stacks verwaltet. Diese Stacks können in der gleichen oder anderen Regionen sein oder sogar in einem anderen AWS Accounts. Die unterschiedlichen Stacks können dann einfach bei der Erstellung mit verschiedenen Parameter initialisiert werden. Nachfolgend ist ein Beispiel mit zwei Stacks:

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
    cognito: 'true'
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

Das ist ein kleiner Ausschnitt aus meinem Projekt. Der erste Stack mit Namen EuWest2Prod beschreibt den Produktionsstack der sogar in einem anderen Account liegt. Der Zweite Stack EuWest2 ist der Teststack. Diese Art und Weise der Parametrisierung lässt sich hervorragend nutzen um Features an und auszuschalten. Im Produktionsstack habe ich mit der Auskommentierung von createInstances das Feature zur Erstellung von Ec2 Instanzen erstmal ausgestellt um Kosten zu sparen. Auch unterstützt die Parametrisierung eine einfach Migration von einem AWS Account zu einem anderen.

In den nächsten Abschnitten will ich mehr über meinen Teststack und Produktionsstack für mein Projekt sprechen. Mann muss aber fairerweise erwähnen, dass ich noch keine wirkliche Produktion habe. Also sprich echte Kunden, die meinen Service nutzen. Ich hoffe dieses natürlich bald ändern zu können. Zum jetzigen Zeitpunkt versuche ich Erfahrungen zu sammeln wie ich eine echte Produktion möglichst gut am laufen halten könnte, sprich neue Features problemlos implementieren. Dafür eignen sich AWS ChangeSets für CloudFormationstacks sehr gut. Diese ändern den jeweiligen Stack nur mit den erforderlichen Updates. Bevor du weiterliest, es macht definitiv Sinn über AWS ChangeSets für CloudFormations sich zu informieren.

# Teststack
Teststacks sollten in erster Linie günstig sein. Die Tests werden ausgeführt und das Logresult sollte dem Developer einfach zugänglich sein. Kurz danach sollte der Stack die Ressourcen vernichten. Ist noch eine manuelle Begutachtung des Teststacks erwünscht kann man eine Verzögerung der Vernichtung nach den Tests implementieren.

Und natürlich sollte der Teststack testen. Was das genau ist hängt von deinem Use Case ab. Bei mir teste ich gegen ein API GateWay und dessen Endpoints. Im Hintergrund werden mehrere DynamoDB Tabellen, sowie EC2 Instanzen kreiert oder terminiert mittels Step Functions. Das mache ich mit Postman. Falls dich das Testen mehr interessiert habe ich bereits darüber in meinem [vorherigen Post](https://martinmueller.dev/cdk-example) berichtet.

An sich wars das. Wenn die Testphase erfolgreich war, kann das Update in die Produktions angewandt werden. Das wird im nächsten Abschnitt beschrieben.

# Produktionsstack
Der Produktionsstack ist für die Kunden gedacht. Dort muss als alles bestmöglich funktionieren und neue Features sollten erst implementiert werden, wenn sie sich im Teststack bewiesen haben. Auch kann es Sinn machen den Produktionsstack mit etwas veränderten Service Einstellungen zu betreiben. Ein Beispiel dafür wäre, dass ich im Teststack ja keine wirklich User Verwaltung ggf. mit Cognito brauche, aber im Produktionsstack schon. Somit wird die Komplexität im Teststack geringer gehalten. Im obigen Snippet habe ich Cognito in der Produktion definiert. Ein weiteres Beispiel wären EC2 Instanzen. Im Teststack reichen vielleicht kostengünstige EC2 Typen wohingegen in der Produktion stärkere und somit kostenintensivere Instanzen nötig sind.

Es stellt sich nun die Frage wo der Produktionsstack deployed werden sollte. Glücklicherweise bietet uns CDK dort jede Freiheit. Es ist möglich den Stack in der gleichen oder in einer anderen Region, im gleichen Account zu deployen. Auch kann der Produktionsstack in einem anderen Account deployed werden. Dafür müssen dann aber Profiles genutzt werden. Hier ist mal ein Beispiel:

```BASH
cdk deploy "$STACK_NAME_PRODUCTION" --profile=prod
```

Dieser Stack wird nun in einem anderen AWS Account deployed. Bisher habe ich mit dieser Art und Weise der Deployments eine gute Erfahrung gesammelt. Ein Nachteil hat diese Art des Deployments allerdings. Da ich nun auf den Profile parameter angewiesen bin, kann ich den gleichen cdk deploy Befehl nicht auch für den Teststack nutzen und ich muss zwei CDK Befehle ausführen:

```BASH
cdk deploy "$STACK_NAME_TEST"
cdk deploy "$STACK_NAME_PRODUCTION" --profile=prod
```

Es wäre toll wenn ich bei der Definition im Multistack einfach den Profil namen angeben könnte. Wirklich schlimm ist dieser Nachteil natürlich nicht, da in einer vernünftigen Pipeline sowieso der Teststack alleine nur ausgeführt werden sollte und nachdem die Testphase abgeschlossen ist der Produktionstack deployed wird.

**EDIT:** Ich habe Feedback bekommen, dass es dafür bereits einen Workaround gibt in der npm registry: https://github.com/hupe1980/cdk-multi-profile-plugin

# DevOps Travis Pipeline
Travis sollte jedem Developer bekannt sein. Der Free Tier von Travis erlaubt es, wenn dein GitHub Projekt public ist, darfst du VMs von Travis benutzen. Diese müssen dann lediglich nur noch in der .travis File definiert und konfiguriert werden. Genau das mache ich. Ehrlich gesagt nutze ich Travis sehr stark. Ich beschreibe einfach mal kurz meinen Workflow wenn ich ein neues Feature kreiere:

1) Code Anpassungen von neue Feature in master schreiben.
2) Ggf. neuen Test in Postman hinzufügen.
3) master committen --> Travis build wird getriggert.
4) Travis schlägt fehl oder passt.
5) Wenn es fehl geschlagen ist, reverted der Stack automatisch und ich werte die Logs aus um zu sehen was schief lief. Zurück zu schritt 1).
6) Wenn es passt ist auf allen Stacks das neue Feature und ich kann es jetzt manuell testen.

Das ist sehr genial da ich weniger Interaktionen ausführen muss um dieses neue Feature zu implementieren. Der gesamt Build dauert in etwa 10 Minuten und ich kann dann 10 Minuten einfach was anderes machen. Diese Art der Pipeline hat mir ein sehr schnelle Iteration von neuen Features gebracht. Ich bin regelrecht baff was heutzutage möglich ist mir nur einem DevOps. Was ich alleine leisten kann, dafür hätte man vor 5 Jahren garantiert 10 Leute anstatt nur einem gebraucht.

# Zusammenfassung
CDK's Multistacks sind eine tolle Art und Weise mehrere Stacks wie einen Teststack und Produktionsstack zu verwalten. Für mein kleines Projekt habe ich tolle Erfahrungen mit dieser Art der Stackverwaltung gesammelt und hier beschrieben. Bisher hat auch komplett ein relative kleiner Travis build ausgereicht um eine nützliche Pipeline zu kreieren. Ich erwäge in AWS CodePipeline reinzuschauen ob es mir Vorteile bieten könnte. Ich hoffte euch hat meine kleine Zusammenfassung gefallen :)

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>