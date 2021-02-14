---
title: Ein sehr coole DevOps AWS CDK Todolist
show: 'no'
date: '2021-02-18'
image: 'git.jpg'
tags: ['de', '2021', 'projen', 'cdk', 'aws']
engUrl: https://martinmueller.dev/cdk-appsync-eng
pruneLength: 50
---

Hi.

Schon lange träume ich von einer idealen Platform mit einer tollen DevOps Experience. Ich möchte so coole sachen darin haben wie:
* Infrastructure as Code (IAC)
* CI / CD (Continuous Integration / Continuous Deployment)
* Ein Staging z.B. dev, qa, prod
* automatisierte Tests

Ich glaube das nun alles gefunden zu haben mit der Verwendung der folgenden Technologien. AWS CDK zum managen der Infrastructure as Code. AWS AppSync als Implementierung von GraphQL, AWS Amplify für die Frontend Webside und das managen von Usern. Weiterhing AWS CodePipeline enhanced mit meiner library [AWS CDK Staging Pipeline](https://github.com/mmuller88/aws-cdk-staging-pipeline).

Anhand einer Todoliste will ich euch zeigen wie viel Power in meinem Deployment steckt. Aber zunächst will ich erstmal erklären was AWS CDK überhaupt ist.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastruktur als Code beschrieben. Dabei synthetisiert CDK den Code zu AWS CodeFormation templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite [Slack Community](https://cdk-dev.slack.com). Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Falls ihr Fragen habt, könnt ihr mich auch gerne fragen.

# Backend AWS Appsync
* Appsync ist eine Implementaiton von GraphQL
* Will mehr Erfahrung mit GraphQL sammeln, da es eine vielversprechende Technologie ist. Mit wenig Code eine tolle API schreiben.

# Frontend AWS Amplify
* Amplify React Typescript backend
* Userverwaltung mit Amplify Cognito
* Alle Ressourcen mit AWS CDK erstellt und nicht mit Amplify

# DevOps Pipelines
* Für Backend und Frontend
* Meine Library mit higher order function

# Ausblick
* Appsync Transformer von Kenneth
* Udemy Kurs über dieses Beispiel

# Zusammenfassung
* GrapQL ist spannend

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>