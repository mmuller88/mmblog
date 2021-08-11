---
title: Automatisiertes AWS Security Feedback mit Prowler und AWS CDK
show: 'no'
date: '2021-08-15'
image: 'wp-aws.jpg'
tags: ['de', '2021', 'github', 'prowler', 'aws', 'cdk', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/prowler-cdk-eng
pruneLength: 50
---

Hi Leute!

Toni De La Fluente hat ein super cooles AWS Security Tool entwickelt. Der Name von dem Tool ist [Prowler](https://github.com/toniblyx/prowler). Prowler ist ein command line tool das hilft mit der Durchführung von AWS Security Assessment, Auditing, Hardening and Incident Response. Mit mehr als 180 checks bietet Prowler dabei das umfangreichste Security Check Angebot für AWS welches zurzeit existiert. Wenn ihr mehr über Prowler wissen wollt besucht die [Prowler Github](https://github.com/toniblyx/prowler) Seite.

Ich benutze Prowler sehr viel und habe mich entschlossen dafür ein AWS CDK Custom Construct zu schreiben. In der Vergangenheit habe ich schon einige Custom Constructs erstellt wie meinem Favoriten der [staging pipeline](https://github.com/mmuller88/aws-cdk-staging-pipeline) oder der [build badge](https://github.com/mmuller88/aws-cdk-build-badge).

Falls ihr Prowler aber einfach nur für euren AWS Account ausführen möchtet und nicht das Custom Construct ausprobieren wollt, habe ich eine gute Nachricht. Ich habe eine auf dem AWS Marketplace erhaltbare AMI erstellt welche das cdk-prowler construct automatisch in euren Account installiert. Die AMI hat den Namen "..."

Dann führt Prowler den Security Check durch und ihr findet die Security Findings in einem S3 Bucket mit Namen prowleraudit-stack-prowlerauditreportbucket den HTML Report

![html results](html-out.png)

Oder auch in der Codebuild Report group:

![Report group](report-group-out.png)

Mit dem Kauf der AMI unterstützt ihr auch meine freie Arbeit zur Erstellung solch cooler frei erhältlichen Produkte wie dem cdk-prowler construct und die Arbeit an meinen Blogpost. Vielen herzlichen Dank :)!

In den nächsten Abschnitten möchte ich gerne erklären warum ich denke, dass ein CDK Costum Construct nützlich ist und will auch das cdk-prowler Custom Construct vorstellen. Dafür muss ich aber erstmal erklären was AWS CDK überhaupt ist.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die eg. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.
# Motivation

* Warum in Custom Construct?
* Einfache Möglichkeit Prowler in AWS Account zu deployen und runnen
* Dadurch dass in TypeScript ist das Custom Construct leichter zu warten und erweiterbar
* Durch Verwendung JSII kan das Custom Construct auch in andere Sprachen wie Python, Java, CSharp übersetzt werden und es lässt sich so einfach mit anderen services zusammenschalten. Z.B. SES, Slack notification

# Zusammenfassung
* Prowler ist megacool und ich liebe einfach dass es mir automatisiert Feedback über Security, Best Practises usw gibt. Das ginge sogar täglich.
* Mit AWS CDK lässt sich ProwlerAudit leicht installieren und mit anderen Services verschachteln.
* Testet das ProwlerAudit Construct und vielleicht habt ihr ja sogar Vorschläge um es noch cooler zu machen. Gerne könnt ihr dafür auch PRs in Github erstellen
...

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>