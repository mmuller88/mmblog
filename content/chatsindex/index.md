---
title: Chat Indexieren mit Chatsindex.com
show: "no"
date: "2023-03-21"
image: "index.png"
tags: ["de", "2023", "seo", "chatsindex"]
engUrl: https://martinmueller.dev/chatsindex-eng
pruneLength: 50 #dein
---

Möchtest du deine Chat Community vergrößern? [Chatsindex.com](https://Chatsindex.com) indexiert Chat-Messages und macht diese auffindbar für Suchmaschinen wie Google. Zugegeben es wird das machen weil es zurzeit noch ein Prototype ist! Durch SEO (Search Engine Optimization) wird sichergestellt, dass die Einträge möglichst hoch in den Suchergebnissen erscheinen. So können neue User auf deinen Discord Server gelockt werden.

Nachfolgend siehst du ein Beispiel wie ein Discord Channel und die Suchergebnisse aussehen können:

![seo.gif](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/chatsindex/seo.gif)

Die Google Seite ist dabei nur gemocked ([Chatsindex.com/search](https://Chatsindex.com/search)) da es sich noch um einen Prototypen handelt.

## Wie funktioniert es?

Ein Discord Bot schreibt die Nachrichten in eine Datenbank. Die Datenbank wird dann von einem NextJS Server abgefragt und in eine Suchmaschinen optimierte Seite (SEO) gerendert. Die Seite wird dann von Google gecrawlt und die Einträge sind dann auffindbar.

Der Prototyp ist mit dem [T3 Stack](https://martinmueller.dev/t3-stack) erstellt. Der T3 Stack ist ein NextJS Stack mit TailwindCSS, tRPC und Prisma. Die Datenbank besteht zurzeit noch aus SQLite und wird mit tRPC und Prisma abgefragt. Die Seite wird mit NextJS und TailwindCSS gerendert.

## Probanden

Klingt diese Idee interessant für dich? Dann melde dich gerne bei mir [https://MartinMueller.dev](https://MartinMueller.dev). Ich suche Probanden mit Discord Servern um die Idee zu testen.

## Ausblick

Falls die Idee gut ankommt, möchte ich gerne andere private Chatsysteme wie WhatsApp Gruppen, Telegram Gruppen, Slack, etc. indexieren.

Eine weitere Idee von mir ist eine übergreifende Suche für private Chats wie Discord, WhatsApp Gruppen, Telegram Gruppen und Slack zu implementieren. Mit bestimmten Schlagwörtern oder Kategorien können dann private Chats mit bestimmten Themeninhalten gefunden werden. Zum Beispiel wenn ich mich für finanzielle Bildung interessiere, kann ich dann einfach in der Suche Finanzen eingeben und es werden mir Discord Server, WhatsApp/Telegram Gruppen usw. mit dem Themenschwerpunkt Finanzen vorgestellt. Wenn euch die Idee gefällt, wendet euch gerne an mich.

## Fazit

Die Kombination aus SEO und Discord Servern empfinde ich als eine spannende Idee. Jetzt geht es mir erstmal darum die Idee zu testen und zu schauen ob es überhaupt eine Nachfrage gibt. Falls du Interesse hast, melde dich gerne bei mir.

Den [T3 Stack](https://martinmueller.dev/t3-stack) zu verwenden hat viel Spaß gemacht und ich habe nur ein Wochenende benötigt für diesen Prototypen. Falls du Hilfe bei deiner Idee oder Projekten braucht, kontaktiere mich gerne.

Ich liebe es, an Open-Source-Projekten zu arbeiten. Viele Dinge kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88). Wenn du meine Arbeit dort und meine Blog-Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

Und schau doch mal auf meiner Seite vorbei

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)