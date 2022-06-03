---
title: AWS CDK diagrams with cdk-dia <3
show: "yes"
date: "2022-03-24"
image: "diagram.png"
tags: ["eng", "2022", "cdk"] #nofeed
gerUrl: https://martinmueller.dev/cdk-dia
pruneLength: 50 #ihr
---

Hi.

AWS component diagrams are a great way to visualize complex AWS architectures. For many, they are much more intuitive than, for example, CDK code. I myself work a lot with AWS component diagrams when I develop new AWS systems. What has always bothered me is that creating the diagrams is time consuming and they have to be updated when the architecture changes.

If you feel the same way, try [cdk-dia](https://github.com/pistazie/cdk-dia). I used it in my last two CDK projects and the experience was simply overwhelming.

## How does it work?

The tool cdk-dia allows me to create AWS component diagrams automatically from my CDK code. It even follows the CDK Construct Level 1 and 2 abstractions. This means that e.g. the big components are symbols level 2 constructs and only the main component which usually gets **Resource** as ID. Thus, only the really important AWS components are rendered. This is also known as collapsing.

![collapsed](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-dia/decorator_example_collapsed.png)(collapsed diagram)

If you want to prevent collapsing, so that all underlying components are displayed, you can define a decorater in the code. How exactly this works you can see [here](https://github.com/pistazie/cdk-dia/tree/main/examples/experimental-decorator-example) .

![non-collapsed](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/cdk-dia/decorator_example_non-collapsed.png)(non-collapsed diagram)

This is what I used for my [private asset bucket construct](https://github.com/mmuller88/cdk-private-asset-bucket/blob/main/src/private-asset-bucket.ts) for example:

```ts
...
@DiagramOptions({ collapse: CollapseTypes.FORCE_NON_COLLAPSE })
export class PrivateAssetBucket extends core.Construct {
...
```

If you want to know more about my Prowler Construct look [here](https://martinmueller.dev/cdk-private-assets-eng).

## Comparison with AWS Console Cloudformation template

The AWS Console itself also has a diagram tool to visualize CloudFormation stacks called AWS CloudFormation Designer. You can find more information [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/working-with-templates-cfn-designer.html). So I compared the designer with cdk-dia and I think cdk-dia is a lot better. cdk-dia manages to achieve a much better level of abstraction through collapsing. Also the graphics of cdk-dia are much nicer.

In the following section I explain how you can implement cdk-dia in your CDK project.

## cdk-dia script

For continuous updating of the cdk-dia diagrams it would be a good idea to write a small helper script in the package.json. But first you should make sure that cdk-dia is installed in the dev dependency scope with `yarn add cdk-dia -D`.

Then create a folder named diagrams and add this script to package.json.

```json
"scripts": {
    ...
    "dia": "yarn cdk synth && yarn cdk-dia && mv diagram.png diagrams/dashboard.png",
    ...
  },
```

The script first synthesizes the current CloudFormation templates. cdk-dia needs them to generate the diagram at all. Then `yarn cdk-dia` creates the diagram and moves it to the diagrams folder.

`yarn cdk-dia` also creates a diagram.dot file. I recommend to put the following two files into the .gitignore:

```txt
diagram.dot
diagram.png
```

If you like to split the diagram into single images, you can also render only single CDK stacks, e.g.

```json
"scripts": {
    ...
    "dia": "yarn cdk synth && yarn cdk-dia --stacks DashboardAppStack DashboardBackendStack && mv diagram.png diagrams/dashboard.png && yarn cdk-dia --stacks LandingPageStack && mv diagram.png diagrams/landingpage.png",
    ...
  },
```

Also a good idea is to integrate the cdk-dia command into the cdk synth process. I included this for example in my [cdk Prowler Construct](https://github.com/mmuller88/cdk-prowler). In the package.json you will find the following script:

```json
"scripts": {
    ...
    "synth": "yarn cdk synth && yarn cdk-dia && mv diagram.png diagrams/prowler.png",
    ...
  },
```

Now every time you run cdk synth manually, the cdk-dia diagram is rendered as well. Cool or? If you want to know more about my Prowler Construct look [here](https://martinmueller.dev/prowler-cdk-eng).

## Ideas

In the previous post I introduced a small script that generates the cdk-dia diagrams. Unfortunately this script still has to be run manually. It would be mega cool if these diagrams update themselves quasi. This should be possible if you use Husky pre-commit hooks. I am currently trying this out. If you want to know more about it, let me know.

Unfortunately cdk-dia couldn't render my CDK CD staging pipeline properly and I had to create it by hand in <https://draw.io>. It would be super cool if cdk-dia could also map pipelines.

## Summary

If you also like to work with AWS component diagrams give cdk-dia a try! Here in the post I described how great the tool is and how easy it is to use. Feel free to contact me if you have any questions.

Translated with www.DeepL.com/Translator (free version)

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to English and saving me tons of time :).

To the wonderful readers of this article, I'm saying that feedback of any kind is welcome. In the future, I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

 
