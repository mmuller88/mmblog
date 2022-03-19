---
title: AWS CDK Diagramme mit cdk-dia <3
show: 'no'
date: '2022-03-26'
image: 'diagram.png'
tags: ['de', '2022', 'cdk', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/cdk-dia-eng
pruneLength: 50 #ihr
---

Hi.

AWS Komponenten Diagramme sind eine tolle Möglichkeit komplexe AWS Architekturen zu visualisieren. Für viele sind solche wesentlich intuitiver verständlich als z.B. CDK code. Ich selber arbeite sehr viel mit AWS Komponenten Diagrammen wenn ich neue AWS System entwickle. Was mich daran aber immer gestört hat ist, dass das Erstellen der Diagramme zeitaufwendig ist und diese regelmäßig angepasst werden müssen wenn sich die Architektur ändert.

Probiert doch mal [cdk-dia](https://github.com/pistazie/cdk-dia) aus. In meinen letzten beiden CDK Projekten habe ich es verwendet und die Erfahrung war einfach überwältigend.

## Wie funktionierts?

Das Tool cdk-dia erlaubt es mir AWS Komponenten Diagramme automatisch aus meinem CDK code zu erzeugen. Es folgt sogar dabei den CDK Construct Level 1 und 2 Abstraktionen. Das bedeutet, dass z.B. die großen Komponenten Symbole Level 2 Constructs sind und nur die Hauptkomponente, die üblicherweise **Resource** als ID bekommt. Somit werden nur die wirklich wichtigen AWS Komponenten gerendert. Das wird auch als collapsing bezeichnet.

![collapsed](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-dia/decorater_example_collapsed.png)

Möchtet ihr das collapsing verhindern, also auch wirklich alle unterliegenden Komponenten angezeigt bekommen, könnt ihr einen Decorater im Code benutzen. Wie genau das funktioniert wird sehr gut in der Dokumentation beschrieben https://github.com/pistazie/cdk-dia#example-1 . Ich selber habe ihn bisher noch nicht benötigt.

![non-collapsed](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-dia/decorater_example_non-collapsed.png)

## Vergleich mit AWS Console Cloudformation template

Die AWS Console selbst besitzt auch ein Diagram Tool zum visualisieren von CloudFormation Stacks mit Name AWS CloudFormation Designer. Nähere Informationen findet ihr [hier](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/working-with-templates-cfn-designer.html). Ich habe also den Designer mit cdk-dia verglichen und ich finde cdk-dia um einiges besser. Cdk-dia schafft es durch das collapsing einen wesentlich besseren Abstraktionsgrad zu erlangen. Außerdem sind die Grafiken von cdk-dia wesentlich hübscher.

## cdk-dia script

* script zum rendern der diagramme

## Ideen

* Leider konnte es meine CDK Staging Pipeline nicht rendern. wenn das möglich wäre, wäre das mega cool.

## Zusammenfassung

Wenn ihr auch gerne mit AWS Komponenten Diagrammen arbeitet probiert cdk-dia mal aus! Hier in dem Post habe ich beschrieben wie toll das Tool ist und wie einfach es geht. Schreibt mir gerne wenn ihr Fragen habt.

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
