---
title: IOT - Gasmeter goes digital
date: '2021-01-25'
image: 'gasmeter.jpeg'
tags: ['eng', '2021', 'nodered', 'raspberry', 'iot']
gerUrl: https://martinmueller.dev/nodered
pruneLength: 50
---
*Before it begins. Affiliates regarding the IOT devices are in the post*

Hi.

A few weeks ago I presented my new IOT deployment [here](https://martinmueller.dev/rasp4). It consists of a [Raspberry 4 DE](https://amzn.to/3a0Xjsd) [US](https://amzn.to/3iEHyuD) [UK](https://amzn.to/2Y8FOQZ), [Zigbee Türsensor DE](https://amzn.to/2KEqsAz) [UK](https://amzn.to/2MeSmDM) and the [Zigbee Empfäger DE](https://amzn.to/2Y4aq63) [UK](https://amzn.to/3pjZrSk). The software that runs on the Raspberry 4 is Docker Compose. With the Docker Compose deployment, [NodeRED](https://github.com/node-red/node-red) is used for IOT management. For the charts which you can see in the picture I use [Grafana](https://github.com/grafana/grafana).

First I want to explain how I made my analog gas meter digitally and then how I use NodeRED and Grafana to transform the received data and make it displayable in charts (see title image).

# Gas meter extension
As shown in the picture above right I have an analog gas meter BK-G4. So how do I turn it into a digital gas meter that can even store values over time? Well the meter sends a magnetic pulse every 0.01 qm of consumed gas. On the picture you can see this as 1 imp 0,01 qm. So if you also have a gas meter with magnetic pulse, the instructions here should also work for you.

I simply measure the magnetic pulse with the wireless [Zigbee door sensor](https://amzn.to/2KEqsAz) (also top right in picture) and send it to a [Zigbee receiver](https://amzn.to/2Y4aq63) which is connected to a [Raspberry 4](https://amzn.to/3a0Xjsd) [US](https://amzn.to/3iEHyuD) and record the values.

The recording is not that easy because the signal has to be transformed. The transformation of the signal is done with NodeRED.

# NodeRED
[NodeRED](https://github.com/node-red/node-red) is an open source programming tool for connecting IOT devices together, APIs and online services. It provides a web browser based editor and supports JavaScript as a programming language. The runtime itself is [Nodejs](https://en.wikipedia.org/wiki/Node.js).

I also find it very cool that NodeRED supports a connection to GitHub and the current state of the NodeRED project can be saved versioned using the Git protocol. NodeRED offers many other great features that you should definitely explore. But I only want to talk about the NodeRED Flow.

## NodeRED Flow
A NodeRED project can have several flows. A NodeRED Flow describes the interaction of the IOT devices with other devices, APIs or online services. You can see my flow in the upper left corner of the image. The flow is best read from left to right. On the far left are two inputs. The lower input is from an [Open Weather API](https://openweathermap.org/appid) that I use to collect the current outdoor temperature (also shown in yellow in the "Gas Delta" diagram).

The upper input is from my Zigbee receiver which gets the signal from the Zigbee door sensor. The Zigbee door sensor and receiver work with the so called MQTT protocol. MQTT is a data saving, publish and subscribe protocol mainly for communication between IOT devices.

On the right side of the flow you can see the outputs (a bit cut off). The blue output is a NodeRED UI element. NodeRED also offers the possibility to render UI elements with e.g. sensor values. This is then accessible e.g. at https://localhost:1880/ui . The brown outputs send data to an InfluxDB which is then displayed with Grafana.

# InfluxDB & Grafana
[InfluxDB](https://github.com/influxdata/influxdb) is an open source time series database . It is written in GO and optimized for fast, high availability storage and query of stored data. It is great for IOT data.

For my flow, I store the current gas value and temperature in InfluxDB. InfluxDB then calculates the timestamp on its own. Then I can simply use the graphical analysis tool [Grafana](https://github.com/grafana/grafana) to get the data from InfluxDB and display it flexibly (see diagrams in title image).

At the bottom right I see the current and yesterday's daily consumption. You can not see it in the picture because only yellow is displayed but I have set different colors for color ranges. From 0 - 7 qm is green. Then from 7 - 14 qm is yellow and everything above 14 qm is red. For a family of three the average daily consumption is about 7 qm, which varies by a factor of 2 at most in summer and winter. Extremely cool ^^.

At the very bottom left, the total consumption of the gas is displayed and above it how the consumption changes relatively over the day. A pretty cool feature of Grafana is that the time range can be changed comfortably. As default I have set "Today" which shows me all values from 0 to now. But there are other time ranges like yesterday, the day before yesterday, 12 hrs etc. Also start and end time can be entered directly. Extremely cool!

# InfluxDB AWS S3 Backup
In the meantime, I even added a data backup feature. With this I compress my InfluxDB data and store it in AWS S3. AWS S3 is a cheap long term cloud storage. I prefer this method because I don't have to buy external storage and can leave the physical management of the storage to AWS.

For backup, I built my own [Docker image and release](https://github.com/mmuller88/influxdb-s3-backup). This was necessary as there was no Docker Image on Docker Hub yet which supported InfluxDB + AWS CLI + arm64. I now consume these in my [rasp4 repo](https://github.com/mmuller88/rasp4) in docker-compose.yaml. Backup is done by default every morning at 1am.

# Outlook
Next I would like to digitallise my electricity meter to be able to read it as well and show nice charts.

I also want to migrate more IOT devices to NodeRED because I currently have some things running in the cloud with the app "Smart Life". But the functionality there is very limited. E.g. I can already turn my boiler on and off and I would like to be able to control that with NodeRED.

# Summary
If you have any cool ideas how to transform or visualize my sensor data to generate more useful information, let me know.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>