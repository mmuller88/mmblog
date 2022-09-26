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

## Warum eine CI/CD Staging Pipeline?

Zusammen mit dem Kunden planen und entwickeln wir ein ein komplexes AWS Setup mit [Hasura](https://hasura.io/), RDS, ECS und vielen weiteren Services. Dieses Setup soll unter anderem auch mit der existierenden Produktionsumgebung in Salesforce interagieren. Es ist also von größter Wichtigkeit neue Funktionalitäten auf einer DEV und QA Umgebung zu testen. 

Diese Umgebungen DEV und QA, sollen sich dabei möglichst ähnlich zur originalen Umgebung PROD verhalten. Darüber hinaus sollen Änderungen möglichst schnell auf die PROD Umgebung ausführbar sein mit möglichst wenig benötigten manuellen Schritten. Genau für diese Anforderungen eignet sich eine CI/CD Staging Pipeline.

## Multi-Account Setup

Um eine CI/CD Staging Pipelines zu erstellen ist es best practice für jede stage wie DEV, QA oder PROD einen eigenen AWS Account zu verwenden. Das Pipeline Setup muss also in der Lage sein diese Accounts mit Terraform zu bootstrappen bzw. zu initialisieren und anschließend Änderungen auszurollen.

Für das Multi-Account Setup habe ich mir den Artikel [Terraform AWS Multi-Account Setup](https://cloudly.engineer/2021/terraform-aws-multi-account-setup/aws/) zum Vorbild genommen bei dem mittels Config Files wie [accounts/dev/backend.conf](https://github.com/mmuller88/tf-pipeline-circleci/blob/main/accounts/dev/backend.conf) und [accounts/dev/terraform.tfvars](https://github.com/mmuller88/tf-pipeline-circleci/blob/main/accounts/dev/terraform.tfvars) die jeweilige Stage konfiguriert wird. Super cool ist nun, dass damit die gleiche [main.tf](https://github.com/mmuller88/tf-pipeline-circleci/blob/main/main.tf) für alle Staging Umgebungen verwendet werden kann.

Zu oft sehe ich bei Kunden die mit Terraform arbeiten, dass für jede Staging Umgebung eigene TF Files erzeugt werden und Ressourcen hin und her kopiert werden. Das muss aufhören und der hier beschriebene Ansatz kann dabei helfen!

## CircleCI Staging Pipeline

[CircleCI](https://circleci.com/) ist eine continuous integration and continuous delivery Plattform für DevOps Funktionalitäten. Ähnlich wie auch auf anderen DevOps Plattformen wie Travis oder GitHub Actions wird eine Pipeline yaml Definition im Ordner .circleci mit den Namen config.yml angelegt. Sehr toll finde ich, dass CircleCI manuelle Approvals unterstützt und einfach integrierbar macht mit:

```yml
workflows:
  version: 2
  plan_approve_apply:
    jobs:
      - dev-plan-apply
      - dev-hold-apply:
          type: approval
          requires:
            - dev-plan-apply
     ...
```

Somit können die geplanten Infrastruktur-Änderungen erst begutachtet und dann durchgeführt werden. Den vollständigen Code seht ihr [hier](https://github.com/mmuller88/tf-pipeline-circleci/blob/main/.circleci/config.yml).

## Ausblick

Als nächstes möchte ich [CDKTF](https://github.com/hashicorp/terraform-cdk) einführen damit die Infrastruktur mit TypeScript definiert werden kann. Ähnlich wie es für mich auch der Fall mit AWS CDK war, verspreche ich mir dadurch ein schnelleres Entwickeln mit Terraform. Der Typen-Support erlaubt mir fehlende Terraform properties schon früh zu erkennen. Auch ist die Dokumentation von den Properties sehr angenehm und ich muss somit kaum noch in der Terraform Dokumentation nachsehen.

Danach bin ich auch schon sehr gespannt wie AWS Ressourcen wie Aurora, ECS, VPC und so weiter mit Terraform integriert werden. Das Ganze erweitert mein Set an Tools mit denen ich coole Sachen in AWS bauen kann.

## Fazit

Eine CI/CD Staging Pipeline ist ein wichtiges Tool um verlässliche Infrastruktur in AWS zu bauen. Hier in diesem Artikel habe ich euch gezeigt wie ihr es mit Terraform in AWS machen könnt. Da ich noch ein Anfänger in Terraform bin, habe ich eventuell kleine Fehler gemacht. Wenn ihr Verbesserungsvorschläge habt oder einfache coole Projekte mit mir besprechen wollt, schreibt mir gerne an :)!

Ich liebe es an Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
