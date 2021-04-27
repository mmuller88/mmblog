---
title: AWS QuickSight DataSet und DataSource CDK Custom Constructs
show: 'no'
date: '2021-05-01'
image: 'ddb-qs.jpg'
tags: ['de', '2021', 'projen', 'cdk', 'aws', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/qs-quicksight-eng
pruneLength: 50
---

Hi.

* Vorherigen Blogposts über DynamoDB und Analysen mit Athena und QuickSight
* Unglücklicherweise ist QuickSight nur minimal unterstützt von Cloudformation und QuickSight's DataSource und DataSet sind bisher nur auf der Roadmap https://github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/issues/274
* Hab daher AWS CDK Custom Constructs für DataSource und DataSet entwickelt ähnlich wie https://github.com/mmuller88/aws-cdk-ssm-sdk-parameter


# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die z.B. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.

# DataSource
...

# DataSet
...

# Beispiel
...

# Ausblick
...

# Zusammenfassung
...

Nochmal vielen Dank an [TAKE2](https://www.take2.co/) für das Sponsoring dieses Blogposts.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>