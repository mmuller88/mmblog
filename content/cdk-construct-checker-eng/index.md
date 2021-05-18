---
title: AWS CDK Custom Construct Versions Checker
date: '2021-05-18'
image: 'version-prs.png'
tags: ['ger', '2021', 'projen', 'cdk', 'aws', 'construct'] #nofeed
gerUrl: https://martinmueller.dev/cdk-construct-checker
pruneLength: 50
---

Hi CDK Fans!

With Custom Constructs it is possible to implement certain features as Level 2 AWS CDK Constructs. In fact, many of the AWS CDK Constructs already in use are already Level 2 Constructs. I have already built some custom constructs. There is the [Build Badge](https://github.com/mmuller88/aws-cdk-build-badge) and the [Staging Pipeline](https://github.com/mmuller88/aws-cdk-staging-pipeline).

As we all know AWS CDK iterates very fast and a new version is released basically weekly. With each release there is a risk that my custom constructs are not compatible with the released CDK version. Therefore, I have developed a GitHub workflow that automatically tests the compatibility of my custom constructs against the new version.

In the next sections I will explain how the compatibility check works and how I implemented it.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) is an open source framework for creating and managing AWS resources. Using languages familiar to the developer such as TypeScript or Python, the Infrastructure as Code is described. In doing so, CDK synthesizes the code into AWS Cloudformation Templates and can optionally deploy them right away.

