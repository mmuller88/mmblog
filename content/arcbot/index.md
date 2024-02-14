---
title: AI Softwareentwicklung mit Ninox und arcBot
show: "no"
date: "2024-02-14"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=arcbot&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=arcbot&state=visitor"
tags: ["de", "2024", "ninox", "ai"] #nofeed
engUrl: https://martinmueller.dev/arcbot-eng
pruneLength: 50
---

KI beflügelt die Unternehmenslandschaft. Viele einfache und komplexe Prozesse im Unternehmen können durch AI stark vereinfacht oder sogar komplett automatisiert werden. Jakob mein Co-Founder und ich sehen es als spannende Herausforderung, wie wir den Zugang zu AI für kleine und mittelständische Unternehmen vereinfachen können. Wir glauben mit der Low Code Plattform [Ninox](https://ninox.com) und unserem AI Chatbot [arcBot](https://app.arcbot.de) einen spannenden Ansatz gefunden zu haben. In diesem Blogpost möchte ich euch diesen Ansatz vorstellen.

## Ninox.com

[Ninox.com](https://ninox.com) ist eine cloudbasierte Low-Code-Plattform zum Bau von Softwarelösungen für kleine und mittelständische Unternehmen. Ninox wurde 2013 in Deutschland von [Frank Böhmer](https://www.linkedin.com/in/frank-boehmer/) gegründet. Hier einige Möglichkeiten, wie Ninox Unternehmen unterstützen kann:

Automatisierung der Geschäftsprozesse: Mit Ninox können Unternehmen ihre täglichen Aufgaben und Prozesse automatisieren und so ihre Effizienz steigern.

Anpassbarkeit: Da Ninox eine Low-Code-Plattform ist, können Unternehmen ihre Anwendungen ohne komplexe Programmierkenntnisse an ihre spezifischen Bedürfnisse anpassen.

Integration: Ninox kann mit einer Vielzahl anderer Tools und Plattformen integriert werden, was einen nahtlosen Datenaustausch zwischen verschiedenen Systemen ermöglicht.

Kosteneffizienz: Verglichen mit der Entwicklung einer benutzerdefinierten Software von Grund auf, kann die Verwendung einer Low-Code-Plattform wie Ninox zu erheblichen Kosteneinsparungen führen.

Schnelle Implementierung: Mit Ninox können Unternehmen ihre Anwendungen schnell erstellen und implementieren, was zu einer schnelleren Markteinführung führt.

Vor einigen Monaten habe ich mit Ninox ein MVP erstellt. Meine gesammelten Erfahrungen können [hier](https://martinmueller.dev/ninox-mvp) nachgelesen werden. Im nächsten Kapitel erkläre ich, wie wir mit arcBot den Build für deine Softwarelösung in ninox vereinfachen.

## arcBot

Der arcBot ist eine ChatGPT-ähnliche KI zum schnellen Erstellen und Modifizieren von Ninox-Tabellen. Wir benutzen die AWS Bedrock API um die Ninox Tabellen Antworten zu erstellen. Ein Beispiel Prompt zum erstellen von Ninox Tabellen könnte wie folgt aussehen:

`Create customer and product tables in a many to many relationship.`

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/createTable.gif" alt="Zeichnung" width="800"/>

Cool oder? arcBot erstellt viele Tabellen für Kunden und Produkte. Bemerkenswert ist, dass arcBot sogar die ninox-typischen inversen Felder setzen kann. Im nächsten Prompt wollen wir den Last Name zu einem Customer hinzufügen.

`Add last name to customer table`

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/addLastName.gif" alt="drawing" width="800"/>

Für die Antwort verwendet arcBot das [Claude v2.1 model](https://docs.anthropic.com/claude/docs/claude-2p1-guide), das über die [AWS Bedrock API](https://docs.aws.amazon.com/bedrock/) zur Verfügung gestellt wird.

Wie stellen wir sicher, dass die Qualität der Antworten so hoch wie möglich ist? Wir haben eine Feedbackschleife eingebaut. Der Nutzer kann nach der Antwort Feedback geben. Dieses Feedback wird dann zur Verbesserung von arcBot verwendet.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/feedback1.png" alt="Zeichnung" width="800"/>
<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/feedback2.png" alt="Zeichnung" width="800"/>

Ich stehe auch in engem Kontakt mit anderen Gen AI Experten, die mir helfen, die Qualität der arcBot Antworten zu verbessern. An dieser Stelle möchte ich mich bei diesen Experten bedanken. Es sind hauptsächlich AWS Community Mitglieder und AWS Mitarbeiter die mir schon viele wertvolle Tipps gegeben haben. Vielen Dank 🙏

## Ninox Connector

Es ist cool, dass wir mit arcBot Ninox Tabellen erstellen können, aber wie können wir die Daten in Ninox weiterverarbeiten? Hier kommt der Ninox Connector ins Spiel. Der Ninox Connector kann Ninox Tabellen lesen und aktualisieren. Das folgende Bild zeigt den Ninox Connector.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/ninox-connector.png" alt="Zeichnung" width="800"/>.

Der Ninox Connector benötigt einige Informationen wie die Ninox Url, Team Id, Database Id und den Ninox API Key. Zurzeit is der Ninox Connector nur über den Early Access verfügbar. Dieser ist aber ganz leicht auf https://app.arcbot.de/ zu bekommen.

## Discord Community

Werdet Teil unserer [Discord Community](https://discord.gg/MMWZSHSrEQ). Wir haben bereits einige Member welche uns wertvolles Feedback und Feature Wünsche zu dem arcBot mitteilen.

## Ausblick

Der arcBot soll mit Hilfe eures Feedbacks verbessert werden.

Wir überlegen uns auch, Connectoren für andere Low-Code Plattformen zu erstellen. Interessant sind [Airtable](https://www.airtable.com/), [Zoho Creator](https://www.zoho.com/) und andere. Falls euch einen der Connectoren interessiert, lasst es uns wissen.

## Zusammenfassung

In diesem Blogpost habe ich euch gezeigt, wie wir durch die Kombination von Ninox und arcBot das Erstellen und Aktualisieren von Ninox-Tabellen vereinfachen. Wir freuen uns auf euer Feedback. Vielen Dank fürs Lesen.

Ich liebe es, an Open-Source-Projekten zu arbeiten. Viele Dinge kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88). Wenn du meine Arbeit dort und meine Blog-Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

Und schau doch mal auf meiner Seite vorbei

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)