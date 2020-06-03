---
title: Alfresco meets Let's Encrypt
description: Companion Image for Docker Compose
date: '2020-05-30'
image: 'lets.png'
tags: ['eng', '2020', 'acs', 'alfresco', 'docker', 'docker-compose', 'ssl', 'github-actions', 'postman']
gerUrl: https://martinmueller.dev/alf-lets-encrypt
pruneLength: 50
---

Hi Alfrescans.

During the Alfresco Hackathon in May 2020 I implemented a Docker Companion extension for the [Docker Alfresco Installer](https://github.com/Alfresco/alfresco-docker-installer) to manage SSL certificates. These certificates can be used for HTTPS connections. The SSL certificates are issued and regularly renewed by [Let's Encrypt](https://letsencrypt.org/de/). Let's Encrypt also serves as the authorizer of the certificates. Pretty cool, right? So I don't have to worry about a secure, encrypted and maintained connection to my Alfresco proxy.

Unfortunately, the pull request was denied because the Alfresco Installer docker should remain in focus demo and trial. To make this feature more accessible for you, I decided to implement it into my GitHub repo and present it to you here. Additionally, I've written automated tests that use the new build engine GitHub Actions to test the Let's Encrypt Docker Companion. In the next sections I will explain the extension and the automated tests.

# Docker Companion
The code for the Let's Encrypt extension is at [me on GitHub](https://github.com/mmuller88/alf-lets-encrypt). The Docker Compose deployment is started with the script ./start.sh. If you want Lets Encrypt to request an SSL certificate, you need a server where Docker Compose Deployment is running and a domain that redirects to this server. I have taken EC2 VM from AWS and created a CNAME record which points from my domain to the Public DNS name of the EC2 VM. The CNAME record then looks something like this:

```
a.notreal.net. CNAME ec2-3-8-139-83.eu-west-2.compute.amazonaws.com
```

The Alfresco Docker Compose Deployment can then be launched as follows:

```BASH
./start.sh -spr https -sh a.notreal.net -sp 443
```

Thus the entire ACS Docker Compose Deployment is specifically switched to https and the domain a.notreal.net. The Docker Compose Deployment could also be started without using the ./start.sh script. However, the variables in the Docker Compose file would then have to be set correctly!

The SSL specific adjustments in the Docker Compose File only include the three following services:

```YAML
    ...
    proxy:
      image: nginx:alpine
      depends_on:
        - alfresco
        - solr6
        - share
        - content app
      volumes:
        # redirect Alfresco Apps to port 80
        - ./config/nginx.conf:/etc/nginx/nginx.conf
      environment:
        VIRTUAL_PORT: 80
        VIRTUAL_HOST: ${SERVER_HOST}
        LETSENCRYPT_HOST: ${SERVER_HOST}
        LETSENCRYPT_EMAIL: admin@${SERVER_HOST}


    nginx-proxy:
      image: jwilder/nginx-proxy
      ports:
        - "80:80"
        - "443:443"
      volumes:
        - "/etc/nginx/vhost.d"
        - "/usr/share/nginx/html"
        - "/var/run/docker.sock:/tmp/docker.sock:ro"
        - "/etc/nginx/certs"

    letsencrypt-nginx-proxy-companion:
      image: jrcs/letsencrypt-nginx-proxy-companion
      volumes:
        - "/var/run/docker.sock:/var/run/docker.sock:ro"
      volumes_from:
        - "nginx-proxy"
```

The first service called **proxy** is the Alfresco Proxy which is used to access Alfresco applications such as Share or Alfresco Content App. The following two services together form the Docker Companion Images for SSL certificate management with Let's Encrypt.

# Testing
I had a great desire to try out the new build engine GitHub Actions to test the issuance of the SSL certificate for the domain a.notreal.com I thought it should be possible to run the GitHub Action Runner directly on AWS instead of GitHub itself. I could then use the CNAME record to point to the Public DNS name of the AWS Runner. And yes, that actually worked. A lot of help was given to me [this blog post by Lothar Schulz](https://www.lotharschulz.info/2019/12/09/github-action-self-hosted-runners-on-aws-incl-spot-instances/) which describes exactly how I can use AWS Ec2 VMs as GitHub Actions Runner. My GitHub workflow looks like this:

```YAML
name: Test Deployment

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:

  linux-build:
    # runs-on: ubuntu-latest
    runs-on: self-hosted
    strategy:
      fail-fast: true

    steps:
    - name: Checkout
      uses: actions/checkout@v2.1.1
    - name: Setup Node.js environment
      uses: actions/setup-node@v1.4.2
    - name: Execute start.sh
      run: |
        mkdir -p data/solr-data
        mkdir -p logs/postgres
        sudo chown -R 33007 data/solr-data
        sudo chown -R 999 logs/postgres
        chmod +x start.sh && ./start.sh -spr https -sh a.notreal.net -sp 443
    - name: Docker Compose deployment has failed
      if: ${{ failure() }}
      run: |
        docker-compose config
        docker-compose logs
    - name: Execute Postman Tests
      run: |
        npx newman run test/alf-ec2.postman_collection.json -e test/alf-ec2.postman_environment.json -r cli,json --reporter-json-export tmp/newman/report.json
    - name: Postman has failed!
      if: ${{ failure() }}
      run: |
        echo "Postman Failed!"
        cat tmp/newman/report.json
        docker-compose config
        docker-compose logs
```

In the workflow file of GitHub Actions we see that Alfresco is started with the domain that points to the EC2 Runner via the CNAME record. By executing 'start.sh' Alfresco is started and at the end the availability is checked. Now we should just make sure that the index engine Solr is also working. Using Newman, which is a CLI tool from Postman, a request with subsequent validation is used as a test:

```
protocol=https
host=a.notreal.net
port=443
POST {{protocol}}://{{host}}:{{port}}/alfresco/api/-default-/public/search/versions/1/search
```

This tests the accessibility of Solr. At this time I don't see much point in more request tests with Postman. But it would be no problem to do this at a later time. Are you more interested in the possibilities with Postman? Some time ago I wrote an interesting article where I also [use Postman](https://martinmueller.dev/cdk-example).

# Summary
Encrypted connections to the Alfresco proxy are essential for a production environment using Alfresco. It requires a lot of manual effort to create, authorize and renew the required SSL certificates. With the great and free offer from [Let's Encrypt](https://letsencrypt.org/de/) this effort can be reduced to almost zero. If you find Kubernetes as exciting as I do, you might consider creating small Let's Encrypt charts which can be used in a Kubernetes deployment to achieve SSL certificate management in a cluster.

If you use Let's Encrypt for a production environment, please consider making a donation and Let's Encrypt. This way we can guarantee that this service will remain free in the future. Thank you for your attention and I hope for a lot of feedback :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>