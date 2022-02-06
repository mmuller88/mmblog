---
title: Deploy Lambda@Edge mit AWS CDK und TypeScript
show: 'no'
date: '2022-02-06'
image: 'title.png'
tags: ['de', '2022', 'aws', 'cdk'] #nofeed
engUrl: https://martinmueller.dev/cdk-lambda-edge-eng
pruneLength: 50
---

Moin,

Lambda@Edge sind Lambdas die in den AWS Cloudfront Locations ausgeführt werden. Somit kann die Performance erhöht und die Latency verringert werden im Vergleich zum normalen Lambda. Cloudfront zusammen mit Lambda@Edge lässt sich aber auch als Proxy für einen private S3 Asset Bucket verwenden.

Ein Token ausgestellt von Cognito dient dann der Lambda@Edge zu Validierung ob der Requester erlaubt ist auf das Asset im S3 Bucket zuzugreifen. Näheres darüber möchte ich im nächsten Blogpost beschreiben. Hier soll es darum gehen wie ein Lambda@Edge mit AWS CDK und Typescript erstellt werden kann.

## AWS CDK Lamda@Edge

Lambda@Edge gibt es bereits im CDK cloudfront package https://docs.aws.amazon.com/cdk/api/v1/docs/aws-cloudfront-readme.html . Leider ist es nicht direkt möglich den Lambda Code mit TypeScript zu schreiben und automatisch nach JavaScript zu transformieren so wie wir es bereits von der [NodejsFunction](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-lambda-nodejs.NodejsFunction.html) kennen.

Tja nicht mit mir! Ich hab mir mal die NodejsFunction und die EdgeFunction genauer angeschaut und die die TypeScript Funktionalität von NodejsFunction auf die EdgeFunction übertragen. Dabei definiere ich einfach ein CDK Construct welches von EdgeFunction extended und übernehme Funktionen und Properties von der NodejsFunction. Und hier ist der Code von meinem nodejs-edge-function.ts Construct:

```ts
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as core from '@aws-cdk/core';
import * as bundling from '@aws-cdk/aws-lambda-nodejs/lib/bundling';
import * as lambda from '@aws-cdk/aws-lambda';
import * as fs from 'fs';
import * as path from 'path';
import { BundlingOptions } from '@aws-cdk/aws-lambda-nodejs';
import { PackageManager } from '@aws-cdk/aws-lambda-nodejs/lib/package-manager';
import { callsites, findUpMultiple } from '@aws-cdk/aws-lambda-nodejs/lib/util';


/**
 * environment variables are not supported for Lambda@Edge
 */
export interface NodejsEdgeFunctionProps extends Omit<lambda.FunctionOptions, 'environment'> {
    /**
   * Path to the entry file (JavaScript or TypeScript).
   *
   * @default - Derived from the name of the defining file and the construct's id.
   * If the `NodejsFunction` is defined in `stack.ts` with `my-handler` as id
   * (`new NodejsFunction(this, 'my-handler')`), the construct will look at `stack.my-handler.ts`
   * and `stack.my-handler.js`.
   */
    readonly entry?: string;

    /**
     * The name of the exported handler in the entry file.
     *
     * @default handler
     */
    readonly handler?: string;

    /**
     * The runtime environment. Only runtimes of the Node.js family are
     * supported.
     *
     * @default Runtime.NODEJS_14_X
     */
    readonly runtime?: lambda.Runtime;

    /**
 * Whether to automatically reuse TCP connections when working with the AWS
 * SDK for JavaScript.
 *
 * This sets the `AWS_NODEJS_CONNECTION_REUSE_ENABLED` environment variable
 * to `1`.
 *
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html
 *
 * @default true
 */
    readonly awsSdkConnectionReuse?: boolean;

    /**
     * The path to the dependencies lock file (`yarn.lock` or `package-lock.json`).
     *
     * This will be used as the source for the volume mounted in the Docker
     * container.
     *
     * Modules specified in `nodeModules` will be installed using the right
     * installer (`npm` or `yarn`) along with this lock file.
     *
     * @default - the path is found by walking up parent directories searching for
     *   a `yarn.lock` or `package-lock.json` file
     */
    readonly depsLockFilePath?: string;

    /**
     * Bundling options
     *
     * @default - use default bundling options: no minify, no sourcemap, all
     *   modules are bundled.
     */
    readonly bundling?: BundlingOptions;

    /**
     * The path to the directory containing project config files (`package.json` or `tsconfig.json`)
     *
     * @default - the directory containing the `depsLockFilePath`
     */
    readonly projectRoot?: string;

    /**
     * The stack ID of Lambda@Edge function.
     *
     * @default - `edge-lambda-stack-${region}`
     * @stability stable
     */
    readonly stackId?: string;
}

export class NodejsEdgeFunction extends cloudfront.experimental.EdgeFunction {

    constructor(scope: core.Construct, id: string, props: NodejsEdgeFunctionProps) {
        const handler = props.handler ?? 'handler';
        const runtime = props.runtime ?? lambda.Runtime.NODEJS_14_X;
        const entry = path.resolve(findEntry(id, props.entry));
        const architecture = props.architecture ?? lambda.Architecture.X86_64;
        const depsLockFilePath = findLockFile(props.depsLockFilePath);
        const projectRoot = props.projectRoot ?? path.dirname(depsLockFilePath);
        super(scope, id, {
            ...props,
            runtime,
            stackId: props.stackId,
            code: bundling.Bundling.bundle({
                ...props.bundling ?? {},
                architecture,
                runtime,
                depsLockFilePath,
                entry,
                projectRoot,
            }),
            handler: `index.${handler}`,
        });
    }
}

/**
 * Checks given lock file or searches for a lock file
 */
function findLockFile(depsLockFilePath?: string): string {
    if (depsLockFilePath) {
        if (!fs.existsSync(depsLockFilePath)) {
            throw new Error(`Lock file at ${depsLockFilePath} doesn't exist`);
        }

        if (!fs.statSync(depsLockFilePath).isFile()) {
            throw new Error('`depsLockFilePath` should point to a file');
        }

        return path.resolve(depsLockFilePath);
    }

    const lockFiles = findUpMultiple([
        PackageManager.PNPM.lockFile,
        PackageManager.YARN.lockFile,
        PackageManager.NPM.lockFile,
    ]);

    if (lockFiles.length === 0) {
        throw new Error('Cannot find a package lock file (`pnpm-lock.yaml`, `yarn.lock` or `package-lock.json`). Please specify it with `depsFileLockPath`.');
    }
    if (lockFiles.length > 1) {
        throw new Error(`Multiple package lock files found: ${lockFiles.join(', ')}. Please specify the desired one with \`depsFileLockPath\`.`);
    }

    return lockFiles[0];
}

