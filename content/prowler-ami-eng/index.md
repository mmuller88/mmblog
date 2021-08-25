---
title: Security, Best Practice and Hardening Checks with the Prowler AMI
date: '2021-08-25'
image: 'logo.png'
tags: ['eng', '2021', 'github', 'prowler', 'aws', 'cdk', 'security'] #nofeed
gerUrl: https://martinmueller.dev/prowler-ami
pruneLength: 50
---

Hi Folks!

Developing in AWS is fun and the possibilities to build cool stuff seem endless. But are these cool things secure and do they follow AWS's best practices? With [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) you can check just that with far over 180 checks for many services in all your regions. For just $1, an Ec2 instance started with the Prowler AMI builds the [cdk-prowler](https://github.com/mmuller88/cdk-prowler) into your account. This will automatically start a CodeBuild that runs the checks. At the end you get an evaluation of the checks. The report contains information if the check was successful, the severity, a risk description and how to fix the problem.

![HTML Report](https://raw.githubusercontent.com/mmuller88/mmblog/master/content/prowler-ami/html-out.png)

In the next section I explain how exactly Prowler performs the checks.

# Prowler Scan
The Prowler AMI uses the Github [Prowler Tool](https://github.com/toniblyx/prowler). If you want to try Prowler locally, use the instructions from the [Readme](https://github.com/toniblyx/prowler#requirements-and-installation). Prowler can then be run either as a script with `./prowler` or as a Docker container. Basically, Prowler then runs through the checks using the AWS CLI from the [check Folder](https://github.com/toniblyx/prowler/tree/master/checks).

After running the checks, an HTML report is saved to an S3 bucket named prowleraudit-stack-prowlerauditreportbucket (see image from above). The HTML report now lists all findings of the performed checks. Since the recently released Prowler version 2.5.0 these can be filtered.

# Run Prowler with AMI
As mentioned before you can deploy Prowler with my [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) to your account. In this section I will explain you how to do that.

First of course you click on the [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) link and subscribe to the AMI. Subscribing takes a little while. After the subscription is finished click on "Continue to Configure". Select the latest Prowler version and the region in which you want to run the Prowler checks. Then click on "Continue to Launch". Now very important at "Choose Action" you have to select "Launch through Ec2". Now you will be redirected to Ec2 in the AWS Console.

Now select the pre-selected instance type which should be t2.micro. Then click on "Next: Configure Instance Details". For the IAM role you need an Ec2 role that has administrator privilege. If the role does not exist yet click on "Create new IAM role" and create an AWS service role for Ec2 with the AdministratorAccess Policy. The Prowler AMI needs this permission to deploy the CDK stack on your system.

Alternatively you can call Prowler directly from the Ec2 AWS Console. Just go to Ec2 --> Instances --> Launch Instances in the AWS Console and search for Prowler. The rest is the same as described in the previous section.

Now the Prowler Cloudformation stack is deployed and the Prowler check is started using CodeBuild. At the end the HTML report ends up in the S3 bucket prowleraudit-stack-prowlerauditreportbucket .

The Ec2 instance is only needed to deploy the Cloudformation stack and should be terminated after the stack is finished to save costs.

# Rerun Prowler with AMI
To run the Prowler scan again, you only run the AMI again. The Prowler stack will be triggered to run the scan again.

# Summary
Prowler is a great tool to check your AWS account. With further over 100 checks, it gives me useful feedback on settings that don't follow best practices. Thus, I achieve a higher level of security in my AWS accounts. With my [Prowler AMI](https://aws.amazon.com/marketplace/pp/prodview-jlwcdlc3weta6) it is very easy to run the tool in the account. Feel free to try Prowler AMI and tell me about your experience :).

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>