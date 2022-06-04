---
title: AWS CDK Diagramme mit cdk-dia <3
show: "no"
date: "2022-03-24"
image: "diagram.png"
tags: ["de", "2022", "cdk"] #nofeed
engUrl: https://martinmueller.dev/cdk-dia-eng
pruneLength: 50 #ihr
---

Hi.

AWS Komponenten Diagramme sind eine tolle Möglichkeit komplexe AWS Architekturen zu visualisieren. Für viele sind solche wesentlich intuitiver verständlich als z.B. CDK code. Ich selber arbeite sehr viel mit AWS Komponenten Diagrammen wenn ich neue AWS System entwickle. Was mich daran aber immer gestört hat ist, dass das Erstellen der Diagramme zeitaufwendig ist und diese regelmäßig angepasst werden müssen wenn sich die Architektur ändert.

Wenn es euch ähnlich geht probiert doch mal [cdk-dia](https://github.com/pistazie/cdk-dia) aus. In meinen letzten beiden CDK Projekten habe ich es verwendet und die Erfahrung war einfach überwältigend.

## Wie funktionierts?

Das Tool cdk-dia erlaubt es mir AWS Komponenten Diagramme automatisch aus meinem CDK code zu erzeugen. Es folgt sogar dabei den CDK Construct Level 1 und 2 Abstraktionen. Das bedeutet, dass z.B. die großen Komponenten Symbole Level 2 Constructs sind und nur die Hauptkomponente, die üblicherweise **Resource** als ID bekommt. Somit werden nur die wirklich wichtigen AWS Komponenten gerendert. Das wird auch als collapsing bezeichnet.

![collapsed](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-dia/decorator_example_collapsed.png)(collapsed diagram)

Möchtet ihr das collapsing verhindern, also auch wirklich alle unterliegenden Komponenten angezeigt bekommen, könnt ihr einen Decorater im Code definieren. Wie genau das funktioniert seht ihr [hier](https://github.com/pistazie/cdk-dia/tree/main/examples/experimental-decorator-example) .

![non-collapsed](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-dia/decorator_example_non-collapsed.png)(non-collapsed diagram)

Das habe ich z.B. bei meinem [private asset bucket Construct](https://github.com/mmuller88/cdk-private-asset-bucket/blob/main/src/private-asset-bucket.ts) benutzt:

```ts
...
@DiagramOptions({ collapse: CollapseTypes.FORCE_NON_COLLAPSE })
export class PrivateAssetBucket extends core.Construct {
...
```

Wenn ihr mehr über mein Prowler Construct wissen wollt schaut [hier](https://martinmueller.dev/cdk-private-assets).

## Vergleich mit AWS Console Cloudformation template

Die AWS Console selbst besitzt auch ein Diagram Tool zum visualisieren von CloudFormation Stacks mit Name AWS CloudFormation Designer. Nähere Informationen findet ihr [hier](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/working-with-templates-cfn-designer.html). Ich habe also den Designer mit cdk-dia verglichen und ich finde cdk-dia um einiges besser. cdk-dia schafft es durch das collapsing einen wesentlich besseren Abstraktionsgrad zu erlangen. Außerdem sind die Grafiken von cdk-dia wesentlich hübscher.

Im nachfolgenden Abschnitt erkläre ich euch wie ihr in eurem CDK Projekt cdk-dia einbauen könnt.

## cdk-dia script

Zum kontinuierlichen updaten der cdk-dia Diagramme würde es sich anbieten ein kleines Helferscript in der package.json zu schreiben. Doch vorher solltet ihr erstmal sichergehen dass cdk-dia im dev dependency scope mit `yarn add cdk-dia -D` installiert ist.

Erstellt dann noch einen Ordner mit Namen diagrams und fügt diese Script in die package.json.

```json
"scripts": {
    ...
    "dia": "yarn cdk synth && yarn cdk-dia && mv diagram.png diagrams/dashboard.png",
    ...
  },
```

Das Script synthethisiert erst die aktuellen CloudFormation Templates. cdk-dia braucht diese um überhaupt das Diagram erzeugen zu können. Dann wird mit `yarn cdk-dia` das Diagram erzeugt und anschließend in den diagrams Ordner verschoben.

`yarn cdk-dia` erzeugt auch immer eine diagram.dot File. Ich empfehle euch die folgenden zwei files in den .gitignore zu packen:

```txt
diagram.dot
diagram.png
```

Wenn ihr gerne das Diagram in einzelne Bilder aufteilen wollt, könnt ihr auch gezielt nur einzelne CDK Stacks rendern lassen z.B.

```json
"scripts": {
    ...
    "dia": "yarn cdk synth && yarn cdk-dia --stacks DashboardAppStack DashboardBackendStack && mv diagram.png diagrams/dashboard.png && yarn cdk-dia --stacks LandingPageStack && mv diagram.png diagrams/landingpage.png",
    ...
  },
```

Auch eine gute Idee ist es den cdk-dia command in den cdk synth Prozess zu integrieren. Das habe ich z.B. bei meinem [cdk Prowler Construct](https://github.com/mmuller88/cdk-prowler) mit eingebunden. In der package.json findet ihr das folgende Script:

```json
"scripts": {
    ...
    "synth": "yarn cdk synth && yarn cdk-dia && mv diagram.png diagrams/prowler.png",
    ...
  },
```

Nun wird bei jedem manuell ausgeführten cdk synth auch immer das cdk-dia diagram gerendert. Cool oder? Wenn ihr mehr über mein Prowler Construct wissen wollt schaut [hier](https://martinmueller.dev/prowler-cdk).

## Ideen

Im vorherigen Post habe ich ein kleines Script vorgestellt welches die cdk-dia Diagramme erzeugt. Dieses Script muss leider immer noch manuell ausgeführt werden. Es wäre mega cool wenn sich diese Diagramme quasi selbst updaten. Das sollte möglich sein wenn man Husky pre-commit hooks verwendet. Ich bin das gerade am ausprobieren. Wenn ihr mehr darüber wissen wollt, sagt mir Bescheid.

Leider konnte cdk-dia meine CDK CD Staging Pipeline nicht vernünftig rendern und ich musste diese per Hand in <https://draw.io> anlegen. Es wäre super cool wenn cdk-dia auch Pipelines abbilden könnte.

## Zusammenfassung

Wenn ihr auch gerne mit AWS Komponenten Diagrammen arbeitet probiert cdk-dia mal aus! Hier in dem Post habe ich beschrieben wie toll das Tool ist und wie einfach es geht. Schreibt mir gerne wenn ihr Fragen habt.

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
