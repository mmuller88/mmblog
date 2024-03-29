---
title: Prowler Landingpage mit Figma
show: 'no'
date: '2021-08-12'
# image: 'logo.png'
tags: ['de', '2021', 'github', 'prowler', 'aws', 'figma', 'security', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/prowler-ami-eng
pruneLength: 50
---
[![Prowler Video](https://img.youtube.com/vi/4JYaGylXEMc/0.jpg)](https://www.youtube.com/watch?v=4JYaGylXEMc)
(Click me :D)

Hi Leute!

Erst kürzlich habe ich meine neuestes AWS Security Product die [Prowler AMI](https://martinmueller.dev/prowler-ami) vorgestellt. Damit kannst du deine AWS Konfiguration auf Security, Best Practices, Cost Savings und mehr automatisiert überprüfen. Die AMI hat sogar schon einige Anwender gefunden, was mich sehr freut. Natürlich wäre es super wenn ich noch mehr Leute überzeugen könnte Prowler auszuprobieren. Zum anwerben neuer Anwender habe ich mir vorgenommen eine Landingpage für die Prowler AMI zu bauen.

Ich bezeichne mich zwar selbst als DevOps Fullstack Entwickler aber meine Stärken liegen klar im Backend Bereich. Für die Landingpage muss ich also aus meiner Komfortzone gehen. Aber kein Problem ich mag das :).

In den nächsten Abschnitten möchte ich meine Journey bei der Erstellung der Prowler Landingpage mit euch teilen. Doch zuerst beschreibe ich die Anforderungen der Landingpage

# Anforderungen Landingpage
Die Landingpage soll natürlich attraktiv auf die Prowler AMI aufmerksam machen. Dafür benötigt man ein Landingpage Gestaltungstool. Ich habe mich für [Figma](https://figma.com) entschieden. Genaueres habe ich im Figma Abschnitt beschrieben.

Danach soll der Prototyp von Figma in eine Website überführt werden. Diese soll dann natürlich mittels HTML, JavaScript und CSS die Landingpage anzeigen können.

Darüber hinaus will ich die Seite leicht für Suchengines wie die von Google erreichbar bzw. zugänglich machen. Das wird auch als SEO Search Engine Optimization bezeichnet.

# Figma
Figma ist ein vektorbasierender Grafikeditor und Prototyping Tool im Web. Es kann hervorragend benutzt werden um die Prowler Landingpage zu prototypen. Die Landingpage soll sich dynamisch je nach Gerät anpassen können. Das bedeutet Ich muss zwei verschiedene Layouts mit Figma gestalten. Ein Layout für einen Desktop PC und einem Mobilphone wie z.B. dem IPhone.

![Figma Prowler Landing](../prowler-landing/figma.png)

Zum erstellen meiner Landingpage habe ich einfach ein existierendes Landingpage Beispiel aus der [Figma Community](https://www.figma.com/community/search?model_type=hub_files&q=landing%20page) genommen und es nach meinen Vorstellungen angepasst.

Figma hat eine steile Lernkurve aber der übersichtliche Editor gefällt mir sehr gut. In zukünftigen Projekten werde ich gerne wieder mit Figma arbeiten.

# Website Setup mit Projen
Das Projekt Setup mache ich mit [Projen](https://github.com/projen/projen). Projen ist ein praktisches Tool zum Erstellen einer Landingpage welches mittels AWS CDK gehostet wird. Meine AWS CDK App besteht aus einem S3 Website bucket und einer AWS Codepipeline welches automatisch nach https://prowler-ami.com released wird.

# HTML und CSS
Jede gute Landingpage besteht natürlich aus HTML und CSS. Für das HTML Setup verwende ich einfach das von Projen bereitgestellte React TypeScript Projekt. Die React Erweiterung ansich brauche ich aber nicht und so interessiert mich nur der HTML und CSS Code im public Folder.

# Zusammenfassung
Eine Landingpage zu bauen war und ist eine spannende Herausforderung für mich. Ich habe viel gelernt während der Erstellung meiner ersten Landingpage. Ein riesen Dank geht an Jessica Chan für ihr Landingpage Video [How to Make a Landing Page using HTML, SCSS, and JavaScript - Full Course](https://www.youtube.com/watch?v=aoQ6S1a32j8). Es hat mir sehr geholfen meine Skills im Frontendbereich zu verbessen. Auch finde ich das SCSS Framework mega cool und eine geniale Ergänzung zu CSS. Wollt auch ihr eine Landingpage bauen? Wie war eure Erfahrung?

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>