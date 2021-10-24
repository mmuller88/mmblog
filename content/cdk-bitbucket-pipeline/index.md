---
title: Eine CDK BitBucket Staging Pipeline
show: 'no'
date: '2021-10-25'
# image: 'logo.png'
tags: ['de', '2021', 'bitbucket', 'aws', 'cdk', 'nofeed'] 
engUrl: https://martinmueller.dev/cdk-bitbucket-pipeline
pruneLength: 50
---

Seit einiger Zeit arbeite ich für einen Kunden mit sehr aufregenden AWS CDK Aufgaben. Der Kunde ist stark im Atlassian Ecosystem unterwegs. Zum hosten des Codes wird da natürlich BitBucket verwendet. Nun will der Kunde stärker in den DevOps bereich vordringen und seine AWS Deployments auch mit AWS CDK managen. Dafür soll die vorhandene AWS Infrastruktur in CDK übersetzt werden. Zusätzlich soll eine Staging Deployment-Pipeline die CDK Apps auf den Stages dev, qa und prod deployen. Gerne helfe ich da weiter :).

# Disclaimer
Hier folgt ein kleiner Disclaimer. Auch wenn ich bereits sehr viel Erfahrung mit CDK habe (siehe TAGS CDK), kenne ich mich so noch gar nicht mit BitBucket aus. Von daher weiß ich nicht ob mein Ansatz der ideale ist, aber zum Zeitpunkt des Schreibens dieses Artikels, funktioniert dieser ganz gut :).

Ich schreibe diesen Artikel hauptsächlich da ich keine anderen hilfreichen Posts oder Anweisungen gefunden habe, wie man vernünftig eine CDK Staging Deployment-Pipeline baut mit BitBucket. Falls du also vielleicht eine ähnliche Aufgabe hast, kann ich dir damit den Einstieg eventuell erleichtern.

# Welche Pipeline?
Nun stellte sich natürlich die frage wo soll die CDK Staging Deployment-Pipeline denn leben? Zu Auswahl standen AWS CodePipeline oder BitBucket's Pipeline. 

## Vielleicht AWS CodePipeline?
Der Vorteil von AWS CodePipeline wäre das es dafür schon geniale AWS CDK Staging Pipeline Construct gibt wie z.B. der [CDK Pipeline]() . Damit hätte man fast alles was das DevOps Herz begehrt z.B. eine Synth Action wobei aus CDK das Cloudformation template generiert wird und Deploy Actions die dann zu den jeweiligen Stages deployen. Auch mega geniall von der CDK Pipeline sind die optionalen Actions die nach dem Deploy zu einer Stage ausgeführt werden können. Damit können z.B. Integrations Tests nach dem Deploy ausgeführt werden. Auch sehr schön ist, dass die Pipeline in TypeScript definiert ist und z.B. somit eine Dokumentation mitliefert und durch die Types einen gewissen Standard ja bereits schon vorgibt.

## Oder BitBucket's Pipeline?
Der Kunde verwendet bereits BitBucket's Pipeline zum Testen, Linten und dem Erstellen von Builds. Von daher wäre es unschön wenn der Kunde gezwungen wäre zwischen den zwei Pipeline Dashboards AWS CodePipeline und BitBucket's Pipeline hin und her zu schalten. Außerdem lassen sich prinzipielle ja alle Funktionen von der AWS CodePipeline und dem CDK Pipeline Construct ja quasi nachprogrammieren mit BitBucket's Pipeline.

Ein ziemlich cooles Feature welches AWS CodePipeline nicht hat ist das Skippen von Steps falls das angegebene Subdirectory nicht geändert wurde. Hier ist ein Beispiel:

```yaml
- step:
    name: Synth CDK app
    condition:
      changesets:
        includePaths:
          - "bitbucket-pipelines.yml"
          - "devops/**"
    script:
      - echo "synth cdk app"
      ...
```

So ein cooles Feature vermisse ich bei AWS CodePipeline. Auch verwendet der Kunde ein Monorepo. Es sind also alle Projekte in einem BitBucket Repository. Das wäre auch sehr Nachteilig für AWS CodePipeline da dieses ja immer bei jedem Commit einen Pipeline Run auslösen würde.

Unter Berücksichtigung aller Vor- und Nachteile haben wir uns für BitBuckets's Codepipeline als CDK Staging Deployment-Pipeline entschieden.

## Ordnerstrucktur
Wie bereits gesagt, der Kunde hat ein Monorepo und das möchte dieser natürlich beibehalten. Wir haben uns nun für die folgender Ordnerstrucktur entschieden:

```bash
devops - Contains AWS CDK dependencies
devops/${STAGE} - Contains stage specific scripts like bootstrap command
devops/${STAGE}/vpc - VPC CDK App
devops/${STAGE}/cognito - Cognito CDK App
devops/${STAGE}/website - S3 Website CDK App
...
```
STAGE ist entweder dev, qa oder prod .

Im **devops** Ordner befinden sich die AWS CDK dependencies. Via package.json werden alle benötigten CDK Libraries geladen z.B. :
```json
  "dependencies": {
    ...
    "@aws-cdk/aws-s3": "1.128.0",
    "@aws-cdk/aws-cloudfront": "1.128.0",
    "@aws-cdk/aws-cloudfront-origins": "1.128.0",
    "@aws-cdk/aws-s3-deployment": "1.128.0",
    ...
  }
```
Auch beinhaltet die package.json ein Script zum bootstrap des Build AWS Accounts und des Synthetisierens. Der Build AWS Account ist der Account von wo aus die Stages verwaltet werden. Synthetisieren bezeichnet man den Prozess bei der die CDK App in ein oder mehrere Cloudformation Templates überführt wird:

```ts
"scripts": {
    ...
    "synth": "yarn build && yarn cdk synth",
    "bootstrap": "yarn build && yarn cdk bootstrap --trust 11111111,222222,3333333,44444444 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://12345678/us-east-1"
  },
```

# Beispiel S3 Static Website Hosting
* Kunde hat ReactTS App und hosted diese in einem S3 Static Website Bucket.
* Soll über Staging



* devops/src
* für main.ts für Synth step
* Etwas komisch, aber erhoffen uns so eine bessere Übersichtlichkeit. Ändern das vielleicht.

## Scripte
* Scripte in package.json unter devops/package.json, devops/${STAGE}/website/package.json

# bitbucket pipeline
* yml
....

# What is next?
Im Sinne der Übersichtlichkeit fehlt uns noch eine Art Dashboard um die wichtigsten CfnOutput URLs anzuzeigen wie z.B. die Cloudfront Urls von den React Apps. Auch will man ja wissen welcher Commit bei dem jeweiligen Deploy verwendet wurde. Dafür würde sich sehr gut ein Dashboard eignen welches per Lambda die aktuellen Deployments sowie deren Commit ID herausfinden und wahrscheinlich auch direkt darstellen kann.

# Zusammenfassung
Mehr Erfahrung mit BitBucket und dem Atlassian Ecosystem zu sammeln was mega cool. Es hat mir viel Spaß gemacht unter diesen Umständen eine CDK Staging Deployment-Pipeline zu bauen. Hier habe ich grob beschrieben wie diese Pipeline aussieht und was unsere Gründe waren diese Pipeline so zu bauen.

Ob das eine gute Entscheidungen waren wird die Zukunft zeigen wenn der Kunde die Pipeline auch tatsächlich benutzt. Glaubst du wir haben etwas übersehen oder du hast Ideen was man besser machen kann? Dann schreibe mir doch bitte :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>