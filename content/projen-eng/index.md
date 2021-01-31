---
title: Docker Hub release with Projen
date: '2021-01-31'
image: 'projen.png'
tags: ['de', '2021', 'projen', 'docker', 'nofeed']
gerUrl: https://martinmueller.dev/projen
pruneLength: 50
---

Hi Projen folks.

[Projen](https://github.com/projen/projen) is becoming more and more popular. I've been using it myself for about half a year now and I'm still totally hooked. Recently I even managed to build a Docker Image Release Cycle to Docker Hub with it. My [Docker InfluxDB Repo](https://github.com/mmuller88/influxdb-s3-backup) now automatically pushes an image to Docker Hub on every release.

What exactly Projen is and how I use it to manage my project and image release cycle, I'll explain in the next sections.

# Projen
[Projen](https://github.com/projen/projen) allows sophisticated management of project configuration through code. With just a few lines of TypeScript, an entire repository can be configured. Here is an example:

```ts
const { JsiiProject } = require('projen');

const project = new JsiiProject({
  name: 'alps-unified-ts',
  authorAddress: 'damadden88@googlemail.com',
  authorName: 'Martin Mueller'
});

project.synth();
```

These few lines create all the GitHub project files your heart desires. Among them the package.json, .gitignore, tsconfig.json and many many more.

What's really cool is that Projen also comes with GitHub workflows that can e.g. publish new versions to registries like NPM or PYPI. For my Docker image release to Docker Hub I extended the Projen GitHub release workflow. You can see how exactly in the next section.

# Projen Setup
Below you can see my current Projen setup which is stored in the file .projenrc.js.

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
My project is from type NodeProject:

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

This means that it is a typical node deployment, which requires nodejs as environment and contains additional libaries and project information in the package.json. In addition, Node projects come with a changelog.md which can list all changes since the last release.

It also has a GitHub release workflow which automatically makes GitHub releases on commits using GitHub Actions and follows the [semver](https://semver.org). I have now extended this release workflow to also push Docker images to Docker Hub in the same tag version as it is done during the GitHub release. To extend the release workflow I have extended the releaseWorkflow object as follows:

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

So this GitHub workflow releases my image to Docker Hub with the same tag version and latest:

```
tags: 'damadden88/influxdb-s3-backup:${{ steps.get_version.outputs.dversion }},damadden88/influxdb-s3-backup:latest'
```

New releases to GitHub and Docker Hub are now completely managed by Projen and commits to master are done automatically. This is extremely cool and saves me a lot of time :).

# Summary
I have come to love the Projen framework as it is a great abstraction and default for a setup of projects. I encourage you to give Projen a try and very soon you will experience the beauty of this framework yourself.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>