---
title: Alfresco 6.2 with OCR
date: '2020-11-24'
image: 'digital.png'
tags: ['eng', '2020', 'addon', 'acs', 'alfresco', 'docker-compose', 'ocr']
pruneLength: 50
---

Hi Alfrescans.

Object Character Recognition (short OCR) is a cool tool as it allows you to make your scanned documents incredible useful as it recognizes characters and words and makes those accessible in your document like through a PDF sandwich. A PDF sandwich contains text which you can select, copy or search through it. That's the case like when you export a word document into PDF.

But when you just scan a text and save it as PDF, the text is not selectable anymore and you only have some less useful pictures in your PDF document. And here the power of OCR comes in. With OCR you can transform those dumb PDF document to PDF sandwich. Than you can again select and copy text or search for it in the document.

Even better as Alfresco uses Solr to make a full text search, you can search for documents containing certain words across you documents. Thats extremely powerful. But yeah Alfresco doesn't come ootb with OCR so how you can enhance Alfresco with such a cool feature? In the next sections I will explain how!

# OCR as a Service
As a quick way of developing, I implemented my solution as a Docker Compose deployment. The OCR service itself is implemented as a Docker container which shares the ocr input and output volumes with the Alfresco container. The underlying OCR engine is [OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF).

```YAML
ocrmypdf:
    build: ocrmypdf
    hostname: ocrmypdf
    mem_limit: 512m
    volumes:
        - ocr-input:/usr/local/tomcat/ocr_input
        - ocr-output:/usr/local/tomcat/ocr_output
```

The full Docker Compose git code can be found in my GitHub repo [alfresco-ocr](https://github.com/mmuller88/alfresco-ocr). I describe in the next section how I did the setup with Alfresco.

# Alfresco Setup
The Alfresco Docker Compose deploy is created using the [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) with the ACS Community 6.2 option. All other options are the defaults.

Additionally the repo and share OCR amps [alfresco-simple-ocr](https://github.com/keensoft/alfresco-simple-ocr) are installed by simply dropping the addon jar files into **alfresco-ocr/alfresco/modules/jars** and **alfresco-ocr/share/modules/jars** . Easy peasy.

# Run it with AWS CDK
I enhanced the Docker Compose deployment to make it easy runnable in AWS. For that I use [AWS CDK](https://github.com/aws/aws-cdk). Is use a little library which hides a lot complexity using the AWS CDK stuff. The CDK Pipeline App in ./cdk/app.ts will create a sophisticated pipeline to deploy the instance in one or more accounts. For more information please read the Readme.

Your Alfresco will become available in AWS und links like
* http://ec2-3-92-227-231.compute-1.amazonaws.com:8080/ for Alfresco Content App or
* http://ec2-3-92-227-231.compute-1.amazonaws.com:8080/share for Share of course

I personally like that way of deploying Alfresco into the Cloud as AWS CDK is a lovely abstraction on top of CloudFormation which makes creating infrastructure such as for Alfresco (Ec2, Loadbalancer, Kubernetes, Docker) a piece of cake. If you want to know more about deploying Alfresco into AWS have a look through [my posts](https://martinmueller.dev/tags/alfresco) where you find many more topics around it.

# Summary
OCR in Alfresco is a cool and useful feature. It enhances an Alfresco repository to make better use of documents which lost text information like scanned ones. It's incredibly useful it is to encapsulate the OCR engine as its own service like I did here as Docker Container.

Potentially you could enhance that setup to offer a REST API to the OCR service and for example choose between difference OCR engines and pick the best result yourself. All that is very exciting. Tell me what you think about OCR together with Alfresco.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>