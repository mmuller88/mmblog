---
title: ACS and APS Deployment with Docker Compose
show: 'no'
description: ACS and APS installed with Docker Compose
date: '2020-04-12'
image: 'compose.jpeg'
tags: ['eng', '2020', 'acs', 'aps', 'docker', 'docker-compose', 'ec2']
gerUrl: https://martinmueller.dev/alf-acs-aps
pruneLength: 50
---

UNDER CONSTRUCTION

Hi Alfrescans.

It is time again to report about an exciting Alfresco partner project from me. For a customer here in Germany I am developing a POC which should use ACS 6.2 and APS 1.10. After a bit of persuasion, I was able to convince those involved to use Docker for ACS 6.2. My plan was to create a Docker Compose Deployment which included ACS, APS and openLDAP as an identity provider. The complete deployment can be viewed [with me in GitHub](https://github.com/mmuller88/alf-acs-aps). One thing should be mentioned in advance. Alfresco officially recommends [to use Kubernetes] for such deployments (https://github.com/Alfresco/alfresco-dbp-deployment), but the cloud is a taboo topic for my customers. I am also excited to see how far I will get with Docker Compose for such a deployment.

# Docker Compose Setup
Here I describe a little more in detail which technologies I use for deployment. As indicated at the beginning, ACS 6.2 should be installed. The most recently released version is 6.2.0.3. So this only has to be reflected in the alfresco Dockerfile in/alfresco/Dockerfile. Share remains on version 6.2.0 since no newer version has been released. ACS is to be connected with an openLDAP DB for user provisioning. Fortunately, there are already great images for creating and managing an [openLDAP DB](https://github.com/osixia/docker-openldap). For the optical administration of the openLDAP DB I use [phpldapadmin](http://phpldapadmin.sourceforge.net/wiki/index.php/Main_Page). Read exactly how the openLDAP configuration looks in the docker-compose-base.yml file.

[APS 1.10](https://docs.alfresco.com/process-services1.10/concepts/welcome.html) should also be used to model the workflows at the customer. The fact that Alfresco no longer offers Docker Compose Reference Deployments for APS 1.10 is somewhat unfavorable. I guess that is because of the Kubernetes deployments and that there is simply a stronger focus. Fortunately, there are still a few old Docker Compose templates and with a few modifications they work too!

Since it is very memory intensive to run ACS and APS at the same time, I decided to split the complex deployment into three separable deployments. So I can continue to work efficiently on my 16 GB memory laptop. The division is done using Docker Compose Files. The first is the ACS deployment, followed by the second with the APS deplyoment. Finally, there is ACS and APS deployment. I think that's a brilliant idea because if I just want to work on ACS or APS, I don't have to start up the entire stack. In addition, I am considering deploying the third-party deployment ACS and APS in EC2 using a DevOps pipeline.

# Prerequisites
It is clear that you need Docker. If you are working on a Windows or Mac, I recommend the [Docker Desktop](https://www.docker.com/products/docker-desktop). After the installation please remember to make more memory available to the Docker environment as the default 2 GB are far too little to get ACS up and running. At least 12 GB would be appropriate!

The ACS Docker Compose File also uses private images hosted by Alfresco in quay.io. For these, it would be important to request access data from Alfresco Support. If you have this, just run the following command and enter the credentials:

```
docker login quay.io
```

More or less optional but my example in the GitHub repository uses Node's NPM for a CLI script tool to wait until Alfresco has finished booting. So it's best to install the node and NPM as well.

# Git Prepare
Of course, a git repo has to be created first. I called mine [alf-acs-aps](https://github.com/mmuller88/alf-acs-aps). As in my last [Alfresco Docker Project](https://martinmueller.dev/start-script) I recommend using the [Docker Alfresco Installer](https://github.com/Alfresco/alfresco-docker-installer) to prepare the empty Git repository. I describe exactly how the Docker Alfresco Installer can be used [here](https://github.com/mmuller88/alfresco-docker-installer). When installing, make sure that LDAP and an SMTP server are also selected. If you are not using my GithUb Repo, you should now integrate the APS 1.10 services into the Docker Compose Deployment. I recommend that you split the deployment into three parts. All three are explained in the next sections.

## ACS Deployment
First a docker-compose-base.yml file is created which contains all the services required for all three deployments. In my case this is an openLDAP and postgres database. As well as a mail server. Then the ACS Docker Compose File is created. The entire deployment can now be started as follows:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml up -d --build
```

and so stop:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml stop
```

If a complete ACS restart with empty databases and other storage is desired, simply execute these commands:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml down
rm -rf data
rm -rf logs
```

## APS Deployment
The APS deployment is started as follows:

```
docker-compose -f docker-compose-base.yml -f docker-compose-APS.yml up -d --build
```

and it is stopped like this:

```
docker-compose -f docker-compose-base.yml -f docker-compose-APS.yml stop
```

To erase just do the following:

```
docker-compose -f docker-compose-base.yml -f docker-compose-APS.yml down
rm -rf data
rm -rf logs
```

## ACS and APS Deployment
Warning a warning in advance! This deployment is very memory intensive. Your laptop or PC should have at least 16Gb. Alternatively, I plan to deploy this variant in the cloud on EC2.

And this is how all services are started:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml -f docker-compose-APS.yml -f docker-compose-Proxy.yml up -d --build
```

and so stopped

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml -f docker-compose-APS.yml -f docker-compose-Proxy.yml stop
```

And just type to tear it down:

```
docker-compose -f docker-compose-base.yml -f docker-compose-ACS.yml -f docker-compose-APS.yml -f docker-compose-Proxy.yml down
rm -rf data
rm -rf logs
```

# Outlook
As indicated, I would like to bring the third deployment ACS and APS to AWS EC2. Preferably even in a beautiful DevOps pipeline, i.e. commit after master triggered and deploy to EC2, where automated tests are then carried out, such as whether ACS and APS have successfully booted.

SSO (Single Sign On) allows you to only have to register once for Alfresco products. That means if I log in to Share for example and then open Alfresco Digital Workspace or the Ativiti app, I don't have to log in again. To do this, AIMS Alfresco Identify Manager Service would have to be configured with ACS and, in addition, the SAML amp.

# Summary
You don't always have to unpack the Kubernetes club when it comes to container orchestration. Docker Compose can also be used to orchestrate containers. There is even the option of dividing complex deployments into small sections, which do not save the memory of your laptop but are also excellent for fast iteration during development. So feel free to try out deploying ACS and APS using Docker Compose. If there are any questions, just write to us.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>