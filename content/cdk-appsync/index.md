---
title: Ein sehr coole DevOps AWS CDK Todolist
show: 'no'
date: '2021-02-23'
image: 'pipeline.png'
tags: ['de', '2021', 'projen', 'cdk', 'aws']
engUrl: https://martinmueller.dev/cdk-appsync-eng
pruneLength: 50
---

Hi.

Schon lange träume ich von dem Bau einer Platform mit einer tollen DevOps Experience. Ich möchte so coole sachen darin haben wie:
* Infrastructure as Code (IAC)
* CI / CD (Continuous Integration / Continuous Deployment)
* Ein Staging z.B. dev, qa, prod
* automatisierte Tests
* das alles mit so wenig TypeScript Code wie nötig

Ich habe das nun gefunden mit der Verwendung der folgenden Technologien. AWS CDK zum managen der Infrastructure as Code. AWS AppSync als Implementierung von GraphQL, AWS Amplify für die Frontend Website und das managen von Usern. Weiterhin AWS CodePipeline erweitert mit meiner library [AWS CDK Staging Pipeline](https://github.com/mmuller88/aws-cdk-staging-pipeline).

Anhand meins Todolisten Deployments will ich euch zeigen wie viel Power in meinem Deployment steckt. Aber zunächst werde ich erklären was AWS CDK ist.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die z.B. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.

# Backend AWS AppSync, AWS DynamoDB and AWS Cognito
Der Code für das Backend ist in [GitHub aws-cdk-todolist](https://github.com/mmuller88/aws-cdk-todolist).

AWS AppSync ist eine GraphQL Api Implementierung. GraphQL ist eine interessante neue API Technologie. Da GraphQL noch neu für mich ist, wage ich keine großen Aussagen jetzt und hier. Was mir aber sehr gut gefällt ist, dass sich die Anbindung an Datenbanken wie AWS DynamoDB sehr nativ anfühlt. Mich haben schon immer die nötigen Lambda Implementierungen bei AWS Api Gateway und das Anlegen neuer Endpoints genervt. Das alles scheint nicht mehr nötig mit der Verwendung von AWS AppSync.

Für das Speichern von Items in der Todoliste verwende ich DynamoDB. Jedes Item bekommt dabei seine eigene ID, welche von dem AppSync Resolver zugewiesen wird. Darüber hinaus besitzt jedes Item einen Body und einen Username.

AWS Cognito ist ein Service für die Userverwaltung und Userauthentifikation über Oauth. Dieser Service macht es sehr einfach einen professionellen und skalierbaren Identity Service mit allem drum und dran zu implementieren.

Eine Deployment Pipeline deployed all diese Ressourcen in AWS Accounts. Die AWS Ressourcen für das Backend und die Deployment Pipeline selbst, werden mit AWS CDK als Infrastructure as Code bereitgestellt.

# Frontend React, AWS Amplify, S3 Static Website
Der Code für das Frontend ist in [GitHub aws-cdk-todolist-ui](https://github.com/mmuller88/aws-cdk-todolist-ui).

Der Frontend Stack besteht aus einem React Build mit AWS Amplify UI Erweiterungen wie @aws-amplify/auth @aws-amplify/ui-components @aws-amplify/ui-react. Diese Erweiterungen helfen massiv bei der Userverwaltung. So ist es z.B. einfach möglich über den Loginscreen neue Benutzer anzulegen oder das Passwort zu ändern, falls man es vergessen haben sollte.

Der React Build wird per Deployment Pipeline (siehe nächsten Abschnitt) in einen S3 Bucket kopiert. Der S3 Bucket ist als Static Website konfiguriert. Alle benötigten AWS Ressourcen für den S3 Bucket und der Deployment Pipeline werden ebenfalls mit AWS CDK bereitgestellt.

# DevOps Pipelines
Jegliche Deployments heutzutage sollten eine vernünftige Deployment Pipeline besitzen die so coole Features hat wie automatisierte Builds, Deploys, Tests, Linting, Versioning und so weiter. Damit erreicht man einen ungleiblich gute Geschwindigkeit bei der Entwicklung und die Arbeit macht auch viel mehr Spaß weil lästige manuelle Tätigkeiten wie das Deployen zur Produktion oder manuelles Testen, fallen einfach weg.

Mein Todolisten Deployment hat eine solche Deployment Pipeline. Jeweils das [Frontend](https://github.com/mmuller88/aws-cdk-todolist-ui) und [Backend](https://github.com/mmuller88/aws-cdk-todolist) besitzen ihre eigene Pipeline welche auf AWS CodePipeline und natürlich AWS CDK basiert. Für die Pipeline habe ich ein eigens AWS CDK Custom Construct entwickelt und auch schon darüber in einem vorherigen Post berichtet welchen ihr [hier](https://martinmueller.dev/cdk-pipeline-lib) sehen könnt.

# Ausblick
Der [AppSync Transformer](https://github.com/) sieht sehr interessant aus. Mit ihm ist es möglich die [AWS Amplify GraphQL Transformer](https://docs.amplify.aws/cli/graphql-transformer/overview) einfacher zu nutzen. Somit können viele Zeilen Code gespart werden indem durch so coole labels wie @model @connection ein erweitertes GraphQL Schema generiert wird.

Ich bin gerade auch dabei ein Udemy Kurs über das hier erwähnte Todolist Deployment zu verfassen. Falls ihr einen Gutschein dafür haben wollt, sagt mir bescheid und sobald es fertig ist, bekommt ihr einen.

# Zusammenfassung
GraphQL is mega spannend. Ich glaube es ist eine zukunftsweisende API Technologie und ich kann es kaum abwarten mehr im professionellen Umfeld damit zu arbeiten.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>