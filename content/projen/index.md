---
title: Docker Hub release mit Projen
show: 'no'
date: '2021-02-02'
image: 'alps-u.png'
tags: ['de', '2021', 'projen', 'docker', 'nofeed']
engUrl: https://martinmueller.dev/projen-eng
pruneLength: 50
---

Hi Projen Freunde.

Projen wird mehr und mehr beliebter. Ich selber nutze es schon ca seit einem halbem Jahr und bin immer noch total begeistert. Kürzlich habe ich es so gar geschafft eine Docker Image Release Cycle nach Docker Hub damit zu bauen. Mein [Docker InfluxDB Repo](https://github.com/mmuller88/influxdb-s3-backup) pusht nun automatisch bei jedem release eine Image nach Docker Hub.

Was genau Projen ist und wie ich damit mein Projekt und Image Release Cycle manage, erkläre ich den nächsten Abschnitten.

# Projen
[Projen](https://github.com/projen/projen) erlaubt eine ausgeklügelte Verwaltung von Projektkonfiguration durch Code. Mit nur wenigen Zeilen TypeScript Code kann ein gesamtes Repository konfiguriert werden. Hierfür ein Beispiel:

```ts
const { JsiiProject } = require('projen');

const project = new JsiiProject({
  name: 'alps-unified-ts',
  authorAddress: 'damadden88@googlemail.com',
  authorName: 'Martin Mueller',
});

project.synth();
```

Diese wenigen Zeilen erzeugen alle GitHub Projektfiles die das Herz begehrt. Darunter die package.json, .gitignore, tsconfig.json und noch viele viele mehr.

Wirklich richtig cool ist das Projen auch mit GitHub Workflows kommt die z.B. neue Versionen publishen können nach Registries wie NPM oder PYPI. Für meinen Docker Image Release nach Docker Hub habe ich den Projen GitHub Release Workflow erweitert. Wie genau seht ihr im nächsten Abschnitt.

# Projen Setup

Nachfolgend seht ihr meine aktuelles Projen Setup welches in dem File .projenrc.js hinterlegt ist.

```ts
const { NodeProject, ProjectType, DockerCompose } = require('projen');

const project = new NodeProject({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'Martin Mueller',
  name: 'influxdb-s3-backup',
  releaseBranches: 'main',
  projectType: ProjectType.LIB,
});

project.releaseWorkflow.addJobs({
  publish_docker_hub: {
    needs: 'build',
    'runs-on': 'ubuntu-latest',
    env: {
      CI: "true",
    },
    'steps': [
      {
        name: 'Check out the repo',
        uses: 'actions/checkout@v2',
      },
      {
        name: 'Set up QEMU',
        uses: 'docker/setup-qemu-action@v1',
      },
      {
        name: 'Set up Docker Buildx',
        uses: 'docker/setup-buildx-action@v1',
      },
      {
        name: 'Login to DockerHub',
        uses: 'docker/login-action@v1',
        with:{
          username: '${{ secrets.DOCKER_USERNAME }}',
          password: '${{ secrets.DOCKER_PASSWORD }}',
        }
      },
      {
        name: 'get_version',
        id: 'get_version',
        run: [
          'DVERSION=$(jq .version version.json -r)',
          'echo "::set-output name=dversion::$DVERSION"',
          ].join('\n'),
      },
      {
        name: 'Build and push',
        uses: 'docker/build-push-action@v2',
        with: {
          context: '.',
          file: './Dockerfile',
          platforms: 'linux/amd64,linux/arm64',
          push: true,
          tags: 'damadden88/influxdb-s3-backup:${{ steps.get_version.outputs.dversion }},damadden88/influxdb-s3-backup:latest'
        }
      },
    ],
  }
})

project.synth();

```

## NodeProject

Meine Projen Projekt ist vom Typen NodeProject:
```ts
const { NodeProject, ProjectType, DockerCompose } = require('projen');

const project = new NodeProject({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'Martin Mueller',
  name: 'influxdb-s3-backup',
  releaseBranches: 'main',
  projectType: ProjectType.LIB,
});
```

Das bedeuted, dass es ein typisches node deployment ist, welches nodejs als environment benötigt und zusätzliches Libaries sowie Projektinformationen in der package.json enthält. Dazu kommt noch dass Node Projekte eine Changelog.md, welches alle Änderungen seit dem letzten Release auflisten können, kommt. 

Außerdem besitzt es einen GitHub Release Workflow welches mittels GitHub Actions automatisch GitHub releases macht bei commits und dabei die [semver](https://semver.org) befolgt. Ich habe nun eben genau diesen release Workflow erweitert um auch Docker Images nach Docker Hub pushen zu können in der gleichen Tagversion wie sie auch während des GitHub Releases gemacht wird. Um den Release Workflow zu erweitern habe ich das releaseWorkflow Objekt folgendermaßen erweitert:

```ts
project.releaseWorkflow.addJobs({
  publish_docker_hub: {
    needs: 'build',
    'runs-on': 'ubuntu-latest',
    env: {
      CI: "true",
    },
    'steps': [
      {
        name: 'Check out the repo',
        uses: 'actions/checkout@v2',
      },
      {
        name: 'Set up QEMU',
        uses: 'docker/setup-qemu-action@v1',
      },
      {
        name: 'Set up Docker Buildx',
        uses: 'docker/setup-buildx-action@v1',
      },
      {
        name: 'Login to DockerHub',
        uses: 'docker/login-action@v1',
        with:{
          username: '${{ secrets.DOCKER_USERNAME }}',
          password: '${{ secrets.DOCKER_PASSWORD }}',
        }
      },
      {
        name: 'get_version',
        id: 'get_version',
        run: [
          'DVERSION=$(jq .version version.json -r)',
          'echo "::set-output name=dversion::$DVERSION"',
          ].join('\n'),
      },
      {
        name: 'Build and push',
        uses: 'docker/build-push-action@v2',
        with: {
          context: '.',
          file: './Dockerfile',
          platforms: 'linux/amd64,linux/arm64',
          push: true,
          tags: 'damadden88/influxdb-s3-backup:${{ steps.get_version.outputs.dversion }},damadden88/influxdb-s3-backup:latest'
        }
      },
    ],
  }
})
```

# Ausblick
* Properties auch als TypeScript properties wegen Dokumentation

# Zusammenfassung
Ich habe das Projen Framework lieben gelernt, da es tolle Abstraktion und Vorgabe für ein Setup von Projekten ist. Ich lege dir ans Herz Projen mal einen Versuch zu geben und sehr bald wirst du die Schönheit dieses Frameworks selber erleben.

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>