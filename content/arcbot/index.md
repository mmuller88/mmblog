---
title: AI für den Mittelstand mit Ninox und arcBot
show: "no"
date: "2024-01-20"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=arcbot&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=arcbot&state=visitor"
# image: "titleGuitar.png"
tags: ["de", "2024", "aws", "ninox", "nofeed"] #nofeed
engUrl: https://martinmueller.dev/arcbot-eng
pruneLength: 50
---

AI beflügelt gerade die Unternehmerlandschaft. Viele einfache und komplexe Prozesse im Unternehmen lassen sich mit AI stark vereinfachen oder gar komplett automatisieren. Jakob mein Co-Founder und ich sehen es dabei als spannende Herausforderung wie wir kleinen bis mittelgrossen Unternehmen den Zugang zu AI vereinfachen können. Wir glauben einen spannenden Ansatz mit der Low-Code Plattform [Ninox](https://ninox.com) und unserem AI Chatbot [arcBot](https://app.arcbot.de) gefunden zu haben. In diesem Blogpost möchte ich euch zeigen wie wir mit Ninox und arcBot eine AI Lösung für den Mittelstand bauen.

## ninox.com

[Ninox.com](https://ninox.com) ist eine Cloud-basierte low-code Plattform zum Bauen von Softwarelösungen für kleine und mittelgrosse Unternehmen. Ninox wurde 2013 von [Frank Böhmer](https://www.linkedin.com/in/frank-boehmer/) in Deutschland gegründet. Stand 2021 zählte Ninox mehr als 6.000 Kunden. Hier sind einige Möglichkeiten, wie Ninox Unternehmen helfen kann:

Automatisierung von Geschäftsprozessen: Mit Ninox können Unternehmen ihre täglichen Aufgaben und Prozesse automatisieren, was zu einer erhöhten Effizienz führt.

Anpassungsfähigkeit: Da Ninox eine Low-Code-Plattform ist, können Unternehmen ihre Anwendungen an ihre spezifischen Bedürfnisse anpassen, ohne dass sie komplexe Programmierkenntnisse benötigen.

Integration: Ninox lässt sich in eine Vielzahl von anderen Tools und Plattformen integrieren, was eine nahtlose Datenübertragung zwischen verschiedenen Systemen ermöglicht.

Kosteneffizienz: Im Vergleich zur Entwicklung einer benutzerdefinierten Software von Grund auf, kann die Verwendung einer Low-Code-Plattform wie Ninox erhebliche Kosten einsparen.

Schnelle Implementierung: Mit Ninox können Unternehmen ihre Anwendungen schnell erstellen und implementieren, was zu einer schnelleren Markteinführung führt.

Vor vielen Monaten habe ich ninox schonmal verwendet um einen MVP zu bauen. Meine gesammelten Erfahrungen könnt ihr [hier](https://martinmueller.dev/ninox-mvp) nachlesen. Im nächsten Kapitel erklären wie wir mt arcBot den Bau für deine Softwarelösung in Ninox vereinfachen.

## arcBot

Der arcBot ist ein ChatGPT ähnliche KI zum schnellen erstellen und modifizieren von Ninox Tabellen. Wir nutzen dabei die AWS Bedrock API zum erstellen der Ninox Tabellen Responses. Ein Beispiel Prompt für das erstellen von Ninox Tabellen könnte dabei wie folgt aussehen:

`Create customer and product tables in a many to many relationship.`

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/createTable.gif" alt="drawing" width="400"/>

Cool oder? arcBot erstellt many to many Tabellen für Customers und Products. Zu beachten ist hier das arcBot sogar die ninox typischen reverse Fields setzen kann. Im nächsten Prompt wollen wir den Last Name zu einem Customer hinzufügen.

`Add last name to customer table`

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/addLastName.gif" alt="drawing" width="400"/>

Für den Response nutzt der arcBot das [Claude v2.1 model](https://docs.anthropic.com/claude/docs/claude-2p1-guide) welches über die [AWS Bedrock API](https://docs.aws.amazon.com/bedrock/) zur Verfügung gestellt wird.

Wie gehen wir sicher dass ein möglichst hohe Qualität bei den Responses erreicht wird? Wir haben ein Feedback Loop eingebaut. Der User kann nach dem Response Feedback geben. Dieses Feedback wird dann genutzt um arcBot zu verbessern.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/feedback1.png" alt="drawing" width="400"/>
<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/feedback2.png" alt="drawing" width="400"/>

Auch bin ich im engen Austausch mit anderen Gen AI Experten die mir helfen die Qualität der arcBot Responses zu verbessern. An dieser Stelle möchte ich gerne diesen Experten danken. Es sind hauptsächlich AWS Community Mitglieder und AWS Mitarbeiter die mir schon viele wertvolle Tipps gegeben haben. Vielen vielen Dank 🙏

## Ninox Connector

Es ist zwar cool dass wir mit dem arcBot Ninox Tabellen erstellen können, aber wie können wir die Daten in Ninox weiterverarbeiten? Hier kommt der Ninox Connector ins Spiel. Der Ninox Connector kann Ninox Tabellen auslesen und updaten. Im nachfolgendem Bild ist der Ninox Connector zu sehen.

<img src="https://github.com/mmuller88/mmblog/raw/master/content/arcbot/ninox-connector.png" alt="drawing" width="400"/>.

Der Ninox Connector benötigt ein paar Informationen wie der Ninox Url, Team Id, Database Id und dem Ninox API Key.

### Safety first

Um sicherzustellen dass im Ninox Connector gespeicherte hoch sensitive Daten wie die Ninox API keys sicher sind, werden diese verschlüsselt in der Datenbank hinterlegt. Auch sind diese sensitive Daten Teil des User JWT Token Claim welches nach erfolgreicher Authentifizierung mitgesendet wird. So ist sichergestellt dass nur der User selbst Zugriff auf seine Daten hat.

* Update Database connected direkt zur Ninox API

## Join our Beta Test

Hol dir Early Access https://app.arcbot.de/ . 

* ArcBot Discord

## Outlook

* ArcBot Response verbessern mit eurem Feedback
* Vorhandene Ninox Tabellen mit ArcBot weiter ausbauen. Sollte eigentlich jetzt schon gehen
* Coole neue Features
* Ninox Connector is nur der Anfang. Wollen Connectoren für andere Low-Code Plattformen entwickeln. Interessant sind da Airflow, Flatter, Retool and n8n.

## Conclusion

...
