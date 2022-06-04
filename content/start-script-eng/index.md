---
title: Bash Script Contribution for the Alfresco Docker Installer
description: Project for OBJECT with Customizations
date: '2020-03-22'
image: 'owl.png'
tags: ['eng', 'alfresco', '2020', 'ecm', 'docker', 'docker-compose', 'yeoman']
gerUrl: http://martinmueller.dev/start-script
pruneLength: 50
---

Hi Alfrescans,

I made great experiences in my last project with the [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer). You can read more about it in my previous [blog post](http://martinmueller.dev/alfresco-docker-installer-eng). Now I am of course excited to add valuable new features to it. One of them is the Start Script which can be used as a wrapper for the Docker Compose File. In my previous Alfresco Docker Compose projects I always implemented this script because it offers some nice additional functionality. The next section explains what these are.

# Features
The most important feature is probably the built-in wait routine. This waits until ACS has finished booting. This is very useful, for example, if you want to run tests after starting ACS with tools like Postman. Data can also be pushed to ACS with the REST API when ACS finished booting. The wait routine is implemented with NPM's [wait-on](https://www.npmjs.com/package/wait-on). It makes sense to use the wide range of tools in the public NPM repository, because I then do not have to implement them myself and they are usually well tested.

The next feature is particularly important to me since I am working with Windows. If you try to run Docker Compose with Windows you may get a problem with defined volumes, since they do not support the Windows Path spelling ootb. Fortunately, the Docker Compose Community has provided a solution. Simply set the following environment variable before starting Docker Compose:

```
export COMPOSE_CONVERT_WINDOWS_PATHS = 1
```

This is now done beforehand if you start the start script with the -wp flag.

The next features have not yet made it into the Alfresco Docker Installer, but this could change soon. I personally use them a lot in my deployments. It is possible to set the host IP and host port dynamically with the start script using -hi and -hp. I find this very practical when you are in environments that change their IP more often like for example your laptop. At the moment, however, the installer solves this by asking for the host IP and host port during installation. So it is already configurable but only during the installation.

More features are possible but are not currently implemented. E.g. Loading test data with the REST API. In my [ADF AI prototype](http://martinmueller.dev/adf-app-eng) I also have a -b for build the Angular Webapp and an -aca so that only the ACA container is redeployed for fast development with the Ensure ACA web app. In the next section, I will show you how exactly I contributed the Start Script.

# Contribution
First, a fork should be created by the [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer). Than you make your changes to your fork. In my case it is the start script with the file name start.sh. I saved the script in template/scripts directory and configured the Yeoman setup that the script can optionally be added, very similar to how the LDAP service is added. All changes should be saved to your fork in the form of a remote branch. To do this, a local branch must first be created and changes pushed:

```
git branch startscript
git add --all
git commit -m "added startscript"
git push -u origin HEAD: startscript
```

Once all changes have been made and extensively tested, a pull request to the Alfresco Docker Installer Repository can be created. To do this, simply go to the Installer Github page. A Create Pull Request button will appear there.

Oh yeah one thing more. If you planning to contribute a new feature it would be very nice and best practice to add a test which tests the new feature as well. I did that in the .travis file which now tests the deployment and start of Alfresco with and without the new start script. With that it ensures it can work both ways.

# Outlook
Next I would like to provide Alfresco's new Alfresco Identity Management Service, also called AIMS, as a contribution. For this, a Keycloak container is added and the Alfresco properties are adjusted. AIMS only makes sense if you also have an identity provider. So AIMS should only be added if LDAP is selected during installation.

# Summary
This article describes a brief overview of my first contribution to the Alfresco Docker Installer. I already use the Installer for my projects a lot and contributing to it gave me the perfect opportunity to understand the Yeoman template installer better. The Start Script offers many new additional functionalities. How to do such a contribution has also been described. Do you also have a great idea how to improve the installer? I'm looking forward to hear about it.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>