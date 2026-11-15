---
title: "Lokale KI im Unternehmen: selbst hosten, EU-API oder beides?"
description: "Lokale KI, EU-GPU oder EU-API: welche Daten wohin dürfen, was ein EU-Rechenzentrum nicht leistet, und was GPU-Miete gegen Token kostet."
show: "yes"
date: "2026-11-15"
image: "index.png"
tags: ["de", "2026", "ki", "llm", "dsgvo", "eu-hosting"]
audio: "audio.mp3"
pruneLength: 50
faq:
  - q: "Was ist lokale KI?"
    a: "Ein Sprachmodell auf Hardware, die das Unternehmen selbst administriert. Prompts und Dokumente bleiben auf dieser Maschine."
  - q: "Lokales Modell oder EU-API?"
    a: "Lokal, wenn die Daten das Unternehmen nicht verlassen dürfen. Eine EU-API, wenn sie das Unternehmen verlassen dürfen, aber in der EU bleiben müssen, und niemand eine GPU betreiben will."
  - q: "Macht ein EU-Rechenzentrum die Lösung DSGVO-konform?"
    a: "Nein. Eine EU-Region ist Datenresidenz. Vertrag, Unterauftragnehmer, Speicherdauer und Zugriff bleiben offen. Das ist keine Rechtsberatung."
  - q: "Was kostet lokale KI im Vergleich zu einer EU-API?"
    a: "Die GPU kostet einen Festpreis im Monat, auch ohne Anfragen. Die API kostet pro Token. Bei wenig Volumen ist die API billiger. Ob die GPU das gleiche Modell kann, ist eine zweite Frage."
---

Lokale KI heißt: das Sprachmodell läuft auf Hardware, die das Unternehmen selbst administriert. Eine EU-API heißt: ein Anbieter rechnet in der EU, die Daten verlassen aber das Unternehmen. Beides passt, für verschiedene Daten. „Der Server steht in Frankfurt“ reicht für keine der beiden Fragen.

Wer das als Auftrag will: [Lokale KI & EU-Modelle](/one-man-agency-de/local-ai/). Wer den Betrieb einer EU-Maschine üben will: [EU-Produktion auf Hetzner](/trainings-de/hetzner-eu-production/).

---

## Drei Wege, plus einer für den Rest

| Weg | Wo die Daten liegen | Wer betreibt | Wann |
| --- | --- | --- | --- |
| Lokal oder on-prem | Auf der Maschine des Unternehmens | Das Unternehmen | Die Daten dürfen das Haus nicht verlassen |
| Self-Hosting auf einer EU-GPU | In der EU, auf einer Maschine unter eigener Kontrolle | Das Unternehmen | Die Daten dürfen raus, nicht aus der EU, und ihr wollt den Betrieb |
| EU-gehostete Modell-API | Beim Anbieter, Inferenz in der EU | Der Anbieter | Die Daten dürfen raus, und niemand will eine GPU betreiben |
| Frontier-Modell hinter einem Gateway | Dürfen die EU verlassen | Der Anbieter | Nur für Daten, bei denen das erlaubt ist |

Das Gateway ist die Stelle für Anmeldung, Routing, Rate-Limits und die Entscheidung, Prompts nicht zu speichern. Es ist kein Rechtskonstrukt. Es ist eine Tür mit einer Regel.

---

## Welche Frage zuerst

Zuerst die Daten, dann das Modell.

1. Dürfen diese Daten das Unternehmen verlassen? Nein: lokal oder on-prem. Die anderen Wege fallen weg.
2. Dürfen sie die EU verlassen? Nein, aber das Haus schon: Self-Hosting auf einer EU-GPU, oder eine EU-API.
3. Wollt ihr die Maschine selbst betreiben? Ja: GPU. Nein: API.
4. Ist der Anwendungsfall unkritisch, und das stärkste Modell zählt? Frontier-Modell, nur durch das Gateway, nur für diesen Anwendungsfall.

Ein Unternehmen hat fast immer mehr als eine Antwort. Kundendokumente lokal, der öffentliche Hilfetext über die API, Marketing-Entwürfe über das Gateway. Eine pauschale „KI-Strategie“ für alle Daten ist der Fehler.

---

## Eine EU-Region ist keine DSGVO-Antwort

Eine Region sagt, wo eine Maschine steht. Sie sagt nicht, wer Zugriff hat, wer Unterauftragnehmer ist, wie lange Prompts liegen und welcher Vertrag das deckt. Das ist Vertrags- und Rechtsarbeit. Dieser Text ist die technische Seite, keine Rechtsberatung.

Drei Stellen, an denen „EU“ enger ist, als die Werbung klingt. Stand der verlinkten Seiten: 15. November 2026.

