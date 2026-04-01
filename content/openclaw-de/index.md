---
title: Wie ich OpenClaw als mein KI-gestütztes persönliches Betriebssystem nutze
show: "no"
date: "2026-03-31"
image: "index.png"
tags: ["de", "2026", "openclaw", "ai", "automation", "devops", "nofeed"]
engUrl: https://martinmueller.dev/openclaw-eng
pruneLength: 50
---

Ich betreibe [OpenClaw](https://openclaw.ai) seit etwa einem Monat auf einem Hostinger VPS, und es hat meine Arbeitsweise grundlegend verändert. Was als "lass mal dieses AI-Agent-Ding ausprobieren" begann, wurde zu einem leistungsstarken Assistenten, der mir jede Woche Stunden spart — von GitHub-Issue-Triage bis E-Mail-Management.

OpenClaw macht nicht alles für mich (noch nicht), aber es erledigt einen Großteil der repetitiven Arbeit, die früher meinen Tag aufgefressen hat. Hier ein tiefer Einblick in jeden Use Case, den ich bisher entdeckt habe.

## Was ist OpenClaw?

OpenClaw ist eine Open-Source-KI-Agent-Plattform, die auf der eigenen Infrastruktur läuft. Man verbindet sie mit Chat-Kanälen (Telegram, WhatsApp, Discord), gibt ihr Zugriff auf die eigenen Tools, und sie wird zu einem persistenten Assistenten, der sich Kontext über Sessions hinweg merkt. Wie ein selbst gehosteter KI-Mitarbeiter, der nie schläft.

Mein Setup: Docker-Container auf einem Hostinger VPS, mit **Telegram als Hauptschnittstelle**. Die meisten Interaktionen — Sprachnachrichten, Text, Dateien — laufen über Telegram. Es fühlt sich an wie einem Kollegen zu schreiben, der nie offline geht.

## Use Case 1: Autonomes GitHub-Issue-Management

Das ist das Killer-Feature für mich. OpenClaw überwacht meine [HalloCasa](https://hallocasa.com)-Repositories alle 2 Stunden per Heartbeat. Wenn ein neues Issue erscheint:

1. **Benachrichtigt mich** auf Telegram
2. **Generiert einen detaillierten Implementierungsplan** mit Cursor CLI und Claude Opus für die Planung
3. **Postet den Plan als Kommentar** im GitHub Issue
4. **Wartet auf mein OK** vor der Implementierung
5. **Implementiert den Fix** mit Cursor CLI und Composer
6. **Erstellt Branch, Commit, Push und Pull Request**

In der ersten Woche allein hat es Fixes für Währungsanzeige-Bugs, Locale-Änderungen, Telefonnummern-Validierung und Filter-Cleanup geplant und implementiert — alles mit minimalem Eingriff von mir.

Der Workflow folgt dem "Factory"-Pattern, das ich auf der Agentic Conf Hamburg gehört habe: Nicht einfach KI nutzen um Features zu bauen — sondern eine Produktionslinie bauen, die Features für dich baut.

## Use Case 2: E-Mail-Management

OpenClaw liest und sendet E-Mails über Himalaya CLI (IMAP/SMTP). Ich sage einfach per Telegram was zu tun ist:

- **"Sag der Sportgruppenleiterin, dass wir heute nicht kommen können"** → Kontakte durchsucht, Match gefunden, höfliche Absage gesendet.
- **"Schreib meinem Steuerberater, dass ich umbuchen muss"** → Kanzlei in Kontakten gefunden, professionelle E-Mail gesendet.
- **"Antworte dem Kindergarten wegen einem Besuchstermin"** → Bestehenden E-Mail-Thread kontextbewusst fortgesetzt.

Es sendet HTML-E-Mails mit professioneller Signatur und beherrscht Deutsch und Englisch.

## Use Case 3: Morgen-Briefing (Cron Job)

Jeden Morgen um 7:00 Uhr (Europe/Berlin) führt OpenClaw einen automatisierten Check durch:

- Scannt ungelesene E-Mails der letzten 24 Stunden
- Prüft gestrige E-Mails auf ausstehende Follow-ups
- Gleicht mit meinem Google Kalender für heute und morgen ab
- Sendet mir eine knappe Zusammenfassung auf Telegram

Das läuft auf Claude Haiku (günstig) und kostet fast nichts. Ich wache mit einem Briefing auf, statt drei verschiedene Apps manuell zu checken.

## Use Case 4: Kalender-Management

OpenClaw hat vollen Zugriff auf meinen Google Kalender via OAuth. Beispiele:

- **Konferenz-Zeitplan**: Ich habe ein PDF des Agentic Conf Hamburg Programms geschickt, mit rot markierten Sessions. Es hat das Bild extrahiert, die markierten Sessions per Vision-KI identifiziert, Details von der Konferenz-Website geholt und 9 Kalendereinträge mit Beschreibungen, Speaker-Infos und Links erstellt.
- **Meetings erstellen**: "Erstell ein Meeting mit Phillip Pahl für heute 18:00 CET" → Erledigt.

## Use Case 5: Kontaktsuche

Verbunden mit meinen iCloud-Kontakten via CardDAV durchsucht OpenClaw nach Name, Organisation oder Kontext. Wenn ich sage "schreib der Sportgruppenleiterin", findet es den Match und nutzt die richtige E-Mail. Kein manuelles Nachschlagen nötig.

## Use Case 6: LinkedIn-Post-Entwürfe

Ich habe es genutzt um LinkedIn-Posts zu entwerfen für:

- **AWS Community Day Athens 2026**: Alle Speaker von der Konferenz-Website nachgeschlagen, alphabetisch zusammengestellt, professionellen Ankündigungs-Post erstellt.
- **Agentic Conf Hamburg Recap**: Hintergründe der Organisatoren recherchiert, LinkedIn-Profile gefunden, spezifische Talks referenziert und meine persönlichen Highlights zum "Factory"-Konzept eingewoben.

Es macht die Recherche, ich gebe den persönlichen Touch.

## Use Case 7: Recherche & Due Diligence

Fragen, die normalerweise 15 Minuten Googeln kosten:

- **"Gibt es eine App für biometrische Passfotos mit QR-Codes?"** → Vergleich verfügbarer Apps, inklusive aktueller Gesetzesänderungen.
- **"Morgen ist eine Konferenz in meiner Nähe, was ist das?"** → Event gefunden, komplettes Programm, Speaker, Veranstaltungsort und Anmeldelink.

## Use Case 8: Dokumentenerstellung

- **Geburtstagseinladung**: Thematische HTML-Einladungskarte mit eingebetteten Bildern und QR-Code generiert, als teilbaren Link veröffentlicht.
- **Bewerbungsformular**: Zweisprachiges Bewerbungsformular gebaut, auf GitHub Pages deployed — funktioniert wenn man es per WhatsApp teilt.
- **Kita-Anmeldungen**: PDF-Anmeldeformulare aus Templates generiert.
- **E-Mail-Signaturen**: HTML-Signaturen in Gmail (via API) und Apple Mail eingerichtet.

## Use Case 9: Workspace- & Config-Management

OpenClaw verwaltet seine eigene Konfiguration:

- Versioniert seine Workspace-Dateien in einem Git-Repo
- Passt Heartbeat-Intervalle und Model-Einstellungen auf Anfrage an
- Pflegt tägliche Memory-Notizen und Langzeit-Memory-Dateien für Kontext-Kontinuität

## Use Case 10: Globales Gehirn via PeachBase

OpenClaw ist mit [PeachBase](https://aws.amazon.com/marketplace/pp/prodview-mmaafgzgntjhk) verbunden — einer serverlosen Vektordatenbank, die als mein persistentes Gedächtnis über alle KI-Agenten hinweg fungiert. Via MCP kann OpenClaw Wissen speichern und abrufen: persönliche Infos, Projektentscheidungen, Kontakte, Learnings.

Wenn ich OpenClaw etwas Merkenswertes sage, speichert es das in PeachBase. Wenn ich Wochen später eine Frage stelle — selbst von einem anderen Agenten wie Cursor — ist das Wissen da. Es ist das geteilte Gehirn, das alles zusammenhält.

Ich habe einen eigenen Post dazu geschrieben: [My Global Brain with PeachBase](/peachbase-global-brain).

## Use Case 11: Multi-Channel-Kommunikation

Ich spreche mit OpenClaw primär über Telegram, aber es kann auch:

- E-Mails in meinem Namen senden (Himalaya/SMTP)
- Ist mit WhatsApp verbunden
- Kann Cron-Job-Ergebnisse an bestimmte Telegram-Chats liefern

## Use Case 12: Diesen Blog-Post schreiben

Meta-Moment: Dieser Blog-Post wurde von OpenClaw entworfen. Ich habe eine Sprachnachricht auf Telegram geschickt (auf Deutsch): "Ich will über OpenClaw schreiben und wie ich es nutze — geh durch deine ganze History und finde die Use Cases, auf Englisch bitte."

Es hat 23 Tage tägliche Memory-Notizen gescannt, jeden Use Case extrahiert, das Blog-Repo-Format recherchiert und einen vollständigen Entwurf im richtigen Gatsby-Frontmatter-Format produziert — alles in einem Durchgang. Ich habe nur reviewed und getweaked.

Das ist die "Factory"-Idee in Aktion: Ich habe keinen Blog-Post geschrieben. Ich habe meinem Agenten gesagt, er soll einen schreiben, und er hatte den ganzen Kontext, den er brauchte, weil er bei jedem Use Case *dabei war*.

## Security: Ein Spektrum

Einem KI-Agenten Zugriff auf E-Mail, Kontakte, Kalender und GitHub zu geben ist mächtig — aber es ist auch ein Security-Gespräch, das man mit sich selbst führen muss.

OpenClaw behandelt Security als Spektrum, nicht als Binär. Man kann breit offen starten für maximale Convenience und dann schrittweise absichern. Hier ist was verfügbar ist und was ich nutze:

### Sandboxing

OpenClaw unterstützt **Docker-basiertes Sandboxing**, wobei Tool-Ausführung (Shell-Befehle, Datei-Lese/Schreibzugriffe) in einem isolierten Container statt direkt auf dem Host läuft. Man kann wählen:

- `"off"` — alles läuft auf dem Host (mein aktuelles Setup, maximale Convenience)
- `"non-main"` — nur Nicht-Haupt-Sessions (Gruppen-Chats, Webhooks) werden gesandboxt
- `"all"` — jede Session läuft gesandboxt

Ich bin noch auf `"off"`, weil ich der einzige User bin und der Agent-Boundary vertraue. Aber wenn man OpenClaw auf einer geteilten Maschine betreibt oder Gruppen-Chats aussetzt, ist Sandboxing ein Muss.

### Tool Policy

Man kann spezifische Tools per Agent auf eine Allowlist oder Denylist setzen. Zum Beispiel `exec` (Shell-Zugriff) komplett deaktivieren und nur `read`/`write` erlauben — oder einschränken welche Befehle laufen dürfen. OpenClaw hat auch ein **Elevated-Exec-Modell** (wie `sudo`), bei dem gefährliche Befehle explizite Genehmigung brauchen.

### Secrets

Eine Sache die ich anders machen würde: Mein frühes Setup hatte API-Keys in Config-Dateien. OpenClaw unterstützt stattdessen Umgebungsvariablen und Secret Refs. Credentials raus aus Plaintext-Config.

### Die Human-in-the-Loop-Regel

Meine wichtigste Sicherheitsmaßnahme ist nicht technisch — es ist eine Regel in der Agent-Config: **Immer fragen bevor E-Mails gesendet werden.** Nach einem Vorfall, bei dem der Agent eine E-Mail ohne mein OK gesendet hat, habe ich eine harte Regel hinzugefügt. Der Agent zeigt mir jetzt einen Entwurf und wartet auf "OK" vor jeder ausgehenden Kommunikation. Das gilt für alles was "die Maschine verlässt" — E-Mails, Social-Media-Posts, Webhooks.

### Netzwerk

Der Gateway-Port (18789) sollte nie öffentlich sein. Meiner ist localhost-only in Docker. Für Remote-Zugriff nutzt man Tailscale oder einen authentifizierten Reverse Proxy mit TLS.

### Meine Einschätzung

Security bei KI-Agenten ist echtes Neuland. Das Threat Model unterscheidet sich von traditionellen Apps, weil der Agent durch externen Content beeinflusst werden kann (Prompt Injection via E-Mails, Webseiten). OpenClaw hat Tools um den Blast Radius zu begrenzen — Sandboxing, Tool Policies, Approval Gates — aber das Wichtigste ist, bewusst zu entscheiden was man freigibt und schrittweise zu erweitern.

## Die Zahlen

Nach einem Monat Nutzung, hier was mich überrascht hat:

- **Kostenoptimierung zählt**: Auf Claude Opus 4.6 laufen verbrennt API-Credits schnell. Heartbeats auf Haiku umstellen und Intervalle von 30min auf 2h reduzieren hat einen riesigen Unterschied gemacht.
- **Memory ist alles**: Das System aus täglichen Notizen + MEMORY.md bedeutet, dass ich nie Kontext neu erklären muss. Es kennt meine Projekte, Kontakte, Präferenzen.
- **HTML-E-Mail war schwieriger als erwartet**: Himalaya dazu zu bringen, ordentliche HTML-E-Mails mit MML-Syntax zu senden, brauchte etwas Trial and Error. Plaintext-Signaturen haben keine klickbaren Links.

## Was kommt als Nächstes

- **Blog-Post-Automatisierung**: OpenClaw nutzen um Posts zu entwerfen und zu veröffentlichen (wie diesen hier!)
- **Tiefere GitHub-Integration**: Genehmigte Pläne automatisch implementieren ohne manuellen Trigger
- **Mehr Cron Jobs**: Wetter-Briefings, Social-Media-Monitoring, Kalender-Erinnerungen

## Fazit

OpenClaw ist nicht nur ein Chatbot. Es ist ein persönliches Betriebssystem, das zufällig von KI angetrieben wird. Die Kombination aus persistentem Memory, Tool-Zugriff (E-Mail, Kalender, Kontakte, GitHub, Dateisystem) und Multi-Channel-Kommunikation macht es wirklich nützlich — nicht auf eine "coole Demo"-Art, sondern auf eine "ich habe heute 2 Stunden gespart"-Art.

Wenn du ein Entwickler bist, der mit Docker und CLI-Tools klarkommt, kann ich es nur empfehlen. Die Lernkurve lohnt sich.

---

Links:
- [OpenClaw](https://openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [OpenClaw Discord](https://discord.com/invite/clawd)

Danke fürs Lesen! Bei Fragen zu meinem Setup, einfach melden.
