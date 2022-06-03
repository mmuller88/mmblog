---
title: Alfresco trifft Let's Encrypt
description: Companion Image für Docker Compose
show: 'no'
date: '2020-05-30'
image: 'lets.png'
tags: ['de', '2020', 'acs', 'alfresco', 'docker', 'docker-compose', 'ssl', 'github-actions', 'postman']
engUrl: https://martinmueller.dev/alf-lets-encrypt-eng
pruneLength: 50
---

Hi Alfrescans.

Während des Alfresco Hackathons im Mai 2020 habe ich für den [Docker Alfresco Installer](https://github.com/Alfresco/alfresco-docker-installer) eine Docker Companion Erweiterung implementiert, um SSL Zertifikate zu verwalten. Diese können dann für eine HTTPS Verbindung genutzt werden. Die SSL Zertifikate werden dabei von [Let's Encrypt](https://letsencrypt.org/de/) ausgestellt und regelmäßig erneuert. Let's Encrypt dient dabei auch als Autorisierer der Zertifikate. Ziemlich cool oder? Somit muss ich mir weniger Gedanken machen über eine sichere, verschlüsselte und maintainte Verbindung zu meinem Alfresco Proxy.

Leider wurde der Pull Request abgelehnt, weil der Docker Alfresco Installer im Fokus Demo und Trial bleiben soll. Um aber dieses tolle Feature euch nicht vor zu enthalten sowie einfacher zugänglich zu machen, habe ich mich entschlossen es in meinem GitHub Repo zu implementieren und es euch hier zu präsentieren. Zusätzlich habe ich automatisierte Tests geschrieben welche die noch recht neue Build Engine GitHub Actions nutzen, um das Let's Encrypt Docker Companion zu testen. In den nächsten Abschnitten erkläre ich die Erweiterung sowie die die automatisierten Tests.

# Docker Companion
Der Code für die Let's Encrypt Erweiterung ist bei [mir auf GitHub](https://github.com/mmuller88/alf-lets-encrypt). Das Docker Compose Deployment wird mit dem Script ./start.sh gestarted. Soll nun ein SSL Zertifikat von Lets Encrypt ausgestellt werden, benötigst du einen Server auf dem das Docker Compose Deployment ausgeführt wird und eine Domaine die auf diesen Server umleitet. Ich selber habe dafür EC2 VM von AWS genommen und dann einach einen CNAME Record erstellt welche von meiner Domain auf den Public DNS Name von der EC2 VM zeigen. Der CNAME Record sieht dan in etwas so aus:

```
a.notreal.net. CNAME ec2-3-8-139-83.eu-west-2.compute.amazonaws.com
```

Das Alfresco Docker Compose Deployment kann dann folgendermaßen gestarted werden:

```BASH
./start.sh -spr https -sh a.notreal.net -sp 443
```

Somit wird das gesamte ACS Docker Compose Deployment spezifisch auf https und der Domain a.notreal.net umgestellt. Das Docker Compose Deployment könnte auch ohne die Nutzung des ./start.sh Scripts gestartet werden. Allerding müssten dann die Variablen im Docker Compose File richtig gesetzt werden!

Die SSL spezifischen Anpassungen im Docker Compose File umfassen dabei nur die drei nochfolgenden Services:

```YAML
    ...
    proxy:
      image: nginx:alpine
      depends_on:
        - alfresco
        - solr6
        - share
        - content-app
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

Der erste Service mit namen **proxy** ist der Alfresco Proxy über welchen die Alfresco Applikationen wie Share oder Alfresco Content App erreichbar sind. Die beiden nachfolgenden Services bilden zusammen die Docker Companion Images für die SSL Zertifikateverwaltung mit Let's Encrypt.

# Testing
Ich hatte große Lust mal die neue Buildengine GitHub Actions auszuprobieren um die Ausstellung des SSL Zertifkates für die Domain a.notreal.com zu testen. Ich habe mir gedacht es müsste doch möglich sein die GitHub Action Runner nicht von GitHub selber laufen zu lassen, sondern auf AWS direkt. So könnte ich dann einach mittels des CNAME Records auf den Public DNS Name vom AWS Runner verweisen. Und ja das hat tatsächlich geklappt. Viel geholfen hat mir [dieser Blog Post von Lothar Schulz](https://www.lotharschulz.info/2019/12/09/github-action-self-hosted-runners-on-aws-incl-spot-instances/) wo genau beschrieben wird, wie ich AWS Ec2 VMs als GitHub Actions Runner verwenden kann. Mein GitHub Workflow sieht folgendermaßen aus:

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

Im Workflow File von GitHub Actions sehen wir das Alfresco gestarted wird mit der Domaine die über den CNAME Record auf den EC2 Runner zeigt. Durch die Ausführung von `start.sh` wird Alfresco gestarted und am Schluss die Erreichbarkeit geprüft. Jetzt sollten wir nur noch sicherstellen, dass auch die Indexengine Solr funktioniert. Mittels Newman, welches ein CLI Tool von Postman ist, wird ein Request mit anschließender Validierung als Test benutzt:

```
protocol=https
host=a.notreal.net
port=443
POST {{protocol}}://{{host}}:{{port}}/alfresco/api/-default-/public/search/versions/1/search
```

Dieses tested die Erreichbarkeit von Solr. Zum jetzigen Zeitpunkt sehe ich wenig Sinn in mehr Request Tests mit Postman. Es wäre aber kein Problem dieses zu einem späteren Zeitpunkt nachzuholen. Interessierst du dich mehr für die Möglichkeiten mit Postman? Vor einiger Zeit habe ich schon einen interessanten Artikel geschreiben bei dem ich auch [Postman verwende](https://martinmueller.dev/cdk-example)

# Zusammenfassung
Verschlüsselte Verbindungen zum Alfresco Proxy sind essenziell für eine Produktionsumgebung mit Alfresco. Es benötigt einen hohen manuellen Aufwand die dafür benötigten SSL Zertifikate zu erstellen, autorisieren und regelmäßig zu erneuern. Mit dem tollen und kostenlosem Angebot von [Let's Encrypt](https://letsencrypt.org/de/) lässt sich dieser Aufwand auf fast null reduzieren. Wenn ihr Kubernetes auch so spannend findet wie ich, könnte man darüber nachdenken kleine Let's Encrypt Charts zu erstellen, welche in einem Kubernetes Deployment verwendet werden können, um SSL Zertifikate Verwaltung auch in einem Cluster zu erreichen.

Falls ihr Let's Encrypt auch für eine Produktionsumgebung nutzt, bitte denkt darüber nach eine Spende and Let's Encrypt zu entrichten. Somit kann garantiert werden, dass dieser Service auch in Zukunft kostenlos bleibt. Ich bedanke mich für eure Aufmerksamkeit und hoffe auf reichliches Feedback :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

   