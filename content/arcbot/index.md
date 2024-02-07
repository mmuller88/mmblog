---
title: AI für den Mittelstand mit Ninox und arcBot
show: "yes"
date: "2024-02-10"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=arcbot&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=arcbot&state=visitor"
# image: "titleGuitar.png"
tags: ["de", "2024", "ninox", "nofeed", "ai"] #nofeed
engUrl: https://martinmueller.dev/arcbot-eng
pruneLength: 50
---

KI beflügelt die Unternehmenslandschaft. Viele einfache und komplexe Prozesse im Unternehmen können durch AI stark vereinfacht oder sogar komplett automatisiert werden. Jakob mein Co-Founder und ich sehen es als spannende Herausforderung, wie wir den Zugang zu AI für kleine und mittelständische Unternehmen vereinfachen können. Wir glauben mit der Low Code Plattform [Ninox](https://ninox.com) und unserem AI Chatbot [arcBot](https://app.arcbot.de) einen spannenden Ansatz gefunden zu haben. In diesem Blogpost möchte ich euch diesen Ansatz vorstellen.

## Ninox.com

[Ninox.com](https://ninox.com) ist eine cloudbasierte Low-Code-Plattform zum Bau von Softwarelösungen für kleine und mittelständische Unternehmen. Ninox wurde 2013 in Deutschland von [Frank Böhmer](https://www.linkedin.com/in/frank-boehmer/) gegründet. Im Jahr 2023 hatte Ninox mehr als 6.000 Kunden. Hier einige Möglichkeiten, wie Ninox Unternehmen unterstützen kann:

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

`Add last name to customer table` (Nachname zur Kundentabelle hinzufügen)

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/addLastName.gif" alt="drawing" width="800"/>

Für die Antwort verwendet arcBot das [Claude v2.1 model](https://docs.anthropic.com/claude/docs/claude-2p1-guide), das über die [AWS Bedrock API](https://docs.aws.amazon.com/bedrock/) zur Verfügung gestellt wird.

Wie stellen wir sicher, dass die Qualität der Antworten so hoch wie möglich ist? Wir haben eine Feedbackschleife eingebaut. Der Nutzer kann nach der Antwort Feedback geben. Dieses Feedback wird dann zur Verbesserung von arcBot verwendet.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/feedback1.png" alt="Zeichnung" width="800"/>
<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/feedback2.png" alt="Zeichnung" width="800"/>

Ich stehe auch in engem Kontakt mit anderen Gen AI Experten, die mir helfen, die Qualität der arcBot Antworten zu verbessern. An dieser Stelle möchte ich mich bei diesen Experten bedanken. Es sind hauptsächlich AWS Community Mitglieder und AWS Mitarbeiter die mir schon viele wertvolle Tipps gegeben haben. Vielen Dank 🙏

## Ninox Konnektor

Es ist cool, dass wir mit arcBot Ninox Tabellen erstellen können, aber wie können wir die Daten in Ninox weiterverarbeiten? Hier kommt der Ninox Connector ins Spiel. Der Ninox Connector kann Ninox Tabellen lesen und aktualisieren. Das folgende Bild zeigt den Ninox Connector.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/ninox-connector.png" alt="Zeichnung" width="800"/>.

Der Ninox Connector benötigt einige Informationen wie die Ninox Url, Team Id, Database Id und den Ninox API Key.

## Discord

Early Access https://app.arcbot.de/ . 

* ArcBot Discord

## Ausblick

* ArcBot Response mit eurem Feedback verbessern


* Ninox Connector ist nur der Anfang. Wollen Connectoren für andere Low-Code Plattformen entwickeln. Interessant sind Airflow, Flatter, Retool und n8n.

## Zusammenfassung

In diesem Blogpost habe ich euch gezeigt, wie wir durch die Kombination von Ninox und arcBot das Erstellen und Aktualisieren von Ninox-Tabellen vereinfachen. Wir freuen uns auf euer Feedback. Vielen Dank fürs Lesen.

...
