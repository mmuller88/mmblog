---
title: Alfresco's Kubernetes DBP with AWS EKS and Fargate for managing Pods
description: Dec 2019 I bought a house and extended it with a lot cool and cost saving smart home devices/
date: '2020-01-22'
image: 'aws.jpg'
tags: ['alfresco', 'aws', '2020', 'fargate', 'kubernetes']
pruneLength: 50
---

Hi AWS Fans.

On 3rd December 2019 AWS announced the general availability of Fargate for EKS (https://aws.amazon.com/blogs/aws/amazon-eks-on-aws-fargate-now-generally-available/). That unburdens the need of managing the infrastructure for the pods. In this short article I will give a quick run through about how to tweak Alfresco's DBP charts to make them Fargate ready!

# Alfresco's Kubernetes Deployment
Alfresco Kubernetes deployment or internally called the Alfresco DBP (https://github.com/Alfresco/alfresco-dbp-deployment) provides Kubernetes deployment. That deployment is managed by Helm https://helm.sh/ which is basically a packaging tools for all the Kubernetes configuration files. Alfresco DBP deployment itself consists of subcharts. On of those subcharts is the alfresco-content-services chart (https://github.com/Alfresco/acs-deployment/tree/master/helm/alfresco-content-services) which I will use to demonstrate the necessary changes for how to run pods in Fargate.

# Make the Alfresco Content Services Chart Fargate Ready
The smart guys from AWS decided to use Namespaces as a separation for which pods should be managed by Fargate. So the chart needs to have the functionality to change the Namespace ...

# Creating an EKS Cluster with Fargate support
The handy tool eksctl makes it an ease to create EKS cluster. eksctl.io/usage/fargate describes how to create an EKS cluster together with Fargateprofiles. I used the config file method for describing the cluster.

# Limitations
Unlucky stateful workloads, which require persistent volumes are not supported. In the case of the Alfresco DBP that is limiting the number of pods which can be shifted into the Fargate namespace.

# Summary
Using Fargate for managing the Pods is pretty awesome. I hope that I can do a cost calculation for comparing both ways of pods deploying. As well I hope that very soon AWS allows to mound a data volume like EFS.

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>