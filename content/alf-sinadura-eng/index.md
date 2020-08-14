---
title: Alfresco Signatures with Sinadura. Sponsored by [PMGA Tech](www.pmga.tech)
date: '2020-08-14'
image: 'sig.png'
tags: ['eng', '2020', 'addon', 'acs', 'alfresco', 'docker-compose', 'nofeed']
gerUrl: https://martinmueller.dev/alf-sinadura
pruneLength: 50
---
# Sponsored by [PMGA Tech](www.pmga.tech)
Hi Alfrescans.

Digital signatures are one of the most used forms of integrity checks on the Internet. Integrity check here means whether the document in question is the original and therefore not a fake or a modified version. An example are the SSL certificates which are needed to call HTTPS urls. There you have to check if the SSL certificate is not tampered with and this is done with a digital signature.

Alfresco does not offer a document signing function out of the box, but with the open source addon [Sinadura](https://github.com/zylklab/alfresco-sinadura) (Repo and Share) this feature can be added. On YouTube there is a short [Video](https://www.youtube.com/watch?feature=player_embedded&v=MCTpOKZtTgw) about the signing function of Sinadura. A signing feature in Alfresco has two major advantages. The first would be increased security, as it would make it almost impossible to forge documents in Alfresco, e.g. by an attacker entering the system.

Second, it would allow the normal Use Case Scope, i.e. to stay within a company, to be abandoned and people who do not work in the company, such as customers, to be included in the content management system. By using signatures, an improved relationship of trust can be achieved.

In the next sections, I would like to tell you more about the Sinadura addon.

# Sinadura Addon
Sinadura.net is an open source project for digital signature software. For this purpose a Sinadura server is normally running for signature check and creation. A client then connects to the Sinadura server.

Sinadura has an Alfresco addon repo in GitHub https://github.com/zylklab/alfresco-sinadura which only works with ACS Community and Enterprise version 5. Of course it would be great to support newer Alfresco versions with Docker. So I made it my business to make this great addon compatible with ACS 6.2.

# ACS 6.2 Compatible
Currently the Alfresco Sinadura addon in https://github.com/zylklab/alfresco-sinadura is still based on SDK 2.2.0 and ACS 5. It seems that SDK 2.2.0 does not work ootb. anymore and some necessary artifacts are not available in the Alfresco Nexus. Only with a lot of efforts would it be possible to compile the Sinadura amps with SDK 2.2.0. So I decided to use the latest SDK version 4.1.0.

The migration, which you can find in my Git Repo at https://github.com/mmuller88/alfresco-sinadura-6X-pmgatech, worked great. How to build an Alfresco SDK 4.1.0 build is very well described in the official [Alfresco SDK Repo](https://github.com/Alfresco/alfresco-sdk). SDK 4.1.0 is heavily based on Docker and uses Docker Compose as a container orchestrator.

A bit more challenging was the migration of the AMP structure to 4.1.0 as some files have to be placed in a different location than in 2.2.0. Also I had to put the sinaduraCloud war file in its own Tomcat running with Java 8 as Alfresco uses Java 11.

# Summary
Digital signatures are an exciting topic and enable an Alfresco document management system to have completely new use cases. The process of signing in conjunction with Alfresco Process Service could also be interesting.

Many thanks to my sponsor [www.pmga.tech](www.pmga.tech) for the migration work on Sinadura. Do you have exciting Alfresco projects you are working on? Let me know :) !

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>