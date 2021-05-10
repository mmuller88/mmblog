---
title: AWS CDK Custom Construct Version Compatibility Checker
show: 'no'
date: '2021-05-16'
image: 'ddb-qs.jpg'
tags: ['de', '2021', 'projen', 'cdk', 'aws', 'construct', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/cdk-construct-checker-eng
pruneLength: 50
---

Hi CDK Fans!

* habe viele Custom Constructs. Aufliste
* CDK iteriert sehr schnell und es kommen wöchtentlich neue versions releases
* Möchte sichergehen dass meine Custom Constructs Kompatibel mit neuen Versionen sind
* Benutze Peer Dependencies. Posts von Daniel

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die z.B. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.

# GitHub Workflow
...

# Getestete Versions Liste
Mir kam dan noch die coole Idee zur Erstellung einer List von den bereits getesteten CDK Versionen. Es werden einfach die erstellten Pull Requests mit dem zuvor erstellten Label **cdk-version-test** versehen.

```yaml
- name: pull-request
  uses: repo-sync/pull-request@v2
  with:
    source_branch: bump/${{ env.CDK_VERSION }}
    pr_title: Testing CDK version to ${{ env.CDK_VERSION }}
    pr_label: "cdk-version-test"  
    destination_branch: "master"
    github_token: ${{ secrets.PUSHABLE_GITHUB_TOKEN }}
```

Dann kann einfach per Link auf einen Filter mit dem Label verwiesen werden wie z.B. https://github.com/mmuller88/aws-cdk-build-badge/pulls?q=is%3Apr+is%3Aopen+label%3Acdk-version-test) . Und tada es werden alle PRs zum Versionstest angezeigt.

![pic](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-construct-checker/versions.png)

# Zusammenfassung
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>