---
title: Programmatisch AWS Accounts erstellen und löschen
show: "no"
date: "2022-05-10"
image: "title.png"
tags: ["de", "2022", "aws", "sdk", "organizations"] #nofeed
engUrl: https://martinmueller.dev/sdk-org-eng
pruneLength: 50 #du
---

Hi.

In AWS ist es best practice neue Accounts zu erstellen wenn man zum Beispiel unterschiedliche Stages wie dev, qa und prod für seine Lösung bereitstellen möchte. Auch ist es üblich sogenannte Sandbox AWS Accounts zu erstellen um diese neuen Mitarbeiter zum Testen von AWS Services bereitzustellen. Es gibt noch viele weitere Gründe warum neue AWS Accounts erstellt werden sollte. Allen Gründen gemein ist aber dass so der maximale Grad an Separation in AWS erreicht wird.

Nun das Erstellen solcher AWS Accounts kann recht aufwendig sein, wenn es manuell gemacht werden muss. Mit AWS Organizations, dem AWS SDK und ein wenig TypeScript Kenntnissen kann der Prozess zum Großteil automatisiert werden. In diesem Post stelle ich vor wie das funktioniert. Dafür erkläre ich zuerst was AWS Organizations überhaupt ist und dann stelle ich die zwei TypeScript Scripte die mittels AWS SDK die AWS Sandbox accounts Erstellen und Löschen können.

## AWS Organizations

...

## createSandbox

...

## deleteSandbox

...

## Ausblick

- Wäre cool die Scripts mit einer Pipeline z.B. AWS CodePipeline oder BitBucket Pipeline oder GitHub Actions zu verbinden um automatisch neue Accounts anzulegen

## Zusammenfassung

...

Wenn du auch noch nach einer coolen AWS Community suchst kann ich dir wärmsten unsere [AWS CDK Slack Community](https://join.slack.com/t/cdk-dev/shared_invite/zt-xtpfmrqt-6ormYTA0hLdpMSAtTkM_2A) ans Herz legen. Auch sehr toll ist unsere [DACH AWS Community](https://join.slack.com/t/awscommunityde/shared_invite/zt-11ptmeylu-zpdZBIWmlbF9NNI3hY0Upw).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
