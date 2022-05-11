---
title: Programmatisch AWS Accounts erstellen und löschen
show: "no"
date: "2022-05-11"
# image: "title.png"
tags: ["de", "2022", "aws", "sdk", "organizations"] #nofeed
engUrl: https://martinmueller.dev/sdk-org-eng
pruneLength: 50
---

Hi.

In AWS ist es best practice neue Accounts zu erstellen wenn zum Beispiel unterschiedliche Stages wie dev, qa und prod für seine Lösung bereitstellen möchte. Auch ist es üblich sogenannte Sandbox AWS Accounts zu erstellen um diese neuen Mitarbeiter zum Testen von AWS Services bereitzustellen. Es gibt noch viele weitere Gründe warum neue AWS Accounts erstellt werden sollten.

Nun das Erstellen solcher AWS Accounts kann recht aufwendig sein, wenn es manuell gemacht werden muss. Mit AWS Organizations, dem AWS [JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html) und ein wenig TypeScript Kenntnissen kann der Prozess zum Großteil automatisiert werden. In diesem Post stelle ich vor wie das funktioniert. Dafür erkläre ich zuerst was AWS Organizations überhaupt ist und dann stelle ich die zwei TypeScript Scripte die mittels AWS SDK die AWS Sandbox accounts Erstellen und Löschen können.

## AWS Organizations

AWS Organizations hilft dabei die AWS Accounts zu verwalten. In sogenannten Organizational Unites (OU) können Accounts zu Gruppen zusammengefasst werden. Darüber hinaus können Security Mechanismen wie Policies Account übergreifend definiert werden. AWS Organizations bietet noch viel viel mehr Funktionalität und ich möchte an dieser Stelle auf die öffentlich Dokumentation hinweisen. Interessant für diesen Beitrag ist, dass es für die AWS Organizations API auch ein [JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html) wrapper gibt den wir in den nächsten Abschnitten benutzen werden um dynamisch Accounts zu erstellen und zu löschen.

## createAccount and deleteAccount

Ich habe eine kleine Helfer-Bibliothek in [GitHub](https://github.com/mmuller88/aws-accounts) erstellt um das programmatische Erstellen und Löschen von AWS Accounts zu vereinfachen. Ein AWS SDK Script ließe sich dann so ganz leicht bauen wie zum Beispiel:

```ts
import {
 createAccount,
 moveAccountToOU,
 getAccountIdFromName,
} from "aws-accounts"

export async function main(): Promise<void> {
 var args = process.argv.slice(2)

 if (args.length !== 1) {
  usage()
  throw new Error("Wrong number of arguments")
 }

 const accountName = args[0]

 const response = await createAccount(accountName)
 const accountId = await getAccountIdFromName(accountName)
 if (accountId) {
  await moveAccountToOU(accountId, "ou-zblx-w7yw0qge")
 }
}
```

Der Code ist auch im Repo [hier](https://github.com/mmuller88/aws-accounts/blob/main/test/createAccountScript.ts) zu sehen.

Die Bibliothek is ein leichter Wrapper um AWS SDK TypeScript v.2 . Mit `await createAccount(accountName)` wird zuerst der Account erstellt. Anschließend mit `await getAccountIdFromName(accountName)` und `await moveAccountToOU(accountId)` wird der Account in die definierte OU (Organizational Unit) verschoben.

## Zusammenfassung

In diesem Blog Post habe ich erklärt warum es manchmal erforderlich ist neue AWS Accounts zu erstellen und wie dies gemacht werden kann mit AWS Organizations und dem JavaScript SDK. Dafür habe ich ein createAccount und ein deleteAccount Script erstellt und hier vorgestellt. Fandet ihr den Beitrag hilfreich oder habt ihr Verbesserungsvorschläge? Lasses es mich wissen und schreibt mir :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
