---
title: Programmatisch AWS Accounts erstellen und löschen
show: "no"
date: "2022-05-10"
image: "title.png"
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

Ich habe eine kleine Helferbibliothek in [GitHub](https://github.com/mmuller88/aws-accounts) erstellt um das programmatische Erstellen und Löschen von AWS Accounts zu vereinfachen. Ein AWS SDK Script ließe sich dann so ganz leicht bauen wie zum Beispiel:

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

## Ausblick

- Wäre cool die Scripts mit einer Pipeline z.B. AWS CodePipeline oder BitBucket Pipeline oder GitHub Actions zu verbinden um automatisch neue Accounts anzulegen

## Zusammenfassung

In diesem Blog Post habe ich erklärt warum es manchmal erforderlich ist neue AWS Accounts zu erstellen und wie dies gemacht werden kann mit AWS Organizations und dem JavaScript SDK. Dafür habe ich ein createSandbox und ein deleteSandbox Script erstellt und hier vorgestellt. Fandet ihr den Beitrag hilfreich oder habt ihr Verbesserungsvorschläge? Lasses es mich wissen und schreibt mir :).

Wenn du auch noch nach einer coolen AWS Community suchst kann ich dir wärmsten unsere [AWS CDK Slack Community](https://join.slack.com/t/cdk-dev/shared_invite/zt-xtpfmrqt-6ormYTA0hLdpMSAtTkM_2A) ans Herz legen. Auch sehr toll ist unsere [DACH AWS Community](https://join.slack.com/t/awscommunityde/shared_invite/zt-11ptmeylu-zpdZBIWmlbF9NNI3hY0Upw).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88) . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
