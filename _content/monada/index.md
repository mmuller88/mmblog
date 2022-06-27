---
title: Monada - Cloud neu erfinden
show: "no"
date: "2022-06-24"
image: "logo.jpg"
tags: ["de", "2022", "monada", "nofeed"] #nofeed
engUrl: https://martinmueller.dev/monada-eng
pruneLength: 50 #du
---

Im Juni 2022 bin ich dem jungen Cloud Startup [Monada](https://www.linkedin.com/company/monadahq/about/) beigetreten. Monada hat es sich zum Ziel gesetzt das Entwickeln in der Cloud zu vereinfachen.

## Welche Probleme will Monada lösen?

Die Probleme die Monada lösen möchte befinden sich auf Entwickler und Organizations Ebene.

### Entwickler Ebene

Die Entwickler Ebene adressiert primär Probleme an uns Cloud Entwicklern.

**Lange Iterationen**. Die Dauer der Entwicklungs Iterationen in der Cloud is immer noch zu hoch! Auch wenn sich diese in den letzten Jahren bereits verringert hat durch Tools wie Serverless und CDK (CDK TAGS) glauben wir Monadians, dass diese immer noch zu hoch ist!

**Steile Lernkurve**. Das meistern von Cloud Tools wie zum Beispiel CloudFormation, Terraform oder CDK dauert viele Monate. Das ist viel zu lange und wir wollen diese Zeit auf wenige Tage reduzieren!

**Schwierig zu Debuggen**. Das Debuggen von Cloudanwendungen ist zu umständlich! Oftmals müssen dafür verschiedene System involviert werden. Zum wenn ich eine Lambda bei AWS debuggen möchte muss ich mich dafür erst umständlich in die AWS Console einloggen um dann aufwendig nach den richtigen Logs in Cloudwatch zu suchen. Wir werden das vereinfachen!

**Komplizierte Unit Tests**. Die Implementierung von Unit Tests in der Cloud ist meistens nicht einfach. Es müssen zum Beispiel aufwendige Mocking-Libraries verwendet werden um gewisse Teilaspekte in der Cloud zu mocken. Wir glauben das geht einfacher!

**Hohe Entwicklungskosten**. Durch die Komplexität in der Cloud entstehen hohe Kosten da viele Cloud Experten bezahlt werden müssen um genau diese hohe Komplexität zu bewältigen. Wie bie Monada glauben, dass durch unsere Lösungen die Cloud einfacher zugänglich wird und somit weniger Experten benötigt werden.

### Organizations Ebene

**Interne Plattformen**. Vor allem in grösseren Organisationen kann es nötig werde eigene internen Plattformen um zum Beispiel die Cloud Resourcen zu überwachen und verwalten. Das Erstellen solcher Plattformen erzeugt natürlich zusätzliche Kosten. Wir Monadians wollen das Entwickeln mit der Cloud soweit vereinfachen, dass solche zusätzlichen Plattformen nicht benötigt werden.

**Lock-In**. Es gibt schon sehr viele Ansätze um einen Lock-In bei einem spezifischen Cloud Provider zu vermeiden. Diese Ansätze sind aber unserer Meinung nach viel zu kompliziert und können mit neuen radikaleren Ansätzen abgelöst werden.

**Langsame Entwicklung**. Die hohe Komplexität in der Cloud erfordert längere Entwicklungszeiten. Somit steigen natürlich auch die Kosten. Wir bei Monada glauben, dass die Entwicklungszeit massiv verkürzt werden kann.

## Wie will Monada das schaffen?

Jetzt fragst du dich zurecht wie wir das schaffen wollen, schließlich existieren bereit Tonnen von Materialen zum Lernen über die Cloud. Nun wir alle bei Monada denken, dass die Cloud in ihrer jetzigen Form viel zu kompliziert ist. Die Cloud muss neu gedacht werden bzw. einfacher gemacht werden. Und genau daran arbeiten wir in Monada.

Leider kann ich noch nicht genauer werden mit unseren Lösungsansätzen da sich diese noch in der Entwicklung befinden. Soviel aber darf ich verraten. Wir benutzen RFCs zum designen der Ansätze und die die ich bisher gesehen habe und an denen ich selbst mitgearbeitet haben verschaffen mir eine Gänsehaut. Ich bin sehr dankbar, dass ich bei Monada und all den coolen Sachen die wir vorhaben mitmachen darf.

## Zusammenfassung

In diesem Post habe ich dir einen Einblick über meine spannenden Reise bei Monada gegeben. Ich habe erklärt welches Problem wir lösen möchten und wie wir das schaffen wollen. Natürlich ist dieses Vorhaben kein leichtes und wir brauchen deine Hilfe!

Möchtest du uns helfen die Cloud zu revolutionieren dann melde dich doch gerne bei mir. Oder verfolge weiterhin meinen Blog da viele meiner nächsten Posts über Monada sein werden.
