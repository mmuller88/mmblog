---
title: Terraform CI/CD Staging Pipeline mit CircleCI
show: "no"
date: "2022-10-01"
image: "title.png"
tags: ["de", "2022", "aws", "terraform", "serverless", "nofeed"] #nofeed
engUrl: https://martinmueller.dev/tf-pipeline-eng
pruneLength: 50 #du
---

Hi,

Terraform CI/CD Staging Pipelines, wobei das CD für Continuous Deployment steht, erlauben ein sicheres und kontinuierliches Entwickeln von Infrastruktur mit Terraform. Üblicherweise wird durch ein Commit im main Branch die Pipeline gestartet und die gewünschten Änderungen zuerst auf der DEV Stage ausgeführt. Durch ein manuelles Approval können dann die Änderungen auf die QA Stage und anschließend auf die PROD Stage mit der Pipeline ausgerollt werden.

Wie so eine Terraform CI/CD Staging mit AWS als Cloud Provider aussehen kann, möchte ich hier gerne vorstellen.

## Warum eine CI/CD Staging Pipeline mit CircleCI?

* Der Kunde plan ein komplexes AWS Setup mit Hasura, RDS, ECS und vielen weiteren Services
* Änderungen möchten wir gerne auf einer DEV Umgebung testen die möglichst ähnlich zu PROD ist
* Änderungen sollen dann auch möglichst schnell auf PROD übertragen werden können
* Ich habe viel Erfahrung mit CI/CD Staging Pipelines von AWS CDK deshalb transferiere ich einige Methoden von dort
* CicleCI als Pipeline-Tool hat sich der Kunde gewünscht. Es war herausfordernd da CircleCI für mich noch neu war.

## Multi-Account Setup

* accounts Folder mit staging files
* https://cloudly.engineer/2021/terraform-aws-multi-account-setup/aws/

## CircleCI Staging Pipeline

* Simpler Hello World S3 Bucket soll auf die Staging Accounts via CircleCI deployed werden.
* CircleCI Code

## Fazit

...

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
