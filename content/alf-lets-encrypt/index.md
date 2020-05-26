---
title: Alfresco Let's Encrypt Docker Companion Erweiterung
show: 'no'
description: Companion Image für Docker Compose
date: '2020-05-30'
image: 'lets.png'
tags: ['de', '2020', 'acs', 'alfresco', 'docker', 'docker-compose', 'ssl', 'github-actions']
engUrl: https://martinmueller.dev/alf-lets-encrypt-eng
pruneLength: 50
---

Hi Alfrescans.

Während des Alfresco Hackathons im Mai 2020 habe ich für den [Docker Alfresco Installer](https://github.com/Alfresco/alfresco-docker-installer) eine Docker Companion Erweiterung implementiert, um SSL Zertifikate zu verwalten welche dann genutzt werden können für HTTPS Verbindungen, entwickelt. Die SSL Zertifikate werden dabei von [Let's Encrypt](https://letsencrypt.org/de/) ausgestellt und regelmäßig erneuert. Let's Encrypt dient dabei auch als Autorisierer der Zertifikate. Ziemlich cool oder? Somit muss ich mir keine Gedanken mehr machen über eine sichere und verschlüsselte Verbindung zu meinem Alfresco Proxy.

Leider wurde der Pull Request abgelehnt. Um aber dieses tolle Feature euch einfacher zugänglich zu machen, habe ich mich entschlossen es einfach in meinem GitHub Repo zu implementieren und es euch hier zu präsentieren. Zusätzlich habe ich automatisierte Tests geschrieben welche die noch recht neue Build Engine GitHub Actions nutzen, um das Let's Encrypt Docker Companion zu testen. In den nächsten Abschnitten erkläre ich die Erweiterung sowie die die automatisierten Tests.

# Docker Companion
Der Code für die Let's Encrypt Erweiterung ist bei [mir auf GitHub](https://github.com/mmuller88/alf-lets-encrypt). Das Docker Compose Deployment wird mit dem Script ./start.sh gestarted. Soll nun ein SSL Zertifikat von Lets Encrypt ausgestellt werden benötigst du einen Server auf dem das Docker Compose Deployment ausgeführt wird und eine Domaine die auf diesen Server umleitet. Ich selber habe dafür EC2 VM von AWS genommen und dann einach einen CNAME Record erstellt welche von meiner Domain auf den Public DNS Name von der EC2 VM zeigen. Der CNAME Record sieht dan in etwas so aus:

```
a.notreal.net. CNAME ec2-3-8-139-83.eu-west-2.compute.amazonaws.com
```

Das Alfresco Docker Compose Deployment kann dann folgendermaßen gestarted werden:
```BASH
./start.sh -spr https -sh a.notreal.net -sp 443
```

Somit wird das gesamt ACS Docker Compose Deployment spezifisch auf https und der domain a.notreal.net umgestellt.

# Testing
Ich hatte große Lust mal die neue Buildengine GitHub Actions auszuprobieren um die Ausstellung des SSL Zertifkates für die Domain a.notreal.com zu testen. Ich habe mir gedacht es müsste doch möglich sein die GitHub Action Runner nicht von GitHub selber laufen zu lassen, sondern auf AWS. So könnte ich dann einach mittels des CNAME Records auf den Public DNS Name vom AWS Runner verweisen. Und ja das hat tatsächlich geklappt. Viel geholfen hat mir [dieser Blog Post](https://www.lotharschulz.info/2019/12/09/github-action-self-hosted-runners-on-aws-incl-spot-instances/) von Lothar Schulz wo genau beschrieben wird, wie ich AWS Ec2 VMs als GitHub Actions Runner verwenden kann. Dann kann der GitHub Workflow folgendermaßen ausgeführt werden:

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


GitHub Actions ...
Sub Domain ...

# Zusammenfassung
Verschlüsselte Verbindungen zum Alfresco Proxy sind essenziell für eine Produktionsumgebung mit Alfresco. Es benötigt einen hohen manuellen Aufwand die dafür benötigten SSL Zertifikate zu erstellen, autorisieren und regelmäßig zu erneuern. Mit dem tollen und kostenlosem Angebot von [Let's Encrypt](https://letsencrypt.org/de/) lässt sich dieser Aufwand auf fast null reduzieren. Falls ihr Let's Encrypt auch für eine Produktionsumgebung nutzt, bitte denkt darüber nach eine Spende and Let's Encrypt zu entrichten. Somit kann garantiert werden, dass dieser Service auch in Zukunft kostenlos bleibt. Ich bedanke mich für eure Aufmerksamkeit und hoffe auf reichliches Feedback :).

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>