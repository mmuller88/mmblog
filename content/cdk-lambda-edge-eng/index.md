---
title: Deploy Lambda@Edge with AWS CDK and TypeScript
date: '2022-02-06'
image: 'title.png'
tags: ['eng', '2022', 'aws', 'cdk'] #nofeed
gerUrl: https://martinmueller.dev/cdk-lambda-edge
pruneLength: 50
---

Hi,

Lambda@Edge are Lambdas that are executed in the AWS Cloudfront Locations. That can increase performance and reduce latency compared to normal Lambda. Cloudfront together with Lambda@Edge can also being used as a proxy for a private S3 asset bucket.

A token issued by Cognito is then used by Lambda@Edge to validate if the requester is allowed to access the S3 asset. I will describe more about this in the next blogpost. Here we will talk about how to create a Lambda@Edge with AWS CDK and Typescript.

## AWS CDK Lambda@Edge

Lambda@Edge already exists in the CDK cloudfront package https://docs.aws.amazon.com/cdk/api/v1/docs/aws-cloudfront-readme.html. Unfortunately, it is not directly possible to write the Lambda code with TypeScript as we are already used to it like from the [NodejsFunction](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-lambda-nodejs.NodejsFunction.html).

Well not with me! I took a closer look at NodejsFunction and EdgeFunction and transferred the TypeScript functionality from NodejsFunction to EdgeFunction. I simply define a CDK construct which is extended by EdgeFunction and take functions and properties from NodejsFunction. And here is the code of my nodejs-edge-function.ts construct:

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

As we can see, I have taken many private functions from the NodejsFunction. The construct is now imported into my CDK stack as follows:

```ts
import { NodejsEdgeFunction } from './nodejs-edge-function';

...

const imageAccessFunction = new NodejsEdgeFunction(this, 'edge');
```

The Lambda@Edge code now behaves as we are used to from the NodejsFunction. The TypeScript Lambda can now be created in the src folder with the name STACK.edge.ts. Third-party libraries can be kept in the root package.json. Webpack as module bundler provides an efficient transformation into the JavaScript format.

## Summary

Mega cool or? With a few steps, I can now write my Lambda@Edge in TypeScript as usual. Of course, I plan to contribute the code to the aws-cdk repo. Hopefully my PR will be accepted soon and you won't have to bother importing my code here. Do you find my construct helpful? If so write me!

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to English and saving me tons of time :).

To the wonderful readers of this article, I'm saying that feedback of any kind is welcome. In the future, I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
