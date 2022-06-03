---
title: Der Alfresco Provisioner
show: 'no'
description: Über die Closed Beta meines CDK Backends
date: '2020-05-19'
image: 'prov.png'
tags: ['de', '2020', 'acs', 'alfresco', 'docker', 'docker-compose', 'ec2', 'swagger', 'cdk']
engUrl: https://martinmueller.dev/alf-provisioner-eng
pruneLength: 50
---

Hi Alfrescans.

Hast du schonmal Alfresco auf einer AWS Ec2 Instanz installiert? Vielleicht sogar auch schon mit Docker Compose? Auch wenn Docker die Installation von Alfresco einfacher gemacht hat, ist es immer noch aufwending! Zuerst muss man eine Ec2 Instanz erstellen. Dafür muss man sich in AWS einloggen, einen Ec2 Typen auswählen und diesen starten. Dann dort drauf connecten, Docker installieren und dann muss noch eine Alfresco Docker Compose Installation durchführen. Wie toll wäre es wenn wir einfach einen Managed Service hätten welche das für uns macht? 

Gute Nachrichten! Genau das habe ich in den letzten Wochen implementiert. Es muss nun einfach nur noch der gewünschte Ec2 Typ und das gewünschte Alfresco Docker Compose Deployment auswählen und der Alfresco Provisioner übernimmt den Rest und installiert Alfresco für dich! Damit kann Jeder schnell und einfach Alfresco Backends für sich und seine Community erstellen. In den nächsten Abschnitten werde ich genauer von meiner Idee berichten sowie welche Technologien ich dafür verwendet habe.

# Zielgruppe
Für die Alfresco Produkte sehe ich auch einen klaren Bedarf bei den eher kleineren Gruppen. Ich habe sogar ein gutes Beispiel aus meiner näheren Umgebung. Ich bin Mitglied in einer Kirchgemeinde. Nun würde sich die Kirchgemeinde gerne modernisieren, auch hin in Richtung Digitalisierung. So werden zum Beispiel Videos von Gottesdiensten auf Youtube hochgeladen oder gemachte Bilder landen irgendwo in Dropbox. Auch werden Gemeinschaftsprojekte hauptsächlich nur auf Stift und Papier geplant, da die richtigen digitalen Werkzeuge einfach fehlen. Ich sehe die Alfresco Produkte in der Lage einer Gruppe wie meiner Kirchengemeinde damit zu helfen, effizienter digitalen Content zu verwalten. Mit großer Wahrscheinlichkeit kennst auch auch du Gruppierungen wie zum Beispiel Vereine in deiner Umgebung die von Alfresco profitieren könnten.

Auch könnte das schnelle bereitstellten von Alfresco Backends Communities bei der zwingend erforderlichen Digitalisierung wärend der Coronakrise helfen. Es sollte so gut es geht vermieden werden Dokumente in Echt von Person zu Person auszutauschen oder daran gemeinschaftlich von Angesicht zu Angesicht daran zu arbeiten. Gerne würde ich meinen Beitrag leisten bei der Pandemie zu helfen und vielleicht ist der Alfresco Provisioner ja eine Möglichkeit.

Herausfordernd wird dan natürlich die verursachten Kosten so gering wie möglich zu halten und die Kostenvorteile der Cloud so gut es geht an den Nutzer weiter zu leiten. Ein paar Ideen die ich diesbezüglich bereits habe sind die Verwendung von Reserved Instances, Spot Instances, S3 als Objektspeicher, Pay as you go für die Alfresco Instanzen und die Möglichkeit die eigenen Ec2 Instanzen nutzen zu können.

Eine andere Möglichkeit bestünde darin, die mit Docker Compose erzeugen und einfach erweiterbaren Backends für Demozwecke zu verwenden und somit potentiellen Nutzer zu zeigen, zu was Alfresco Produkte alles in der Lage sind.

