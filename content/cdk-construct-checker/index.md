---
title: AWS CDK Custom Construct Version Compatibility Checker
show: 'no'
date: '2021-05-16'
image: 'ddb-qs.jpg'
tags: ['de', '2021', 'projen', 'cdk', 'aws', 'construct', 'nofeed'] #nofeed
engUrl: https://martinmueller.dev/cdk-construct-checker-eng
pruneLength: 50
---

Hi CDK Fans!

Mit Custom Constructs ist es möglich gewisse Features als Level 2 AWS CDK Constructs zu implementieren. Tatsächlich sind viele der bereits verwendeten AWS CDK Construct bereits Level 2 Constructs. Ich habe bereits einige Custom Constructs gebaut. Da wäre die [Build Badge](https://github.com/mmuller88/aws-cdk-build-badge) und die [Staging Pipeline](https://github.com/mmuller88/aws-cdk-staging-pipeline).

Wie wir alle wissen iteriert AWS CDK sehr schnell und es wird quasi wöchentlich eine neue Version released. Bei jedem Release besteht die Gefahr, dass meine Custom Constructs nicht mit der releasten CDK Version kompatibel ist. Von daher habe ich einen GitHub Workflow entwickelt der automatisch die Kompatibilität meiner Custom Constructs gegen die neue Version testet.

In den nächsten Abschnitten möchte ich erklären wie der Kompatibilitätscheck funktioniert und wie ich ihn implementiert habe.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) ist ein Open Source Framework zu Erstellung und Verwaltung von AWS Ressourcen. Durch die Verwendung von dem Entwickler vertrauten Sprachen wie TypeScript oder Python wird die Infrastructure as Code beschrieben. Dabei synthetisiert CDK den Code zu AWS Cloudformation Templates und kann diese optional gleich deployen.

AWS CDK erfährt seit 2019 ein stetigen Zuwachs von begeisterten Entwicklern und hat bereits eine starke und hilfsbereite Community die z.B. sehr auf [Slack](https://cdk-dev.slack.com) aktiv ist. Es gibt natürlich noch viel mehr zu sagen über AWS CDK und ich empfehle euch es zu erforschen. Schreibt mir, wenn ihr Fragen habt.

Im nächsten Abschnitt erkläre ich wie de Kompatibilitätscheck mit der AWS CDK Version funktioniert.

# Kompatibilitätscheck
Einmal am Tag curlt ein GitHub Workflow, hier Versionschecker genannt, auf die Seite https://github.com/aws/aws-cdk und extrahiert die letzte releaste CDK Version. Dann erstellt der Versionchecker einen Branch im Namenpattern bump/1.XX.X . Als also kürzlichst die Version 1.103.0 releast wurde, erstellte der Versionschecker den Branch bump/1.103.0 . Dann erstellt der Versionchecker einen Pull Request gegen master. Der Pull Request beinhaltet nun die neue CDK Version. Das wird erreicht in dem der Versionschecker ein string Replace macht in der .projenrc.js File. Zum Beispiel wird:

```ts
const cdkVersion = '1.97.0';
```

ersetzt durch

```ts
const cdkVersion = '1.103.0';
```

Nun wird ein normaler Build aber mit neuer CDK Version durchgeführt. Der Build testet zu einem die Kompatibilität der CDK Interfaces bzw. dependencies und zum anderen werden die unit Tests automatisiert durchgeführt. Die Verwendung des Versionschecker bedingt also eine gute Unit Testingstrategie. Daher können getestet werden Lambda Code z.B.:

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

und die zu erwarteten synthetisierten Cloudformation Templates:

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

Diese Beispiele wurden aus meinem [Build Badge](https://github.com/mmuller88/aws-cdk-build-badge) Construct kopiert.

# Versionschecker - GitHub Workflow
Der Versionschecker ist ein GitHub Workflow und wird täglich um 4 Uhr ausgeführt.

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
          grep '"tag_name": "v1' |
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
Der curl für die Versionsnummer akzeptiert nur v1.X Tags. v2.X ist per Design nicht kompatibel mit meinen CDK Stacks. Der PR würde also immer fehlschlagen.

Es wäre auch möglich manuel gegen bestimmte Versionen zu testen. Dafür müssen einige Zeilen Code auskommentierten bzw. einkommentiert werden. Z.B. Zum manuellen Triggern muss der push master einkommentiert werden. Aucht muss die Action zum curlen der CDK Version auskommentiert und die darüber liegende CDK Version Action einkommentiert werden.

# Getestete Versions Liste
Mir kam dan noch die coole Idee zur Erstellung einer List von den bereits getesteten CDK Versionen. Es werden einfach die erstellten Pull Requests mit dem zuvor erstellten Label **cdk-version-test** versehen.

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

Dann kann einfach per Link auf einen Filter mit dem Label verwiesen werden wie z.B. https://github.com/mmuller88/aws-cdk-build-badge/pulls?q=is%3Apr+is%3Aopen+label%3Acdk-version-test) . Und tada es werden alle PRs zum Versionstest angezeigt.

![pic](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-construct-checker/versions.png)

# Zusammenfassung
AWS CDK ist nachwievor das optimale Framework für Infrastructure as Code in AWS. Mit meinen Custom Constructs hoffe ich der Community zurückzugeben. Um nun auch immer die beste Experience zu gewährleisten, habe ich einen Workflow entwickelt, der die CDK Versionskompatibilität überprüft. Den Workflow zu erstellen hat mir riesen Spaß gemacht. Noch toller ist jetzt aber eine PR Liste zu haben wo ich genau sehen kann ob die Versionschecks geklappt haben. Ich habe noch weitere spannende CDK Themen in meinem Forum: https://martinmueller.dev/tags/cdk

An die tollen Leser dieses Artikels sei gesagt, dass Feedback jeglicher Art gerne gesehen ist. In Zukunft werde ich versuchen hier eine Diskussionsfunktion einzubauen. Bis dahin sendet mir doch bitte direkten Feedback über meine Sozial Media accounts wie [Twitter](https://twitter.com/MartinMueller_) oder [FaceBook](https://www.facebook.com/martin.muller.10485). Vielen Dank :).

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>