AWS CDK has been experiencing a steady increase in enthusiastic developers since 2019 and already has a strong and helpful community that is very active on [Slack](https://cdk-dev.slack.com), for example. There is of course much more to say about AWS CDK and I recommend you explore it. Drop me a line if you have any questions.

In the next section I explain how the compatibility check works with the AWS CDK version.

# Compatibility check
Once a day a GitHub workflow, here called version checker, curls to the page https://github.com/aws/aws-cdk and extracts the latest released CDK version. Then the version checker creates a branch in the name pattern bump/1.X.X . So when version 1.103.0 was released recently, the version checker created the branch bump/1.103.0 . Then the version checker creates a pull request against master. The pull request now contains the new CDK version. This is achieved by the version checker making a string replace in the .projenrc.js file. For example:

```ts
const cdkVersion = '1.97.0';
```

replaced with

```ts
const cdkVersion = '1.103.0';
```

Now a normal build is performed but with a new CDK version. The build and unit tests checks the compatibility with the CDK dependencies automatically. The use of the version checker requires a good unit testing strategy. Lambda code testing could look like that e.g.:

```ts
import * as AWS from '../__mocks__/aws-sdk';
import { handler } from '../src/index.badge';

const codebuild = new AWS.CodeBuild();

describe('test index.badge.ts lambda', () => {
  describe('failure when', () => {
    test('queryStringParameters.projectName is not existing', async () => {
      mockedApiEvent.queryStringParameters.projectName = undefined;
      await handler(mockedApiEvent).catch((reason: any) => {
        console.log(`reason: ${reason}`);
        expect(JSON.stringify(reason)).toContain('projectName in query parameter is not existing or empty!');
      });
    ...
```

and the expected synthesized cloudformation templates tests can look like this:

```ts
import { SynthUtils } from '@aws-cdk/assert';
import * as core from '@aws-cdk/core';
import { BuildBadge } from '../src';
import '@aws-cdk/assert/jest';


describe('Get', () => {
  describe('BuildBadge', () => {
    const app = new core.App();
    const stack = new core.Stack(app, 'testing-stack');

    describe('successful', () => {
      test('with not defined hideAccountID', () => {
        new BuildBadge(stack, 'BuildBadge1');
        expect(stack).toHaveResourceLike('AWS::ApiGateway::Method');
        expect(stack).toHaveResourceLike('AWS::Lambda::Function');
        expect(JSON.stringify(SynthUtils.toCloudFormation(stack))).toContain('\"ACCOUNT\":\"123\"');
      });
      test('with hideAccountID = "no"', () => {
        new BuildBadge(stack, 'BuildBadge2', { hideAccountID: 'no' });
        expect(stack).toHaveResourceLike('AWS::ApiGateway::Method');
        expect(stack).toHaveResourceLike('AWS::Lambda::Function');
        expect(JSON.stringify(SynthUtils.toCloudFormation(stack))).toContain('"ACCOUNT\":{\"Ref\":\"AWS::AccountId\"}');
      });
      ...
```

These examples were copied from my [Build Badge](https://github.com/mmuller88/aws-cdk-build-badge) Construct.

# Versionschecker - GitHub Workflow
The version checker is a GitHub workflow and is run daily at 4 o'clock.

```yaml
name: cdkversioncheck
on:
  schedule:
    - cron:  '0 4 * * *'
  # push:
  #   branches:
  #     - master

jobs:
  check:
    runs-on: ubuntu-latest
    env:
      CI: "false"
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      # - name: Set CDK version manually
      #   run: |-
      #     echo "CDK_VERSION=1.99.0" >> $GITHUB_ENV
      - name: Fetch CDK version
        run: |-
          echo "CDK_VERSION=$(curl --silent "https://api.github.com/repos/aws/aws-cdk/releases/latest" |
          grep '"tag_name": "1' |
          sed -E 's/.*"([^"]+)".*/\1/')" >> $GITHUB_ENV
      - name: Synthesize project files
        continue-on-error: true
        run: |-
          yarn add projen
          echo "${{ env.CDK_VERSION }}"
          sed -i "3s/.*/const cdkVersion = '${{ env.CDK_VERSION }}';/" .projenrc.js
          npx projen
      - name: Set git identity
        run: |-
          git config user.name "Auto-bump"
          git config user.email "github-actions@github.com"
      - name: Push branch
        run: |- 
          git checkout -b bump/${{ env.CDK_VERSION }}
          git diff --exit-code || ((git add package.json yarn.lock .projen/deps.json .projenrc.js) && (git commit -m "Testing CDK version to ${{ env.CDK_VERSION }}" && git push -u origin bump/${{ env.CDK_VERSION }}))
      - name: pull-request
        uses: repo-sync/pull-request@v2
        with:
          source_branch: bump/${{ env.CDK_VERSION }}
          pr_title: Testing CDK version to ${{ env.CDK_VERSION }}
          pr_label: "cdk-version-test"  
          destination_branch: "master"
          github_token: ${{ secrets.PUSHABLE_GITHUB_TOKEN }}
    container:
      image: jsii/superchain
```
The curl for the version number only accepts v1.X tags. v2.X is by design not compatible with my CDK stacks. So the PR would always fail.

It would also be possible to test manually against specific versions. For this some lines of code have to be commented out or in. E.g. for manual triggering the push master must be commented. Also the action to curl the CDK version must be commented out and the CDK version action above it must be commented in.

# Tested Versions List
I had the cool idea to create a list of the already tested CDK versions. Simply the created pull requests are provided with the previously created label **cdk-version-test**.

```yaml
- name: pull-request
  uses: repo-sync/pull-request@v2
  with:
    source_branch: bump/${{ env.CDK_VERSION }}
    pr_title: Testing CDK version to ${{ env.CDK_VERSION }}
    pr_label: "cdk-version-test"  
    destination_branch: "master"
    github_token: ${{ secrets.PUSHABLE_GITHUB_TOKEN }}
```

Then you can simply link to a filter with the label like https://github.com/mmuller88/aws-cdk-build-badge/pulls?q=is%3Apr+is%3Aopen+label%3Acdk-version-test . And voila all PRs for the version test are displayed.

![pic](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-construct-checker/versions.png)

# Summary
AWS CDK is still the perfect framework for Infrastructure as Code in AWS. With my Custom Constructs I hope to give back to the community. To ensure the best experience at all times, I have developed a workflow that checks CDK version compatibility. Creating the workflow was a lot of fun. But even more fun is to have a PR list where I can see if the version checks worked. I have more exciting CDK topics in my forum: https://martinmueller.dev/tags/cdk

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>