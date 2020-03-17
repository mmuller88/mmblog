---
title: Alfresco's Amps and Jars Testing with Docker
description: Project for OBJECT with Customizations
show: 'no'
date: '2020-03-17'
image: 'docker.jpg'
tags: ['eng', 'alfresco', '2020', 'ecm', 'docker', 'docker-compose', 'Amp', 'Jar']
gerUrl: http://martinmueller.dev/alfresco-docker-installer
pruneLength: 50
---

Hi Alfrescans,

In this article I will describe how to use Docker to test Amps and Jars extensions for ACS. Share Customizations and Costume Content Models were developed for a customer of [OBJECT](https://www.object.ch), which I wanted further develop and test quickly and easily.

Another interesting detail for my project was that the Amps were written for an ACS 5.2.6 deployment and Docker is only supported as a deployment starting with ACS 6.0. So it was relatively challenging to adjust Docker Deployment so that everything worked. If your extensions were written for ACS 6.0 or later, it should be a lot easier.

# Why Docker Deployment?
The old fashioned way is to test the locally compiled Amps and Jars on a local ACS deployment, which is configured completely without or almost Docker. That means Tomcat must be installed and ACS with all its dependencies must also be available. Clearly the old-fashioned installer helps, but it is still a time-consuming and unsatisfactory task to install Alfresco like this. In addition, there is the fact that the Amps must always be installed by hand and possibly uninstalled. Not nice!

Docker containers address precisely these problems. With the help of the Dockerfile I can write down which configuration steps should be taken. With Git that can even happen versioned and deployments can be reverted to previous working versions at lightning speed. The installation of the Tomcat as well as the configuration of ACS and much more can be written down in these Dockerfiles.

Sounds like a lot of work? Nope! Alfresco maintains ACS Docker Deployments for ACS 6.0 or newer. Such a simple Docker deployment, whereby the containers are orchestrated with Docker Compose can be stowed here for [ACS Enterprise](https://github.com/Alfresco/acs-deployment/tree/master/docker-compose) and here for [ACS Community](https://github.com/Alfresco/acs-community-deployment/tree/master/docker-compose). The Docker Image for this deployment you can find here [ACS Enterprise Image](https://github.com/Alfresco/acs-packaging/tree/master/docker-alfresco) and here for [ACS Community Image](https://github.com/Alfresco/acs-community-packaging/tree/master/docker-alfresco). These deployments and images are quite limited in point of customizations as we would need for our Amps or Jars. While this is good for a quick start, it does not allow us to test things like our locally created Amps. I describe how this is made possible in the next chapter.

# Prepare Git Repo
If the build code of your Amps and Jars are in different git repos, it makes sense to combine them înto one to make Docker image creation easier. E.g. the repo and share Amp could be in the same subdirectories. If Maven was used as a build and packaging tool, this is easy to implement with parent poms. After the possible restructuring, the build must be tested whether the Amps or Jars are also created. For me that was done with the following simple maven command:

```
mvn clean install
```

Now the Docker backend needs to be installed. The orchestration of the containers should be done with Docker Compose. Fortunately, there is the [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) which is very easy to use Yeoman supported template installer and already has a wide range of install options such as the ACS version, whether LDAP to be used, etc. offers. I would suggest to first create a folder with the name docker in the Git Repo and to install the Docker Compose backend with the [Alfresco Docker Installer as instructed](https://github.com/Alfresco/alfresco-docker-installer#installation). After installation, the deployment should start with
```´
docker-compose up --build
```
and the urls can be tested which are:

```
http://localhost:80  Alfresco Content App
http://localhost:80/alfresco 
http://localhost:80/share
```

If everything worked, just shut down the deployment with:
```
docker-compose down
```
The next section explains how the share or repo Amp / Jar can be integrated into the image.

# Customize Share and Repo Images
Now it is time to pour the share and repo modifications into the image using Amps or Jars. Ideally, the freshly compiled Amps / Jars from the target folder should be used for this. The easiest way is that we move the Dockerfile from docker/alfresco to repo/ and docker/share to share/. This allows Docker to access the target directory there when building the image. Now simply set the instruction in the repo and share Dockerfile that the Amps / Jars are copied from the target folder into the image, such as here:

```
COPY modules/Amps $TOMCAT_DIR/Amps
COPY modules/Jars $TOMCAT_DIR/webapps/alfresco/WEB-INF/lib

COPY target/myAmp-62-repo-1.0-SNAPSHOT.Amp $TOMCAT_DIR/Amps/myAmp-62-repo-1.0-SNAPSHOT.Amp
```

Now the docker/docker-compose.yaml file has to be changed and the directories for the repo and share image have to be adjusted. In my setup it looks like this for repo:

```
context: ./../repo
```

And that for Share:

```
context: ./../share
```

# Amps / Jars for ACS 5.2
If you want to test Amps or Jars for an ACS 5.2 deployment like me, there are a few difficulties. It may happen that the dependencies used for the 5.2 Amp / Jar are no longer compatible with the ACS Docker Deployment. It will be noticed that errors are thrown at the booting time of ACS. The first step is to find out which dependencies (usually Jar files on the Tomcat classpath) are causing the problem. It is then recommended to create a Maven profile dedicated for the 6.2 Amp, which then reloads the dependencies with the correct version.

Then the conflicted dependency must be also deleted in the Dockerfile. Don't be discouraged, it can be hair-raising and time-consuming! For me it looked something like this:
```
ARG POI_V = 4.0.1
RUN rm -f $ TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/poi-$ {POI_V}.Jar
RUN rm -f $ TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/poi-ooxml-${POI_V}.Jar
RUN rm -f $ TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/poi-scratchpad-${POI_V}.Jar

ARG TIKA_V = 1.21-20190624
RUN rm -f $ TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/tika-core-${TIKA_V}-alfresco-patched.Jar
RUN rm -f $ TOMCAT_DIR/webapps/alfresco/WEB-INF/lib/tika-parsers-${TIKA_V}-alfresco-patched.ja
```

The Amp / Jar built with the 6.2 profile can then be used for testing. But be careful for the 5.2 deployment, the Amp / Jar must be used without the 6.2 profile, otherwise there can be other dependency problems!

# Summary
Amps and Jars are still the most popular method of customizing ACS and Share. Testing them locally does not have to be life consuming when using Docker. I hope I could animate you to give Docker a try for your extensions in the future. If so, please write me your experience :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>