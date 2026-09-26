---
title: "OpenClaw Sicherheit: Keys, Postfach und Shell auf dem VPS"
description: "OpenClaw selbst hosten: API-Keys, Postfach und Shell auf dem VPS. Was ich begrenzt habe, und was DSGVO hier heißt."
show: "yes"
date: "2026-09-26"
tags: ["de", "2026", "openclaw", "security", "dsgvo", "vps"]
pruneLength: 50
faq:
  - q: "Was ist OpenClaw und wie hostet man es sicher?"
    a: "OpenClaw ist eine Open-Source-KI-Agent-Plattform auf eigener Infrastruktur. Sicher hosten heißt, Keys aus der Config zu nehmen, ausgehende Mail nur nach explizitem OK zu erlauben und die Shell nicht offen auf dem Host laufen zu lassen. Der Gateway-Port 18789 bleibt localhost-only."
  - q: "OpenClaw Sicherheit und DSGVO"
    a: "Ich meine damit Selbsthosting: Postfach, Kalender und Repos liegen auf einem VPS, den ich administriere, nicht in einem Agent-Produkt einer fremden Cloud. Das ist keine Rechtsberatung und kein Zertifikat."
---

OpenClaw ist eine Open-Source-KI-Agent-Plattform, die auf der eigenen Infrastruktur läuft. Sicher hosten heißt bei mir nicht, den Head-Term „OpenClaw“ zu erklären. Es heißt, drei Zugriffe zu begrenzen, die der Agent sonst hat: API-Keys, das Postfach und eine Shell auf dem VPS. Ich bin [Martin Mueller](https://martinmueller.dev). Mein Agent läuft als Docker-Container auf einem Hostinger-VPS, Telegram ist die Schnittstelle. Die längere Erzählung steht in [OpenClaw als persönliches Betriebssystem](/openclaw-de/) und [drei Monate später](/openclaw-three-months-later-de/).

DSGVO heißt hier: Postfach, Kalender und Repos liegen auf einer Maschine, die ich administriere. Nicht in einem Agent-Produkt, dessen Cloud ich nicht sehe. Das ist kein Rechtsrat und keine Zertifizierung.

Wer das Gateway selbst aufsetzen will: **[OpenClaw: Personal AI OS](/trainings-de/openclaw-personal-ai-os/)**. Wer einen Prototyp in eine benannte Produktionsumgebung bringen will: **[Vibe Coding in Produktion](/one-man-agency-de/vibe-coding/)**.

## Keys

Mein frühes Setup hatte API-Keys in Config-Dateien. OpenClaw kann Credentials stattdessen aus Umgebungsvariablen und Secret Refs lesen. Die Keys gehören aus der Plaintext-Config.

## Postfach

Der Agent hat einmal eine E-Mail ohne mein OK verschickt. Danach steht in der Agent-Config eine harte Regel: immer fragen, bevor eine E-Mail rausgeht. Er zeigt einen Entwurf und wartet auf „OK“. Dieselbe Regel gilt für alles, was die Maschine verlässt — E-Mails, Social-Media-Posts, Webhooks.

E-Mails und Webseiten können den Agenten über Prompt Injection beeinflussen. Das ist ein anderes Threat Model als bei einer normalen App. Deshalb ist die Freigabe vor dem Versand die Maßnahme, die ich wirklich nutze, nicht nur eine Option in der Doku.

## Shell auf dem VPS

OpenClaw kann Tool-Ausführung (Shell, Dateien lesen und schreiben) in einem Docker-Container sandboxen, statt direkt auf dem Host. Drei Stufen:

- `"off"` — alles läuft auf dem Host. Das ist mein aktuelles Setup. Ich bin der einzige User und vertraue der Agent-Grenze. Maximale Convenience, größerer Blast Radius.
- `"non-main"` — nur Neben-Sessions (Gruppen-Chats, Webhooks) laufen in der Sandbox.
- `"all"` — jede Session läuft in der Sandbox.

Auf einer geteilten Maschine oder mit Gruppen-Chats ist Sandboxing nötig. Zusätzlich lassen sich Tools pro Agent auf eine Allowlist oder Denylist setzen. `exec` (Shell) kann ganz aus, sodass nur `read` und `write` bleiben, oder einzelne Befehle sind eingeschränkt. Gefährliche Befehle laufen über ein Elevated-Exec-Modell, analog zu `sudo`, und brauchen eine explizite Genehmigung.

## Gateway nicht ins Netz

Der Gateway-Port 18789 darf nicht öffentlich sein. Meiner ist in Docker nur auf localhost gebunden. Remote-Zugriff geht über Tailscale oder einen authentifizierten Reverse Proxy mit TLS.

## Was ich nicht behaupte

Ich habe die Sandbox nicht auf `"all"` gestellt. Die Shell läuft bei mir noch auf dem Host, weil ich allein auf der Maschine bin. Die Keys lagen am Anfang in der Config. Der Schritt weg davon ist Umgebungsvariablen und Secret Refs, nicht ein zusätzliches Produkt. Und „DSGVO“ auf dieser Seite ist die Entscheidung, den Agenten selbst zu hosten — nicht ein Gutachten.

Das Setup und die Use Cases: [OpenClaw als persönliches Betriebssystem](/openclaw-de/). Was nach drei Monaten übrig blieb: [OpenClaw drei Monate später](/openclaw-three-months-later-de/).

**[OpenClaw: Personal AI OS](/trainings-de/openclaw-personal-ai-os/)** — zweitägiges Team-Training, jede Person auf einem eigenen VPS. **[Vibe Coding in Produktion](/one-man-agency-de/vibe-coding/)** — Security, Deploy, EU-Hosting, wenn der Prototyp live muss.