# Verwendete Technologien
Der Alfresco Provisioner verwendet eine Vielzahl moderner Technologien. Ich beschreibe diese nachfolgend in den Kategorien Backend, Frontend und DevOps Pipeline.

## Backend
Die Alfresco Instanzen werden mit Hilfe von Docker Compose, welche ich mit dem [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) erstellt habe, betrieben. Diese laufen dann auf AWS Ec2 Instanzen. Die Verwendung von Ec2 Instanzen für ein Alfresco Backend ist mittlerweile sehr verbreitet. Allerding mache ich diese Kreierung der Instanzen so dynamisch und flexible wie nur möglich. Ich habe nämlich ein AWS Api GateWay erstellt welches autonom in der Lage ist mittels API Requests vom Nutzer, dies Ec2 Instanzen zu starten, stoppen und terminieren.

Nachdem die Instanz gestartet ist, erhält der Nutzer eine Url die ihm zum Alfresco Backend bringt. Hinter dem Api Gateway arbeiten außerdem noch eine vielzahl an Lambdas, Step Functions, Dynamo DB Tables und S3 Buckets um diese zu ermöglichen. All das ist mit Infrastruktur als Code in AWS CDK verfasst. Als Programmiersprache für CDK und den Lambdas verwende ich TypeScript. TypeScript habe ich wärend dieses Projekts lieben gelernt und es ermöglicht mir ein sehr schnelles Entwickeln des Alfresco Provisioner. Auch wird mittels CDK ein Swagger File erzeugt, welches als UI und Client Library für das Frontend gilt. Nähere wie man Swagger / OpenApi lückenlos in CDK einbindet habe ich [in diesem Beitrag beschrieben](https://martinmueller.dev/cdk-swagger).

## Frontend
Das Frontend ist, verglichen mit dem Backend, noch sehr bescheiden. Das liegt zu einem daran das ich noch viel zu lernen habe im Frontendbereich aber auch daran, dass sich das Backend schnell weiterentwickelt und ich nicht jedesmal UI Components neu anpassen möchte. Meine Wahl der Technologien sind React und TypeScript. React besticht durch eine reiche Auswahl an schönen Components und TypeScript ist eine geniale Sprache. Um TypeScript kurz zu beschreiben es nimmt aus Java und JavaScript nur das Beste. Am besten finde ich die Möglichkeit Types zu verwenden. Das dient als Dokumentation und ich schaffe Ordnung im eher Typlosen Dschungel von JavaScript. Auch ist das Nullhandling bzw. Undefinedhandling von TypeScript super.

Darüber hinaus habe ich mich entschlossen den OpenAPI UI Explorer als meine UI zu verwenden. Das hat einfach den super Vorteil, dass quasi die UI Components nur aufgrund des Swagger Files gerendert werden und ich nicht selber Hand anlegen muss. Quasi automatisch generierte Components. Nähere darüber kannst du von meinen vorherigen Posts herausfinden und auf den Swagger UI Seite in [GitHub](https://github.com/swagger-api/swagger-ui) und auf [Swagger.io](https://swagger.io/tools/swagger-ui/)

## DevOps Pipeline
Mit DevOps Pipeline meine ich den Prozess vom implementieren neuer Features bis hin zur Production. Diese Wege können sehr vielfältig sein. Es hat sich allgemein aber eingestellt soviel wie möglich automatisieren zu lassen. Bei meiner Pipeline habe ich einen sehr hohen Automatisierungsgrad erreicht. Ich muss quasi nur nach den master Branch pushen, dann wird ein Teststack aufgebaut und danach Postmantests gegen das API GateWay durchgeführt. Wenn die tests erfolgreich waren wird der Produktionsstack geupdated. Dieses Verhalten kann ich noch leicht beeinflussen im Code selber indem ich folgende Variablen setze:

```YAML
env:
  destroyBefore: true
  deploy: true
  updateProduction: true
  destroyAfter: true
```

Auch nutze ich AWS CDK welches mir erlaubt per TypeScript den Test- und Produktionsstack zu definieren. Näheres darüber kann in meinem vorherigen Post nachgelesen werden [CDK Multistack](https://martinmueller.dev/cdk-multistack) oder [CDK allgemein](http://martinmueller.dev/cdk-example). Travis und AWS CDK finde ich eine geniale Kombination

# Wie Funktionierts?
Das Provisioning der Alfresco Instanzen geschieht via REST API. Der Nutzer logt sich dafür auf der Website ein, erhält dann ein OAUTH Token und kann damit dann neue Alfresco Instanzen erstellen, alte abrufen und ändern. Dadurch dass ich den OpanAPI UI Explorer benutze, erhält der Nutzer genauste Informationen wie die API zu bedienen ist, also welche Parameter in den Requests und Response zu setzen bzw. zu erwarten sind.

Nachfolgend list ich wie zum Beispiel der Body im POST Request ist zum Erstellen einer neuen Instanz:
```JSON
{
 "userId": "alfresco",
 "alfType": {
  "ec2InstanceType": "t2.large",
  "gitRepo": "alf-ec2-1",
 },
 "customName": "Alf Backend 1"
}
```

Die **userId** ist lediglich der Username im System und **customName** ein Spitzname für das Alfresco Backend kreiert mit dem Provisioner. **AlfType** beschreibt den Typ des Alfresco Backends. Dieser setzt sich zusammen aus dem Typen den Ec2 VM **ec2InstanceType** und einem Alfresco Docker Compose Repository **gitRepo**. Das GitHub Repository ist auf meinem Account und Private. Zurzeit unterstütze ich nur eins:

**alf-ec-1** : ACS 6.2 Community, ACA

Alle Komponenten wurden installiert mit dem [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer). Natürlich ist geplant dieses Angebot in Zukunft weit auszubreiten. Es wäre auch denkbar Alfresco Git Repositories von anderen Usern, die nicht aus meinem GitHub Realm stammen, zu nutzen. Sie müssten nur einen gewissen Standard erfüllen und dann spräche nichts dagegen.

Eine detaillierte Beschreibung aller REST Endpoints sowie dessen Requests und Response Parameter können auf der Alfresco Provisioner UI Seite nachgelesen werden.

# Geplante Features
Bereits jetzt sind viele Features geplant, die es dem Nutzer ermöglichen Geld zu sparen, den Umgang mit den Alfresco Produkten erleichtern und das Backend sicherer zu machen. Der Nutzer soll in der Lage sein die Instanzen stoppen und starten zu können. Wenn die Instanz gestoppt ist, braucht der Nutzer nicht mehr für den Compute zu bezahlen sondern nur noch für den Storage oder evtl. garnicht mehr. Auch nützlich wäre eine Erweiterung zur automatischen Erstellung von Backups. Dafür werde ich mir die interessante Arbeit von Tony mit [Alfresco BART](https://github.com/toniblyx/alfresco-backup-and-recovery-tool). Das würde es auch ermöglichen einfacher zu anderen alfTypes upzugraden. Zum jetzigen Zeitpunkt habe ich damit schon einen guten Fortschritt gemacht indem ich ein Tool in Go geschrieben habe, welches backups erstellen kann. Jetzt fehlt nur noch die Möglichkeit diese auch wieder in Alfresco einspielen zu können.

Bisher ist noch kein HTTPS zum Proxy der Instanzen eingerichtet. Ich plane dafür die Zertifikate bereitgestellt von Let's Encrypt zu nutzen. Dafür muss man einfach ein Docker Companion erstellen, welcher die Zertifikate Verwaltung übernimmt. Auch sollte es so möglich sein die Zertifikate automatisch vor Ablauf erneuern zu lassen. Bisher ist nur ACS Community eingerichtet aber ich plan auch andere Produkte von Alfresco wie ACS Enterprise oder APS anzubieten. Auch denke ich über einen Onboarding Layer für ACA nach.

Ein weiteres nützliches Feature wäre es, wenn der Nutzer die Instanz Url einfach umleiten kann zu seiner eigenen Domain Url.

# Closed Alpha
Ich werde bald den Alfresco Provisioner der Öffentlichkeit zu Verfügung stellen. Dafür habe ich mir gedacht eventuell erstmal eine Closed Alpha zu veranstalten. So können Interessierte den Alfresco Instanz Provisioner ausprobieren, Feedback geben und mehr.

Bei Interesse schreibt mir und ich erstelle dann euren Zugangsaccounts. Alles was ich brauche ist die Email Adresse und der gewünschte User Name. Ich habe noch keinen genauen Starttermin für die Closed Alpha allerdings bin ich zuversichtlich, dass ich es noch im Mai passieren wird.

## Kurze Anleitung über die Benutzung des Alfresco Provisioner
Ich habe mich dazu entschlossen ein kurzes Video darüber zu machen, wie der Alfresco Provisioner benutzt werden kann. Das Video kann hier angeschaut werden: https://www.youtube.com/watch?v=OOEOE_ncsx4

## Mehr über die Alfresco Produkte
Wenn du mehr über die in der Closed Alpha genutzten Alfresco Produkte wissen möchtest, habe ich mir gedacht hier ein paar Informationen darüber bereitzustellen. Der Alfresco Provisioner installiert
die moderne [Alfresco Angular WebApp ACA](https://github.com/Alfresco/alfresco-content-app) welches als vereinfachte und Dateispezifische Version von Share angesehen werden kann. ACA wird sitzt auf Root. Es muss also nur die URL der Instanz eingegeben werden z.B. http://ec2-1-2-3-4.eu-west-2.compute.amazonaws.com/ Eine schnelle Runde über die Fähigkeiten von ACA wird [hier](https://docs.alfresco.com/adw1.0/concepts/welcome-adw.html) gezeigt.

Share welches mit /share aufgerufen werden kann bietet zusätzlich zu ACA eine riesige Auswahl von Funktionen. Einen groben Überblick können die nachfolgenden Video verschaffen:
* https://www.youtube.com/watch?v=YhtMv86LP10
* https://www.youtube.com/watch?v=ZWz1wXq7zCk
* https://www.youtube.com/watch?v=8R1FCoWm0xY

# Aus Persönlicher Sicht
Was mir am meisten gefällt an diesem Projekt ist einfach mal die Tatsache, dass der Großteil der Implementierung, Testung, Entwicklung und Dokumentierung mit Hilfe der Swagger Definition geschieht. Das geht hin von der Validierung der Request Parameter, Implementierung der REST Schnittstelle, Dokumentation, Visualisierung mit Swagger UI und automatisierten Tests in Postman. Ich liebe den Ansatz mit der Swagger Definition, die ich per Swagger Plugin im Visual Studio Code previewen kann, für fast alles nutzen zu können. Aus meinser Sicher ist das die Zukunft der Serverimplementierung.

Das Weiteren bin ich einfach immer noch Überwältigt mit was ein einziger Entwickler in der Lage ist mit AWS CDK, ins Besondere im TypeScript Flavor, zu tun. Meine Begeisterung zu [CDK](http://martinmueller.dev/cdk-example) habe ich bereits hier beschrieben und möchte es hier nicht wieder holen. Bitte nachholen.

# Zusammenfassung
Was als einfaches AWS CDK experiment startetet entwickelte sich rasch zu einem tollen neuen Service den ich den Alfresco Provisioner genannt habe. Damit ist es einfach möglich Alfresco Backends, welche mit Docker Compose entwickelt wurden, bereitzustellen. In der Closed Alpha Phase lade ich dich herzlich ein den Service zu nutzen.

# Kudos
Ein fettes Dankeschön an die [AWS CDK Community in Gitter](https://gitter.im/awslabs/aws-cdk). Selten habe ich eine Community so sehr in Liebe verfallen zu der Technologie gesehen.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   