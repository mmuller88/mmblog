---
title: ACS and APS Integration
date: '2020-06-14'
image: 'handshake.png'
tags: ['eng', '2020', 'acs', 'aps', 'process']
gerUrl: https://martinmueller.dev/alf-acs-aps-integration
pruneLength: 50
---

Hi Alfrescans.

Some months ago I reported about an exciting project with the customer where we used the latest [ACS and APS version](https://martinmueller.dev/alf-acs-aps-integration-eng). So far everything has been running smoothly. But now we were facing an exciting challenge. We wanted to start processes in APS from ACS. But without using the Share Connector, which normally facilitates such integrations between ACS and APS. Since ACS 6.0 the Share Connector is no longer supported by Alfresco.

# Problem
ACS and APS are two independent services that are able to communicate with each other via CMIS or REST APIs. For a long time it has been possible to set ACS as a content management system and thus store and retrieve data directly in ACS (content and properties). This works great as long as the processes are started from APS. But you can also perfectly imagine the use case that processes should be started from ACS. An example would be if a document is uploaded in a certain ACS folder, a process in APS should be started with this document.

For ACS 5.2 this problem could be solved with the Share Connector. This extends ACS with webscripts which can start processes via REST with APS. Additionally the Share Connector offers some Share UI extensions for the APS integration. It could be still possible to use the Share Connector for newer ACS versions, but then Alfresco would no longer offer support if you are running in any problems with it. In the following I explain two methods how to start a process in APS from a URL without using the Share Connector. Then I explain how to call this URL in ACS as part of an action webhook.

# Custom Endpoint for Starting a Process
APS offers the possibility to implement custom endpoints via Java code. This can then be used to start processes and transfer variables to the process. You can find the Alfresco documentation [here](https://docs.alfresco.com/process-services1.11/topics/custom_rest_endpoints.html). If such a custom endpoint is implemented, it can be used as a WebHook in ACS to start a process from ACS. As described in the documentation, the endpoint is defined using Java and then packed into a jar. The configuration of this was a bit complex because some dependencies are only available in the private Alfresco Nexus. I needed the following dependencies to build the JAR:

```MAVEN
<dependencies>
    <dependency>
        <groupId>org.alfresco</groupId>
        <artifactId>alfresco repository
    </dependency>
    <dependency>
        <groupId>com.activiti</groupId>
        <artifactId>activiti-app-rest</artifactId>
        <version>1.11.0</version>
    </dependency>
    <dependency>
    <groupId>org.springframework</groupId>
        <artifactId>spring-web>/artifactId>
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

Access to the private Alfresco Nexus repository is required. These can be obtained from support.alfresco.com . Afterwards the JAR can be copied into the container using a docker. Below I show the Docker Compose and Docker Settings for loading the JAR into the Tomcat webapp lib.

```YAML
process:
    build:
        context: ./process
    environment:
    ...
```

The following Docker file is located in the ./process folder.

```YAML
FROM alfresco/process-services:1.11.0

ARG TOMCAT_DIR=/usr/local/tomcat

COPY target/acsaps-1.0.0-SNAPSHOT.jar $TOMCAT_DIR/webapps/activiti-app/WEB-INF/lib
```

Better you test the custom endpoint with Postman before you try to call it with ACS Url Webhook. I'm not sure yet what the advantages of this method are compared to the APS Signals method in the next section. But I suspect that with Java programming a more complex process call might be possible.

# APS Signal for Starting the Process
The use of start signals in APS is a different way of connecting ACS and APS. The big advantage compared to the custom endpoint method is that no Java code has to be created and everything can be configured via UI in /activiti-app. Another advantage is that the so called Start Signals can start several independent processes. In our example I will stick to one process. jtsmith describes the procedure very well in his blog post [Start Signal Event with REST example](https://hub.alfresco.com/t5/alfresco-process-services/using-rest-call-with-a-start-signal-event-in-aps/ba-p/288943). In short, a Basic Auth Endpoint is created using APS. Afterwards a signal process is modeled, which will intercept the signal and map it to the endpoint. It is important that the request mapping has the following form:

**APS Signal Payload**
```JSON
{
   "signalName": "mysignal",
   "tenantId": "tenant_1",
   "async": "false",
   "variables":
   [
        {
            "name": "document",
            "value": "${document.nodeRef}"
        }
    ]
}
```

Please read the exact functions of the properties in the linked original post. Next you can create processes that can use the **mysignal** signal as start event to start the process. The model for the signal process can then be easily exported and reused.

# ACS Webhook Action
The previous sections explained how to start an APS process from a URL. Now the only thing missing is the possibility to do exactly that with ACS. I consider the use case that a user wants to start a process when a file in a folder is uploaded to ACS. Two elements are necessary for this. For the folder we have to create a rule that is activated when a new document is created. Then a WebHook action must be executed.

Unfortunately Alfresco does not offer a Webhook action ootb. There are two possibilities to archive that. Either you create an Alfresco Webhook action yourself or use the sophisticated Webhook action from [Acosix GmBH](https://github.com/Acosix/alfresco-actions). That comes with a lot of great features like FreeMarker text input fields to define the payload or the Webhook URL, which is pretty cool. The Webhook Action works with payload templates that can be created / customized at runtime.

I have provided an APS Payload Template which already provides the **APS Signal Payload** mentioned above. If you want to transfer more variables like Alfresco properties using the Webhook, you only have to extend the payload template in the **variables** section. The Webhook Action from Axel also offers excellent debugging options to find possible bugs.

# Summary
ACS and APS are powerful tools that combine to help companies finally find the long awaited, optimal digital solution. The integration of ACS with APS presents challenges for many Alfresco engineers. I've listed two ways in which this integration can be accomplished and hope it helps you achieve your ECM BPM goals using ACS and APS. Our ACS to APS integration at the customer site is far from complete as we plan to write complex processes in APS and are already thinking about the integrity between ACS and APS, which presents us with exciting problems. Write me how your ACS APS integration looks like :) .

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>