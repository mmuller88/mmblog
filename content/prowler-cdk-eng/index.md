---
title: Automated AWS Security Feedback with Prowler and AWS CDK
date: '2021-08-15'
# image: 'report-group-out.png'
tags: ['eng', '2021', 'github', 'prowler', 'aws', 'cdk'] #nofeed
gerUrl: https://martinmueller.dev/prowler-cdk
pruneLength: 50
---

Hi Folks!

[Toni De La Fluente](https://twitter.com/ToniBlyx) has developed the super cool AWS Security Tool [Prowler](https://github.com/toniblyx/prowler). Prowler is a cli tool for performing and consulting AWS Security Assessment, Auditing, Hardening and Incident Response. With more than 180 checks, Prowler provides the most comprehensive security checks offering for AWS. If you want to know more about Prowler visit the [Prowler Github](https://github.com/toniblyx/prowler) page.

I use Prowler a lot and decided to write an AWS CDK Custom Construct for it. In the past I have already created some custom constructs like my favorite the [staging pipeline](https://github.com/mmuller88/aws-cdk-staging-pipeline) or the [build badge](https://github.com/mmuller88/aws-cdk-build-badge).

However, if you just want to run Prowler for your AWS account and don't want to try the Custom Construct, I have good news. For the AWS Marketplace, I've created an AMI that automatically installs the cdk-prowler construct into your account. The AMI is available in the AMI Store. Just search for Prowler or use the [Prowler AMI Link](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6).

Then Prowler will run the security check and you will find the security findings in an S3 bucket named prowleraudit-stack-prowlerauditreportbucket the HTML report:

![html results](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/prowler-cdk-eng/html-out.png)

Or also in the codebuild report group:

![Report group](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/prowler-cdk-eng/report-group-out.png)

If you have any problems with the AMI, please write me.

By buying the AMI you also support my free work to create such freely available products like the [cdk-prowler](https://github.com/mmuller88/cdk-prowler) custom construct and the work on my blogpost. Thank you very much :)!

In the next paragraphs I will explain why I think a CDK custom construct is useful and introduce you to the cdk-prowler custom construct. But first I have to explain what AWS CDK is.

# AWS CDK
[AWS CDK](https://github.com/aws/aws-cdk) is an open source framework for creating and managing AWS resources. By using languages familiar to the developer such as TypeScript or Python, the Infrastructure as Code is described. In doing so, CDK synthesizes the code into AWS Cloudformation Templates and can optionally deploy them right away.

AWS CDK has been experiencing a steady growth of enthusiastic developers since 2019 and already has a strong and helpful community that is eg. very active on [Slack](https://cdk-dev.slack.com). There is of course much more to say about AWS CDK and I recommend you explore it. Drop me a line if you have any questions.

# Motivation

AWS CDK Custom Constructs are quasi own library to encapsulate cloudformation resources. They can be downloaded from registries like npmjs.com or pypi.org. So it is extremely easy to integrate cdk-prowler into your CDK IDE environment. Also it is very easy to make changes to the cdk-prowler code and provide a new version to the respective restries. Much of this important but tedious work is already greatly simplified by [Projen AwsCdkConstructLibrary](https://github.com/projen/projen).

Another reason for the Custom Construct is the [Jsii](https://github.com/aws/jsii) Library. With this mega cool library I can translate the cdk-prowler construct to different languages like Python, Java or CSharp and the developer can continue developing in his usual CDK language with cdk-prowler.

# Beispiel
The cdk-Prowler Construct is on [GitHub](https://github.com/mmuller88/cdk-prowler). It must first be included in the package.json as a dependency and can then be used in the CDK stack.

```ts

import { ProwlerAudit } from 'cdk-prowler';
...

const app = new App();

const stack = new Stack(app, 'ProwlerAudit-stack');

new ProwlerAudit(stack, 'ProwlerAudit');

app.synth();
```

The AWS CDK code shows how easy cdk-prowler can be deployed. Many additional functions like a scheduler are already available and can be activated and changed via the properties. Please have a look at the [API.md](https://github.com/mmuller88/cdk-prowler/blob/main/API.md).

# Outlook

Many cool features for cdk-prowler are planned. The development of new features is done in cooperation with [Tony De La Fluente](https://twitter.com/ToniBlyx) the creator of Prowler.

Planned is to make Prowler multiaccount ready. So you have a centralized place for Prowler to check all accounts. Multiaccount should work with and without AWS organization.

In the future, Prowler will no longer be run with Codebuild but with Fargate. This allows a more flexible further development of Prowler to parallelize scans, for example. Parallelizing Prowler scans is an important and much needed feature because with over 180 Prowler tests running sequentially, execution can take a long time.

Also, Tony and I are thinking about an improved UI analysis tool with QuickSight. The Prowler HTML report is very useful but it is hard to send complex queries to the report. With QuickSight you have the possibility to define filters, variables, etc.

# Summary
Prowler is mega cool and I love that it gives me automated feedback on security, best practices, etc. AWS CDK makes it easy to install ProwlerAudit and nest it with other services. Test the ProwlerAudit Construct and give me suggestions to make it even cooler. Feel free to create PRs for it in Github.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>