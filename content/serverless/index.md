---
title: Was ist Serverless?
show: "no"
date: "2022-05-20"
# image: "title.png"
tags: ["de", "2022", "aws", "sdk", "organizations", "nofeed"] #nofeed
engUrl: https://martinmueller.dev/serverless
pruneLength: 50
---

Um gleich ein mögliches Missverständnis aufzuklären! Serverless heißt nicht dass es keinen oder keine Server mehr gibt! Im Gegenteil! Cloud Provider wie zum Beispiel AWS, die Serverless anbieten, verfügen über sehr viele Server weltweit.

AWS REGIONS
AWS RECHENZENTRUM

Jetzt und im Folgenden möchte ich für die jeweilige Sektion anhand von S3 und Lambda als Beispiel erklären.

S3 ist ein AWS Service der als object storage genutzt werden kann.

Lambda ist ebenfalls ein AWS Service der zum compute verwendet werden kann. Das wird in der Regel dafür benutzt um die Businesslogik von meiner Cloud Applikation zu implementieren.

## Warum Serverless?

**Geringere Komplexität**. Als Cloud Entwickler muss ich mich nicht mehr um die Verwaltung (Hardware und Software) der Server. Somit kann ich mich direkter auf die Businesslogik meiner Applikation in der Cloud konzentrieren.
Mit S3 kann ich als Entwickler einfach und unkompliziert über die S3 API Daten speichern. Bei Lambda kann ich die Businesslogik direkt als Code z.B. TypeScript oder Python definieren und an die Lambda API übergeben. Der AWS Lambda Service übernimmt dann den Rest. Ich brauche mich nicht um irgendwelche Betriebssystem-relevante Sachen wie zum Beispiel bei Ec2 zu kümmern.

**Bessere Skalierbarkeit**. Serverless Angebote skalieren automatisch per default. So können in S3 beliebig viele Objekte gespeichert werden ohne, dass es der Entwickler das Volumen anpassen muss wie zum Beispiel bei [AWS EBS](). Auch Lambda kann fast beliebig skalieren. Steigt die Nachfrage zur Ausführung der Businesslogik werden sogar mehrere Lambda Instanzen gestartet um die zeitnahe Abarbeitung zu gewährleisten. Falls keine Ausführung der jeweiligen Businesslogik benötigt wird, werden auch keine Lambda Instanzen gestartet.

**Kostenoptimierung**. Schon durch den vorherigen Punkt über die bessere Skalierbarkeit lässt sich vermuten dass dadurch Kostenersparnisse zu möglichen Alternativen ergeben können. Dies muss aber nicht immer unbedingt der Fall sein und auch generell Kosten von Serverless mit Alternativen zu vergleichen ist schwierig. Deswegen behandel ich Kostenoptimierungen in diesem Artikel nicht weiter. Nur soviel sei gesagt, dass ich persönlich gerne auf die Serverless Angebote von AWS zugreife da dieses vor allem in der Anfangsphase zu sehr geringe Kosten führt.

## Aber wie funktioniert Serverless?

- Cloud wie AWS erster Schritt keine locale Hardware mehr nötig
  - benutzen APIs um dieses Angebot möglich zu machen
- zweiter Schritt is Serverless
- Beispiel S3 und Lambda

- was wird der dritte Schritt sein? Monada arbeitet dran!

## Zusammenfassung

...

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
