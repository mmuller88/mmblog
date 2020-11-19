---
title: Alfresco OCR
show: 'no'
date: '2020-11-23'
image: 'sig.png'
tags: ['eng', '2020', 'addon', 'acs', 'alfresco', 'docker-compose', 'ocr', 'nofeed']
gerUrl: https://martinmueller.dev/alf-ocr
pruneLength: 50
---

Hi Alfrescans.

Object Character Recognition (short OCR) is a cool thing as it allows you to make your scanned documents incredible useful as it recognizes characters and words and makes those accessible in your document like through a PDF sandwich. A PDF sandwich contains text wich you can select, copy or search through it. Thats the case like when you export a word document into PDF.

But when you just scan a text and save it as PDF, the text is not selectable anymore and you just has some less useful pictures in you PDF document. And here the power of OCR comes in. With OCR you can transform those dumb PDF document to PDF sandwich. Than you can again select and copy text or search for it in the document.

Even better as Alfresco uses Solr to make a full text search, you can search for documents containing certain words across you documents. Thats extremely powerful. But yeah Alfresco doesn't come ootb with OCR so how you can enhance Alfresco with such a cool feature? In the next sections I will explain you how!

# OCR as a Service
As a quick way of developing I implemented my solution as a Docker Compose deployment. The OCR service itself is implemented as a Docker container which chares the ocr input and output volumes with the Alfresco container. The underlying OCR engine is [OCRmyPDF](https://github.com/jbarlow83/OCRmyPDF).

```YAML
ocrmypdf:
    build: ocrmypdf
    hostname: ocrmypdf
    mem_limit: 512m
    volumes:
        - ocr-input:/usr/local/tomcat/ocr_input
        - ocr-output:/usr/local/tomcat/ocr_output
```

The full Docker Compose git code can be found in my GitHub repo [alfresco-ocr](https://github.com/mmuller88/alfresco-ocr). How I did the setup for Alfresco I will describe in the next section.

# Alfresco Setup
* ACS Community 6.2
* https://github.com/Alfresco/alfresco-docker-installer link to other posts from me about the installer

# Run it with CDK
I enhanced the Docker Compose deployment to make it easy runnable in AWS.

# Summary
OCR in Alfresco is a cool and useful feature. It enhances an Alfresco repository to make better use of documents which lost text information like scanned ones. Incredible useful it is to encapsulate the OCR engine as its own service like I did here as Docker Container. 

Potentially you could enhance that setup to offer a REST API to the OCR service and for example choose between difference OCR engines and pick the best result yourself. All that is very exciting. Tell me what you think about OCR together with Alfresco.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>