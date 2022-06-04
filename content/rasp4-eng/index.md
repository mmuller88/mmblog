---
title: Raspberry 4 IOT with AWS CDK Pipeline automated Deployment
date: '2021-01-02'
image: 'rasp.jpeg'
tags: ['eng', '2021', 'aws', 'raspberry', 'cdk']
gerUrl: https://martinmueller.dev/rasp4
pruneLength: 50
---

Hi Raspberry Friends.

Note: I have used commission links in this article and marked them with "*".

Since recently I can call myself owner of a Raspberry. On Cyber Monday I bought a *[Raspberry 4 with 4 GB](https://amzn.to/3rD3HOf). I have had previous experiences with Home IOT and summarized them in a [blogpost](https://martinmueller.dev/smart-home). However, these experiences were tied to ready-made IOT solutions and therefore give only a limited feature set. A good friend of mine, who has a lot of experience with Home IOT (Internet of Things), showed me what more is possible.

So I aimed for the next IOT level with building cool solutions using MQTT and NodeRED. My first use case is that I want to read the gas meter digitally and get nice evaluation graphics displayed in relation to time. On the internet I found a tutorial how to read my gas meter, digitally supported [BK-G4](https://forum.iobroker.net/topic/27960/gasz%C3%A4hler-bk-g4-auslesen-mit-zigbee-fensterkontakt). But this solution required a complex NodeRED deployment with the use of a Raspberry.

The Raspberry can be treated like a normal VM. That means it is loaded with an operating system like Ubuntu. Then necessary programs are installed and afterwards the NodeRED Deployment is executed. If needed, the VM can simply be thrown away and everything run again. This is a lot of manual steps which can be very time consuming and error prone.

Therefore, I decided to automate the entire deployment to a high degree using the following technologies GitHub, Docker, Docker Compose, AWS CodeDeploy Agent, AWS CodePipeline with CDK Pipeline. Basically, then all you need to do is push to the main branch and the entire Docker deployment builds and launches itself.

I will describe how this all works in the next sections.

# Setup

First, however, I would like to describe my setup. As mentioned before, I bought a Raspberry 4 (Rasp4 for short) with 4GB for Cyber-Monday *[https://amzn.to/3rD3HOf](https://amzn.to/3rD3HOf). Furthermore there was a 64GB microSSD in the set.

The installation of Ubuntu 20.04.1 was very easy and is very well documented on [ubuntu.com](https://ubuntu.com/download/raspberry-pi) . I chose the Ubuntu server because I want to use the Rasp4 as a headless remote VM.

To read the gas meter I needed two more components. A *[Zigbee door/window sensor](https://amzn.to/37Vsm8S) and a [Zigbee USB stick as receiver](https://amzn.to/3hrc7nd). The sensor sends a signal to the Zigbee receiver every time the meter measures 0.1 sq ft of gas consumption. This is a specific solution for my gas meter [BK-G4](https://forum.iobroker.net/topic/27960/gasz%C3%A4hler-bk-g4-auslesen-mit-zigbee-fensterkontakt). It may not be possible for your gas meter.

## Installation of the environment

The IOT programs are to be run using Docker Compose and deployed from my [GitHub Repo](https://github.com/mmuller88/rasp4) the Docker Compose YAML file. Furthermore, the Docker Compose deployment should be automatically rebuilt and redeployed as soon as something is pushed to the main branch.

To make all this possible many programs like Docker, Docker Compose, Git, AWS CLI, AWS CodeDeploy Agent etc, are needed. To simplify the installation of the required programs I created a script [./misc/init.sh](https://github.com/mmuller88/rasp4/blob/master/misc/init.sh). This is then simply executed on the Rasp4:

```
sudo chmod +x ./init.sh
./init.sh
```

Important to mention. The Rasp4 has only a one way internet connection. That means it has no public IP and is not reachable from outside. It is only reachable in the local network.

## Automated Deployment with AWS CodeDeploy & AWS CodePipeline

To reduce manual effort as much as possible, I decided to automate the Docker Compose deployment. For this I use an AWS CodeDeploy agent that automatically registers changes on the main branch and executes them on the Rasp4. The installation of the AWS CodeDeploy agent was a bit tricky but worked out in the end. The agent is also installed with the init.sh.

To have the agent perform actions on the Rasp4 when commits happen on the main branch, an AWS CodePipeline must be created. The AWS CodePipeline is configured and managed with [AWS CDK](https://github.com/aws/aws-cdk) . AWS CDK is an open source framework for creating and managing AWS resources using high level languages like TypeScript or Python. The AWS CDK code can also be found in my GitHub repo and [here](https://github.com/mmuller88/rasp4/blob/master/src).

If I made you curious about AWS CDK, you can find countless other blogposts about [AWS CDK](https://martinmueller.dev/tags/cdk) on my blog page.

## IOT Docker Compose Stack

My IOT stack consists of the following containers NodeRED, InfluxDB, Grafana, Mosquitto and Zigbee. The exact settings are in the [docker-compose](https://github.com/mmuller88/rasp4/blob/master/docker-compose.yml) file . I assembled the stack using the Docker Compose Builder from [IOTstack](https://github.com/gcgarner/IOTstack).

I recommend you use one of the forks from IOTstack as the user gcgarner doesn't seem to maintain the builder anymore.

# What did I enjoy the most?

Extremely cool was the easy installation of Ubuntu on my Rasp4. This even worked without an extra keyboard and monitor and is called remote installation. You just have to enter the wifi credentials during the image creation on the microSSD card. This simple process reminded me somehow of Docker images, which are also very light on their feet. Extremely cool!

It also happened a few times that I reloaded the entire OS to solve configuration issues. Since I had all the steps of the installation in init.sh, that was no problem.

Also, creating the AWS CodePipeline with AWS CDK was extremely cool. Since I already have a lot of experience with AWS CDK, it was very easy to do. Infrastructure as code is just great!

# Difficulties

Setting up the AWS CodeDeploy agent was very time consuming and annoying, as it only works with certain program versions of awscli or ruby. To this day I'm not sure why the agent always bitched so much. Well it works now and that's what counts.

# Outlook

I have already started with the NodeRED Flow and can successfully read out the Zigbee door sensor and increase the digital meter reading with every signal. What is missing now is feeding into InfluxDB and configuring Grafana to get nice evaluation graphs for desired time periods.

Also, in the future I want to work on even more exciting IOT stuff with cool use cases. I'm thinking about migrating some IOT processes from my Smart Life app to my NodeRED.

The Rasp4 itself offers even more possibilities than just being used as an IOT server. For example, I already use it as a DNS server with [Pi-Hole](https://github.com/pi-hole/pi-hole). With this it blocks e.g. nervice DNS queries like telemetry data or advertisements. For sure I will find more cool use cases for my Rasp4.

# Summary
IOT is an exciting topic. Ready-made solutions like Smart Life, Alexa and co are easy to install and promise early the desired success. However, such ready-made solutions are mostly very limited in functionality. So far, I have made good progress with Smart Life.

However, the task of reading the gas meter automatically has called for a more complex IOT solution with a Raspberry and NodeRED Flow. I described how this solution looks like here. I had an incredible amount of fun working on this IOT project and I am extremely grateful to my IOT buddy :D for spending the time to bring me closer to the IOT topic.

Did you find the article interesting or do you have any questions? Feel free to write me :) .

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>