**Mistral.** Der globale Endpunkt `api.mistral.ai` verpflichtet sich nicht auf einen Ort. Der EU-Endpunkt `api.eu.mistral.ai` verarbeitet die Inferenz in Rechenzentren in EU- und EFTA-Staaten und kostet das 1,1-Fache des Listenpreises. Agents, Batch und die Files-API gibt es dort nicht, nur Function Calling. Kontodaten, API-Keys, Abrechnung und Nutzungsstatistik können außerhalb dieser Region liegen. Regional inference und „nichts speichern“ sind zwei getrennte Schalter. Quelle: [Regional inference](https://docs.mistral.ai/inference/regional-inference).

**Amazon Bedrock.** Ein EU-Geo-Profil hält die Inferenz in der EU, nicht zwingend in Frankfurt. In der Modellkarte von Claude Haiku 5.5 kann eine Anfrage aus Frankfurt auch in Stockholm, Mailand, Spanien, Irland oder Paris landen. Das ist ein Beispiel, keine Aussage über jedes Modell. Quelle: [Claude Haiku 5.5, Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-haiku-5-5.html).

**AWS European Sovereign Cloud.** Wer Isolation der Partition und EU-Betrieb braucht und nicht nur ein Rechenzentrum in Frankfurt, landet bei einer anderen Frage. Die steht in [Sovereign Cloud on AWS](/aws-esc-de/). Der US CLOUD Act gehört dorthin, nicht in einen Satz auf einer Preisseite.

**Hetzner.** Hier betreibt ihr die Maschine. Damit liegt die Verantwortung für Zugriff, Platte und Logs bei euch, nicht bei einem Modell-Anbieter. Hetzner schreibt auf der GPU-Seite „GDPR-compliant“. Das ist deren Satz, kein Gutachten.

---

## Welche Hardware

Die Gewichte müssen in den GPU-Speicher passen, plus Kontext. Faustregel, keine Messung: FP16 braucht etwa 2 Bytes pro Parameter, 4-bit etwa 0,5 Bytes. Ein Modell mit 8 Milliarden Parametern liegt in 4-bit bei rund 4 GB, eines mit 70 Milliarden bei rund 35 GB. 35 GB passen nicht auf eine 24-GB-Karte. Der Kontext kommt obendrauf und hängt von der Länge ab.

Öffentliche Preise, gelesen am 15. November 2026 auf [Hetzner GPU-Server](https://www.hetzner.com/dedicated-rootserver/matrix-gpu/), jeweils zzgl. MwSt.:

| Server | GPU | Ort | Monat | Setup, einmalig |
| --- | --- | --- | --- | --- |
| GEX45 | RTX PRO 4000 Blackwell, 24 GB | nur Helsinki | € 214 | € 209 |
| GEX131 | RTX PRO 6000 Blackwell Max-Q, 96 GB | Falkenstein oder Helsinki | ab € 1.499 | € 1.499 |

Helsinki ist EU, nicht Deutschland. Wer die Maschine in Deutschland braucht, nimmt nicht den kleinen Server. Der GEX45 ist die Inferenz-Klasse. Ob ein bestimmtes Modell darauf schnell genug ist, prüft man an den echten Aufgaben, nicht an der Tabelle.

vLLM und Ollama sprechen beide eine OpenAI-kompatible HTTP-API. Die Anwendung muss nicht wissen, welche Karte antwortet.

---

## Token oder Monatsmiete

Die API kostet pro Token. Die GPU kostet den Monat, auch wenn niemand fragt.

Listenpreise von [Mistral, API pricing](https://docs.mistral.ai/inference/pricing), Standard, US-Dollar pro Million Tokens, gleiche Lesung:

| Modell | Input | Output |
| --- | --- | --- |
| Ministral 3 8B | $ 0,15 | $ 0,15 |
| Mistral Small 4 | $ 0,15 | $ 0,60 |
| Mistral Large 4 | $ 0,70 | $ 2,10 |

Der EU-Endpunkt multipliziert das mit 1,1. Zehn Millionen Input-Tokens und zwei Millionen Output-Tokens kosten dann überschlägig $ 1,98 (Ministral 3 8B), $ 2,97 (Small 4) oder $ 12,32 (Large 4). Der kleinste GPU-Server kostet € 214 im selben Monat, bevor das Setup dazukommt.

Das fünfzigfache Volumen — 500 Millionen Input, 100 Millionen Output — liegt bei Large 4 und EU-Endpunkt überschlägig bei $ 616. Erst dort überholt die reine Token-Rechnung die Monatsmiete des kleinen Servers, und auch nur, wenn die Karte dieses Modell tragen kann. Eine 24-GB-Karte trägt Mistral Large 4 nicht. Der Vergleich ist die Form der Rechnung, keine Messung von Durchsatz.

Die Datenfrage kippt früher als die Token-Rechnung. Wenn die Dokumente das Haus nicht verlassen dürfen, ist der API-Preis egal.

---

Nächster Schritt, wenn daraus ein Auftrag werden soll: [Lokale KI & EU-Modelle](/one-man-agency-de/local-ai/), Scope und Preis im Statement of Work. Wer die Maschine danach selbst fahren will: [EU-Produktion auf Hetzner](/trainings-de/hetzner-eu-production/).
