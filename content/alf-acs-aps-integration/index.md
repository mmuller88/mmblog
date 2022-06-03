---
title: ACS und APS Integration
show: 'no'
date: '2020-06-14'
image: 'handshake.png'
tags: ['de', '2020', 'acs', 'aps', 'process']
engUrl: https://martinmueller.dev/alf-acs-aps-integration-eng
pruneLength: 50
---

Hi Alfrescans.

Vor einigen Monaten berichtete ich über ein spannendes Projekt mit dem Kunden bei dem wir die neueste [ACS und APS version verwenden](https://martinmueller.dev/alf-acs-aps-integration). Bisher lief alles reibungslos. Nun standen wir aber vor der nächsten spannenden Herausforderung. Wir wollten Prozesse in APS aus ACS heraus starten. Das Ganze aber ohne Verwendung des Share Connector, welcher normalerweise solche Integrationen zwischen ACS und APS erleichtert. Seit ACS 6.0 ist der Share Connector nicht mehr von Alfresco supported.

# Problemstellung
ACS und APS sind zwei unabhängige Services die in der Lage sind über CMIS oder REST APIs miteinander zu kommunizieren. Schon seit langem ist es möglich bei APS ACS als Content Management System einzustellen und somit Daten direkt in ACS zu speichern und abrufbar (Content und Properties) zu halten. Das funktioniert super solange die Prozesse von APS aus gestartet werden. Nun kann man sich aber ja auch perfekt den Use Case vorstellen, dass Prozesse aus ACS gestartet werden sollen. Ein Beispiel dafür wäre wenn ein Dokument in einem bestimmten ACS Folder hochgeladen wird, soll ein Prozess in APS mit diesem Dokument gestartet werden.

Für ACS 5.2 ließ sich das Problem mit dem Share Connector lösen. Dieser erweitert ACS mit Webscripts welche über die REST mit APS Prozesse starten kann. Zusätzlich bietet der Share Connector noch einige Share UI Erweiterungen für die APS Integration. Es wäre zwar noch möglich den Share Connector für neuere ACS Versionen zu verwenden, allerdings bietet dann Alfresco keinen Support mehr. Nachfolgend erkläre ich zwei Methoden wie ein Prozess in APS über eine URL gestartet werden kann ohne den Share Connector zu verwenden. Anschließend erkläre ich wie man diese URL in ACS als teil einer Action in Form eines Webhooks aufrufen kann.

# Custom Endpoint zum Prozess Starten
APS bietet die Möglichkeit Custom Endpoints per Java Code zu implementieren. Mit diesem lassen sich dann Prozesse starten und Variablen zum Prozess übergeben. Die Alfresco Dokumentation dazu findet ihr [hier](https://docs.alfresco.com/process-services1.11/topics/custom_rest_endpoints.html). Ist nun so ein Custom Endpunkt implementiert, kann dieser als WebHook in ACS genutzt werden um einen Prozess aus ACS heraus zu starten. Wie in der Dokumentation beschrieben, wird der Endpunkt mittels Java definiert um anschließend in eine Jar verpackt zu werden. Die Konfiguration dessen war etwas aufwendig da einige Dependencies nur in dem privaten Alfresco Nexus erhältlich sind. Die folgenden Dependencies habe ich benötigt um die JAR zu bauen:

```MAVEN
<dependencies>
    <dependency>
        <groupId>org.alfresco</groupId>
        <artifactId>alfresco-repository</artifactId>
    </dependency>
    <dependency>
        <groupId>com.activiti</groupId>
        <artifactId>activiti-app-rest</artifactId>
        <version>1.11.0</version>
    </dependency>
    <dependency>
    <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>4.1.6.RELEASE</version>
    </dependency>
</dependencies>
...
<repositories>
    <repository>
        <id>enterprise-releases</id>
        <url>https://artifacts.alfresco.com/nexus/content/repositories/activiti-enterprise-releases</url>
    </repository>
</repositories>
```

Für das private Alfresco Nexus Repository werden Zugangsdaten benötigt. Diese bekommt man unter support.alfresco.com . Anschließend kann die JAR mittels Docker in den Container kopiert werden. Nachfolgend zeige ich die Docker Compose und Docker Settings für das laden der JAR in die Tomcat webapp lib.

```YAML
process:
    build:
        context: ./process
    environment:
    ...
```

Im Ordner ./process befindet sich die folgende Dockerfile.

```YAML
FROM alfresco/process-services:1.11.0

ARG TOMCAT_DIR=/usr/local/tomcat

COPY target/acsaps-1.0.0-SNAPSHOT.jar $TOMCAT_DIR/webapps/activiti-app/WEB-INF/lib
```

Am besten testet ihr den Custom Endpoint zuerst mit Postman bevor ihr versucht mittels ACS Url Webhook diesen aufzurufen. Ich bin mir noch nicht sicher was diese Methode für Vorteile hat Verglichen mit der APS Signals Methode im nächsten Abschnitt. Ich vermute aber, dass mit der Java Programmierung ein komplexerer Prozessaufruf möglich sein könnte.

# APS Signals für den Start des Prozess
Die Verwendung von Start Signalen in APS ist eine andere Art ACS und APS miteinander zu verbinden. Der große Vorteil gegenüber der Custom Endpoint Methode ist, dass kein Java Code erstellt werden muss und sich alles mittels UI in /activiti-app konfigurieren lässt. Ein anderer Vorteil ist, dass das sogenannte Start Signalen mehrere Prozesse staren kann. In unserem Beispiel bleibe ich aber erstmal bei einem. jtsmith beschreibt das Vorgehen sehr gut in seinem Blog Post [Start Signal Event with REST example](https://hub.alfresco.com/t5/alfresco-process-services/using-rest-call-with-a-start-signal-event-in-aps/ba-p/288943). Kurz zusammengefasst wird dabei mittels APS ein Basic Auth Endpoint erstellt. Danach wird ein Signal Prozess modelliert, welcher in Zukunft das Signal quasi abfängt und auf mapped. Dafür wichtig ist, dass das Request Mapping die folgende Form haben muss:

**APS Signal Payload**
```JSON
{
   "signalName":"mysignal",
   "tenantId":"tenant_1",
   "async":"false",
   "variables":
   [
        {
            "name":"document",
            "value":"${document.nodeRef}"
        }
    ]
}
```

Die genauen Funktionen der Properties bitte im verlinkten original Post nachlesen. Als nächstes können dann Prozesse erstellt werden die als Start Event das Signal **mysignal** nutzen können umd den Prozess zu starten. Das Modell für den Signal Prozess lässt sich dann auch einfach exportieren und wiederverwenden.

# ACS Webhook
In den vorherigen Abschnitten wurde erklärt wie ein APS Prozess über eine URL gestartet werden kann. Jetzt fehlt nur noch die Möglichkeit genau das zu tun mit ACS. Ich betrachte dabei den Use Case, dass ein User gerne einen Prozess gestartet haben möchte, wenn eine Datei in einem Folder in ACS hochgeladen wird. Dafür sind zwei Elemente notwendig. Für den Folder müssen wir eine Rule erstellen, welche aktiviert wenn ein neues Dokument erstellt wird. Dann muss eine WebHook Action ausgeführt werden.

Leider bietet Alfresco ootb keine Webhook Action an. Es bieten sich nun als zwei Möglichkeiten. Entweder du bastelst dir selber eine Alfresco Webhook Action oder benutzt die geniale Webhook Action von [Acosix GmBH](https://github.com/Acosix/alfresco-actions). Diese kommt mit vielen tollen Funktionen wie z.B. FreeMarker Text Input Felder um den Payload oder die Webhook URL zu definieren, was ziemlich cool ist. Die Webhook Action arbeitet mit Payload Templates die zur Laufzeit erstellt / angepasst werden können.

Ich habe ein APS Payload Template spendiert welche bereits den vorhin erwähnten **APS Signal Payload** bereitstellt. Wenn ihr noch mehr Variablen wie evtl. Alfresco Properties mittels des Webhooks übertragen wollt, muss das Payload Template nur erweitert werden in der **variables** Section. Die Webhook Action von Axel bietet dabei auch hervorragende Debugging Optionen um eventuelle Bugs aufzufinden.

# Zusammenfassung
ACS und APS sind mächtige Tools welche vereint Unternehmen helfen endlich die lang ersehnte, optimale digitale Lösung zu finden. Die Integration ACS nach APS stellt viele Alfresco Engineers vor Herausforderungen. Ich listete hier mehrere Möglichkeiten wie diese Integration gemeistert werden kann und hoffe das es dir hilft deine ECM BPM Ziele mittels ACS und APS zu erreichen. Unsere ACS APS Integration beim Kunden ist bei weitem noch nicht abgeschlossen, da wir planen relative komplexe Prozesse in APS zu schreiben und uns bereits gedanken über die Integrität zwischen ACS und APS machen, welches uns vor spannenden Problemen stellt. Schreibt mir wie eurer ACS APS Integration aussieht :) .

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   