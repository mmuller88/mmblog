---
title: Build an ADF App from Scratch
description: For a project at OBJECT I build an app based on ADF and ACA
show: 'no'
date: '2020-03-01'
image: 'robot.png'
tags: ['eng', 'alfresco', 'ai', '2020', 'ecm', 'adf', 'prototype', 'aca', 'object']
gerUrl: https://martinmueller.dev/ADF-App/
pruneLength: 50
---

Good day

As mentioned in the previous [Blog Post](https://martinmueller.dev/First-Week-Object/), I am working on an exciting AI prototype which uses ACS Community as a content management system. In addition, certain AI services are running and performing certain AI actions using the ACS interface such as CMIS and REST. Unfortunately, I have to remain unclear here to protect company secrets. So I am allowed to say [OBJECT](https://www.object.ch) and the partner company are planning a webinar where, among other things, this prototype will be shown. Back to the topic! We chose [ADF](https://www.alfresco.com/ecm-software/application-development-framework) for the webapp.

In the next chapters I will explain how to create an ADF webapp project and how to change it. That shouldn't differ whether you are working with Windows 10, MacOS or Linux. I myself like all three operating systems.

# This is Required

You should install [Docker](https://docs.docker.com/install/), [Docker Compose](https://docs.docker.com/compose/install/), [NPM](https://www.npmjs.com/get-npm) and [YARN](https://yarnpkg.com/lang/en/docs/install/). I needed YARN because I am working on a Windows laptop and YARN is able to convert the Windows Paths into Unix Paths. Watch out at Docker! The standard installation at Docker only allows the use of 2 GB RAM for the Docker Compose Deployments, which is far too little for ACS Community and the other services! For this you need at least 10 GB and for ACS Enterprise at least 12 GB. Preferably more! In addition, if you want to set up your own amps, jars or other customizations for ACS deployment, I recommend installing Java and Maven.

# Prepare the Git repository

I use the [ACA Git Repository](https://github.com/Alfresco/alfresco-content-app) as the base for the prototype. Firstly it has already integrated many [ADF Component and API Libaries](https://github.com/Alfresco/alfresco-ng2-components) and secondly it provides a shell that uses the ACS backend quite extensively. In addition, it will be easy to import updates from the ACA repository into my webapp. And pretty cool, I can directly contribute back.

Now lets start with the Git repository. For me, the choice was a private Git repository in our [OBJECT](https://www.object.ch) GitLab. In your case, maybe you can take a public Git repository. The further instructions will not change regarding of choosing a private or public ones.

As mentioned earlier, I would like to be able to import updates from the ACA repository without any problems. In addition, of course, I want to reuse as much of the ACA repository as possible. I therefore chose [Git's submodules](https://git-scm.com/docs/git-submodule). With that I am able to contribute back easily. I created a fork from the ACA repo https://github.com/mmuller88/alfresco-content-app. I advise you to do the same. Then simply switch to the project directory and load the fork as submodule:

```
git submodule add https://github.com/<USER>/alfresco-content-app
```

The following command may also be useful to update the submodules, which in this case is only ACA:

```
git submodule update --init --remote
```

I needed it because I changed the branch in the .gitmodules file to apply my fix branch.

# Start ACA

We can test if the Docker Compose Deployment starts in the alfresco-content-app folder. In my previous position as a full stack developer at Alfresco I had the opportunity to work a lot with this ACA repository.

The following commands are required to start ACA Deployment:

```
yarn install
```

To load the necessary node dependencies.

```
yarn run build
```

For creating the ADF webapp in the dist/app directory. The command also creates the ADF extensions with the names @alfresco/aca-shared and @alfresco/adf-office-services-ext. As an early objective, the goal will be to write your own extension for your own ADF webapp. This has practical reasons such as modularization and distribution.

The start.sh in the ACA directory is a sophisticated script. You should preferably use it to start the deployment. The individual parameters can be queried with the -h or --help flag. For my Windows laptop I have to use these parameter configuration:

```
.\start.sh -wp -hi 192.168.0.237
```

The -wp flag converts the Linux file paths to Windows file paths and -hi stands for Host IP and transfers the IP of the computer to the deployment. If everything is all right the following addresses should be available:

```
http://localhost:8080/alfresco/   ACS
http://localhost:8080/content-app/   ACA Webapp
http://localhost:8080/share/   Good old Share
```

When I started writing this article I got a strange error because of the GoogleDocs module on my Windows PC. I'm sure I didn't get it on my MacBook. I confidently ignore this error. If you dear reader, however, knows why, I would be happy to receive a private message with an explanation.

To cleanly shutdown the deployment simply use the following command:

```
.\start.sh -d
```

The stop and delete all containers that were started using start.sh. You will need to delete and start the deployment again to apply changes from the dist/app webapp. Alternatively you can use the -aca flag for the start.sh script as that only redeploys the webapp container.

# Adjust the Deployment

This and the next section is probably the most difficult and requires a lot of patience. So far it was easy because we just took existing code that was already configured and tested by other developers. Now we have to do it ourselves, because we want to be able to integrate customizations like our own extension. So, grab a coffee, or like in my case a tea and get ready!

To manipulate the Docker Compose Deployment, I copied all direct Docker related files from the ACA folder into the project folder. This includes, for example, **docker-compose.yaml**, **start.sh**, **Dockerfile** and the **docker** folder. It would now be advisable to test whether your Docker Compose Deployment is still working. Maybe just copy the ADF webapp in the alfresco-content-app/dist/app folder into the project dist/app folder and start the deployment with start.sh script. I described how to do this in the previous chapter.

Now comes the most difficult part, at least that's how it was for me. You now have to copy the Angular related files into the project folder and configure them so that they use the components from alfresco-conten-app/src. In my case it was the following files:

```
src\app\extensions.module.ts
src\assets\app.extensions.json
src\app.config.json
src\tsconfig.app.json
```

I don't want to pretend here, the correct setting of the configuration actually took me two days. When I got stuck, I looked for advice from the wonderful [ADF Community in Gitter](https://gitter.im/Alfresco/content-app). The boys and girls understand their craft. Special thanks to my friend and ex-colleague [Bogdan](https://twitter.com/pionnegru).

Now it is time to let Angular compile the dist/app folder yourself instead of just copying it from the aca project. If you have managed to make Docker Compose Deployment successful with the web app compiled in the parent folder in the dist folder, you can finally start customizing :)!

# Create an Extension

Wohoo! You actually made it this far. To build a new extension, the following command is recommended:

```
ng generate library my-ext
```

I would highly recommend adding -ext to the extension name to make it more distinguishable from the webapp itself. In my project they have the same names, except that I added -ext to the extension. What you do now with the extension is totally open and there are many great Angular tutorials, pages or forums out there to help you.

If you want to test the webapp in between or at the end of your changes, you simply have to compile the ADF webapp and start the Docker Compose Deployment. This looks similar to what is explained in **Start ACA** section with the following commands:

```
yarn install
yarn run build
.\start.sh -wp -hi 192.168.0.237
```

Please don't forget that -wp is Windows specific. If you use MacOS or Linux you don't need this flag. You probably wouldn't even need -hi IP then.

# New ACA Update Available

As the [ACA Git Repository](https://github.com/Alfresco/alfresco-content-app) evolves at an incredibly fast rate, the question arises how we can integrate these updates into our ADF web app in just a few steps. So far I have not had to do that but basically these steps are mentioned:

1) The alfresco-content-app Git submodule must be updated.
2) The dependencies of the package.json file in the project folder must be synchronized with those in the alfresco-content-app/package.json

# Summary

Wow think about what we did here. We actually wrote our own ADF webapp which is based on ACA and can be easily updated at any time! For that we first had to create a new Git repo. Then integrate the ACA project as a submodule. Immediately afterwards we tested the Docker Compose Deployment in ACA. Then we rebuilt the repo so that we integrated our own Angular Extension into the ADF web app. That’s it! I hope you had fun and the article was helpful.

# Kudos

To [Eddie May](https://twitter.com/freshwebs) the new awesome Digital Community Manager from Alfresco for doing some English quality check and offering more feedback for coming posts :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

  