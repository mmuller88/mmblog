---
title: Scrum und GitHub
show: 'no'
date: '2021-02-11'
image: 'git.jpg'
tags: ['de', '2021', 'github']
engUrl: https://martinmueller.dev/github-scrum-eng
pruneLength: 50
---

Hi.

Unser Entwicklerteam hat ein spannendes Experiment ausprobiert. Wir arbeiten im Scrum und organisieren uns hauptsächlich mit GitHub. In diesem Artikel beschreibe ich wie wir GitHub dafür benutzen.

Auch wenn ich schon seit ungefähr 5 Jahren Erfahrung mit Scrum habe als Entwickler gebe ich hier einen kleinen Disclaimer. Ich habe nie eine Scrum Zertifizierung gemacht. Ich werde also wahrscheinlich Begriffe falsch wiedergeben oder einordnen. Ich würde dann gerne dich bitte mich zu korrigieren.

Auch arbeitet unser Team erst seit gut einem Monat zusammen im Scrum. Das Team ist mit 4 Leuten 3 Fullstack Entwicklern und 1 Product Owner relativ klein. Trotzdem denke ich, dass dieser Beitrag euch dabei helfen kann euren Arbeitsprozess in eurem Team zu verbessern.

Im nächsten Abschnitt erzähle ich mehr über GitHub und wie wir es nutzen um uns in Scrum zu organisieren.

# GitHub und Scrum

Mein [GitHub Account](https://github.com/mmuller88) is aktiv seit 2016. GitHub ist bei weitem meine liebste Git Provider Umgebung. Privat nutze ich GitHub sehr viel. Ich bin sehr froh, dass ich GitHub nun auch für die Arbeit verwenden kann. Unsere Hauptmotivation GitHub zur Organisation zu verwenden sind die geringen Kosten und die Tatsache, dass sich viele Entwickler bereits gut mit GitHub auskennen.

Im nächsten Abschnitt erkläre ich wie wir einige GitHub Funktionen zur bewältigung unserer Scrum Arbeitsweise verwenden.

## GitHub Issues als Tickets

Die Issues bei GitHub lassen sich perfekt nutzen als Tickets für Scrum. Über Labels ist es sogar möglich den Tickets eine Size zu geben. Sizen meint in dem Kontext, dass eine Zahl für die Komplexität des Tickets von den Entwicklern vergeben wird. Üblicherweise sind das die Fibonacci Zahlen 1 3 5 8 13 .

Auch können über Labels die Tickets ihrer jeweiligen Komponente zugewiesen werden. Komponente meint dabei eine Art Unterkategorie des Projektes wie z.B. "component: api" oder "component: app" .

## GitHub Projects als Scrum Boards

GitHub Projects eigenen sich hervorragend für die Scrum Boards. Wir haben 3 Projects für 3 Boards. Jedes Board repräsentiert dabei seinen eigenen Zeitbereich und Abstraktionsgrad.

### Aktuelle Sprint Board

Das wichtigste Board ist dabei natürlich das "Aktuelle Sprint Board" (siehe mittig im Titelbild). Wir machen einen zweiwöchigen Sprint und mit dem "Aktuelle Sprint Board" reflektieren wir die Arbeit bzw. die Tickets an denen wir aktuelle arbeiten und arbeiten wollen. Es besitzt drei Spalten ToDo, In Progress und Done.

Tickets aus dem Backlog Scrum Board, welches im nächsten Abschnitt vorgestellt wird, landen dann hier zuerst in der ToDo Spalte. Zu diesem Zeitpunkt sollten die Tickets verständlich und gesized sein. Am Ende jedes Sprints wird die Done Spalte geleert und die ToDo Spalte wieder aufgefüllt.

### Backlog Board
Das Backlog Board (siehe unten im Titelbild) ist Gedacht für Aufgaben in dem Zeitraum von 2 - 6 Wochen und umfasst alle Tickets die noch nicht im Aktuellen Sprint Board sind. Hier werden diese gesammelt und Stück für Stück verfeinert. Dafür existieren die vier Spalten von links nach rechts Backlog, Ready for Sizing, Ready for Sprint und Next Sprint.

In jeder Spalte wird also das Ticket verfeinert z.B. wenn das Ticket von Backlog in Ready for Sizing gelangt muss es für alle Entwickler soweit verständlich sein, dass es gesized werden kann.

Wenn das Ticket in die Ready for Spring Spalte kommt, ist es nun soweit fertig um potentiell in den nächsten Sprint zu gelangen. In der Spalte Next Sprint einigen wir uns darauf welche Tickets wir im nächsten Sprint abfertigen wollen.

### Zukunft Board
Das Zukunft Board ist für Ideen / Aufgaben die noch relativ unklar sind und in einem Zeitabstand von ca 6 Wochen bis hin zu einem Jahr sind. Bisher nutzen wir dieses Board noch kaum und haben Ideen in einem separiertem [Miro](https://miro.com) Board.

# Zusammenfassung
Ich bin immer noch total geflashed wie gut es mit den Tools auf GitHub es klappt in Scrum zu arbeiten. Die UI von GitHub wirkt sehr ausgeklügelt und erlaubt eine tolle Scrum Experience. Probiert es einfach mal aus :) !

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>