/**
 * Searches for an entry file. Preference order is the following:
 * 1. Given entry file
 * 2. A .ts file named as the defining file with id as suffix (defining-file.id.ts)
 * 3. A .js file name as the defining file with id as suffix (defining-file.id.js)
 * 4. A .mjs file name as the defining file with id as suffix (defining-file.id.mjs)
 */
function findEntry(id: string, entry?: string): string {
    if (entry) {
        if (!/\.(jsx?|tsx?|mjs)$/.test(entry)) {
            throw new Error('Only JavaScript or TypeScript entry files are supported.');
        }
        if (!fs.existsSync(entry)) {
            throw new Error(`Cannot find entry file at ${entry}`);
        }
        return entry;
    }

    const definingFile = findDefiningFile();
    const extname = path.extname(definingFile);

    const tsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.ts`);
    if (fs.existsSync(tsHandlerFile)) {
        return tsHandlerFile;
    }

    const jsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.js`);
    if (fs.existsSync(jsHandlerFile)) {
        return jsHandlerFile;
    }

    const mjsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.mjs`);
    if (fs.existsSync(mjsHandlerFile)) {
        return mjsHandlerFile;
    }

    throw new Error(`Cannot find handler file ${tsHandlerFile}, ${jsHandlerFile} or ${mjsHandlerFile}`);
}

/**
* Finds the name of the file where the `NodejsFunction` is defined
*/
function findDefiningFile(): string {
    let definingIndex;
    const sites = callsites();
    for (const [index, site] of sites.entries()) {
        if (site.getFunctionName() === 'NodejsEdgeFunction') {
            // The next site is the site where the NodejsFunction was created
            definingIndex = index + 1;
            break;
        }
    }

    if (!definingIndex || !sites[definingIndex]) {
        throw new Error('Cannot find defining file.');
    }

    return sites[definingIndex].getFileName();
}
```

Wie ihr seht habe ich viele private Funktionen aus der NodejsFunction übernommen. Das Construct wird nun folgendermaßen in meinen CDK Stack importiert:

```ts
import { NodejsEdgeFunction } from './nodejs-edge-function';

...

const imageAccessFunction = new NodejsEdgeFunction(this, 'edge');
```

Der Lambda@Edge code verhält sich nun genauso wie wir es gewöhnt sind von der NodejsFunction. Der TypeScript Lambda-Code kann nun im src Folder mit dem Namen STACK.edge.ts angelegt werden. Benötigte third-party Libraries können bequem in der root package.json notiert werden. Webpack als module bundler sorgt dan für eine effiziente Transformierung in das JavaScript Format.

## Zusammenfassung

Mega cool oder? Mit ein paar Handgriffen kann ich nun auch wie gewohnt meine Lambda@Edge in TypeScript schreiben. Natürlich plane ich den Code ins aws-cdk Repo zu kontribuierten. Hoffentlich wird mein PR dann baldig akzeptiert und ihr müsst euch nicht die Mühe machen meinen Code hier zu importieren. Findet ihr mein Construct hilfreich? Falls ja schreibt mir!

Ich liebe es an Content Management Open Source Projekte zu arbeiten. Vieles kannst du bereits frei nutzen auf www.github.com/mmuller88 . Wenn du meine dortige Arbeit sowie meine Blog Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen und ein Patreon zu werden:

<a href="https://www.patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Werde ein Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
