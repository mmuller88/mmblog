---
title: Der Alfresco Backend Provisioner
show: 'no'
description: Über die Closed Beta meines CDK Backends
date: '2020-04-25'
image: 'prov.png'
tags: ['de', '2020', 'acs', 'aps', 'docker', 'docker-compose', 'ec2']
engUrl: https://martinmueller.dev/alf-provisioner-eng
pruneLength: 50
---

Hi Alfrescans.

In den letzten Wochen habe ich während meiner Freizeit an einem interessanten Projekt gearbeitet. Ich habe zwar noch nicht wirklich einen Namen gefunden aber es ist sowas wie der Alfresco Backend Provisioner. Damit kann jeder schnell und einfach Alfresco Backends für sich und seine Community erstellen. In den nächsten Abschnitten werde ich genauer von meiner Idee berichten sowie welche Technologien ich dafür verwendet habe.


# Zielgruppe
Da Alfresco eher auf große Kundschaft zielt, also große Gruppen wie Unternehmen mit mehreren hundert Angestellten, sehe ich einen klaren Bedarf bei den eher kleineren Gruppen bishin zu Einzelpersonen. Das ist ein eher Netflix oder Uber ähnlicher Ansatz bei dem günstige Services angeboten werden. Ich habe sogar genau einen passenden potentiellen Kunden in meiner Umgebung. Ich bin Mitglied in einer Kirchgemeinde. Nun würde sich gerne die Kirchgemeinde modernisieren auch hin in Richtung Digitalisierung. So werden zum Beispiel Videos von Gottesdienste einfach auf Youtube hochgeladen oder gemachte Bilder landen irgendwo in Dropbox. Das ist überhaupt nicht kollaborationsfreundlich und ich sehe die Alfresco Produkte in der Lage viele solcher Probleme lösen zu können. Mit sicherheit kennst auch auch du Vereine in deiner Umgebung die von Alfresco profitieren könnten.

Auch könnte das schnelle bereitstellten von Alfresco Backends Communites bei der zwingend erforderlichen Digitalisierung wärend der Coronakrise helfen. Es sollte sogut es geht vermieden werden Dokumente in echt von Person zu Person auszutauschen. Gerne würde ich meinen Beitrag leisten bei der Pandemie zu helfen und vielleicht ist der Alfresco Backend Provisioner ja eine Möglichkeit

 Herausvordernd wird dan natürlich den monatlichen Preis so gering wie möglich zu halten und die Kostenvorteile der Cloud so gut leveragen zu können wie möglich. Ein paar Ideen die ich diesbezüglich bereits habe und erforschen werde sind Reserved Instances, Spot Instances, S3 als Objektspeicher, Pay as you go für die Alfresco Instanzen.

# Verwendete Technologien
Selbst wenn der Alfresco Backend Provisioner nicht so erfolgreich wird wie ich es gerne hätte, macht das überhaupt nichts da ich im Zuge der Implementierung viele neue tolle und moderne Technologien erlernt habe. Ich versuche die verwendeten Technologien aufzuteilen in Backend, DevOps Pipeline und Frontend

## Backend
Die Alfresco Instanzen werden mit Hilfe von Docker Compose, welche ich mit dem [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) erstellt habe, betrieben. Diese laufen dann in AWS Ec2 Instanzen. Bis hierhin ist noch nix spannendes. Allerding mache ich diese Kreierung der Instanzen so dynamisch und flexible wie nur möglich. Ich habe nämlich ein AWS Api GateWay erstellt welches autonom in der Lage ist mittel API Requests vom Kunden, dies Ec2 Instanzen zu starten, stoppen und terminieren.

Nachdem die Instanz gestartet ist, erhält der Kunde eine Url die ihm zum Alfresco Backend bringt. Hinter dem Api Gateway arbeiten außerdem noch eine vielzahl an Lambdas, Step Functions, Dynamo DB Tables und S3 Buckets um diese zu ermöglichen. All das ist mit Infrastruktur als Code in AWS CDK verfasst. Als Programmiersprache für CDK und den Lambdas verwende ich TypeScript. TypeScript habe ich wärend dieses Projekts lieben gelernt und es ermöglicht mir ein sehr schnelles Entwickeln des Alfresco Backend Provisioner. Auch wird mittels CDK ein Swagger File erzeugt, welches als UI und Client Library für das Frontent gilt. Nähere wie man Swagger lückenlos in CDK einbindet habe ich [ein diesem Beitrag beschrieben](https://martinmueller.dev/cdk-swagger).

## DevOps Pipeline
Mit DevOps Pipeline meine ich den Prozess vom implementieren neuer Features bis hin zur Production. Diese Wege können sehr vielfältig sein. Es hat sich allgemein aber eingestellt soviel wie möglich automatisieren zu lassen. Bei meiner Pipeline habe ich einen sehr hohen Automatisierungsgrade geschafft. Ich muss quasi nur nach master pushen, dann wird ein Teststack aufgebaut und danach Postmantests gegen das API GateWay durchgeführt. Wenn die tests erfolgreich waren wird der Produktionsstack geupdated. Dieses Verhalten kann ich noch leicht beeinflussen im Code selber indem ich folgende Variablen setze:

```YAML
env:
  destroyBefore: true
  deploy: true
  updateProduction: true
  destroyAfter: true
```

Auch nutze ich AWS CDK welches mir erlaubt per TypeScript den Test- und Produktionsstack zu definieren. Näheres darüber kann in meinem vorherigen Post nachgelesen werden [CDK Multistack](https://martinmueller.dev/cdk-multistack) oder [CDK allgemein](http://martinmueller.dev/cdk-example). Travis und AWS CDK finde ich eine geniale Kombination

## Frontend
Das Frontend ist, verglichen mit dem Backend, noch sehr bescheidend. Das liegt zu einem daran das ich noch viel zu lernen habe im Frontend aber auch daran, dass sich das Backend stark entwickelt und ich nicht jedesmal UI Components neu anpassen möchte. Meine Wahl der Technologien sind React und TypeScript. React besticht durch eine reiche Auswahl an schönen Components und TypeScript ist eine geniale Sprache. Um TypeScript kurz zu beschreiben es nimmt aus Java und JavaScript nur das beste. Am besten finde ich die Möglichkeit Types zu verwenden. Das dient als Dokumentation und ich schaffe Ordnung im eher Typlosen Dschungel von JavaScript. Auch ist das Nullhandling bzw. Undefinedhandling von TypeScript super.

Darüber hinaus habe ich mich entschlossen den OpenAPI UI explorer als meine UI zu verwenden. Das hat einfach den super Vorteil, dass quasi die UI Components nur aufgrund des Swagger Files gerendert werden und ich nicht selber Hand anlegen muss. Quasi automatisch generierte Components.

# Wie funktionierts?
* Kunde äußert Wunsch via REST API und provisioner wird versuchen den Wunsch zu folgen. Ähnlich Kubernetes wo auch über Manifeste spezifiziert werden wie die Orchestrierung aussehen soll.

```JSON
{
	"alfUserId": "alfresco",
	"alfType": 1,
	"customName": "Alf Backend 1"
}
```

* AlfType Erklärung. Bisher nur
  - alfType 1: m4.xlarge 
  - alfType 2: m4.2xlarge
* Graphische UI kommt noch

# Closed Beta
Ich danke dir soweit schonmal, dass du bis hierhin gelesen hast. Nun würde ich gerne bald den Alfresco Backend Provisioner der Öffentlichkeit zu Verfügung stellen wollen. Dafür habe ich mir gedacht eventuell erstmal eine Closed Bete zu veranstalten. So können schon baliding Interessierte den Provisioner ausprobieren und sich gg. Partnerschaften herauskristallisieren lassen. Auch würde es mir wertfollen Feedback geben, was ich in Zukunft noch implementieren und prioritisieren sollte. Bei Interesse bitte schreibt mir und ich erstelle dann euren Zugangsaccounts. Alles was ich brauch ist die Email Adresse und der gewünschte User Name.

# Geplante Features
Bereits jetzt sind viele Features geplant die dem Kunden ermöglichen Geld zu sparen, den Umgang mit den Alfresco Produkten erleichtern und das Backend sicherer machen. Der Kunde soll in der Lage sein die Intanzen stoppen und starten zu können. Wenn die Instanz gestopp ist, braucht der Kunde nicht mehr für den Compute zu bezahlen sondern nur noch für den Storage oder evtl. garnicht mehr. Auch nützlich wäre eine Erweiterung zur automatischen Erstellung von Backups. Dafür werde ich mir die interessante Arbeit von Tony mit [Alfresco BART](https://github.com/toniblyx/alfresco-backup-and-recovery-tool). Das würde es auch ermöglichen zu anderen alfTypes upzugraden.

Bisher ist noch kein HTTPS zum Proxy der Instanzen eingerichtet. Ich plan dafür die Zertifikate bereitgestellt von Let's Encrypt. Dafür muss man einfach ein Docker Companien erstellen, welcher die Zertifikate Verwaltung übernimmt. Auch sollte es so möglich sein die Zertifikate automatisch vor Ablauf erneuern zu lassen. Bisher ist nur ACS Community eingerichtet aber ich plan auch andere Produkte von Alfresco wie ACS Enterprise oder APS anzubieten. Auch denke ich über einen Onboarding Layer für ACA nach.

# Zusammenfassung

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>