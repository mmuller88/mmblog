---
title: Make your AWS Prod environment super with Superwerker 
show: "yes"
date: "2022-07-05"
image: "splash.jpeg"
tags: ["eng", "2022", "aws"] #nofeed
gerUrl: https://martinmueller.dev/aws-superwerker
pruneLength: 50 #du
---

Hi everyone.

I want to make my [senjuns project](github.com/senjuns/senjuns) production-ready. So far I had only deployed it in my developer AWS account. My developer account has no AWS services configured that are needed for a reasonable production environment. These are for example AWS SSO, ControlTower, SecurityHub and some more. The [Superwerker CFN Template](https://github.com/superwerker/superwerker) came in handy. It allowed me to configure a new AWS account with many great AWS services for production use. In the following sections, I would like to go into what Superwerker is exactly and how I used it.

## What is Superwerker?

[Superwerker](https://github.com/superwerker/superwerker) is an open-source AWS CloudFormation solution that simplifies the setup of an AWS account. It follows best practices for security and efficiency. It was/is developed and maintained by AWS Advanced Partners [kreuzwerker](https://github.com/superwerker/superwerker) and [superluminar](https://superluminar.io/). It even has its own [landing page](superwerker.cloud)[https://superwerker.cloud/] with great content like a short video and more. Hard to believe this is a free product.

The Superwerker deployment has a lot of cool features which are all explained very well in the docs [here](https://github.com/superwerker/superwerker/tree/main/docs/adrs). I really like that it uses [Architectural Decision Records](https://adr.github.io/) to describe each feature. Below I explain the features in my own words.

### Backup

[Backup](https://github.com/superwerker/superwerker/blob/main/docs/adrs/backup.md) enables the AWS Backup Service and by default, a backup is created every day. It creates backups of databases that are also supported by AWS Backup.

### Budget

[Budget](https://github.com/superwerker/superwerker/blob/main/docs/adrs/budget.md) helps to keep track of the costs in AWS and gives a warning in time if there are more costs than usual. It does this by calculating the average of the last three months and if this is exceeded, a warning comes. A really cool idea in my opinion.

### Control Tower

[Control Tower](https://github.com/superwerker/superwerker/blob/main/docs/adrs/control-tower.md) simplifies managing multiple AWS accounts with AWS SSO. For me, this is the main reason why I use Superwerker. So I can access my different AWS accounts like build, dev and prod very easily. I also like the fact that with AWS SSO I can simply copy the AWS account credentials and use them for the AWS CLI.

### GuardDuty

[GuardDuty](https://github.com/superwerker/superwerker/blob/main/docs/adrs/guardduty.md) is an AWS service for finding potential security threats.

### Living Documentation

[Living Documentation](https://github.com/superwerker/superwerker/blob/main/docs/adrs/living-documentation.md) is a pretty cool feature that generates documentation via the AWS CloudWatch Dashboard. This then provides information on, for example, how to do an SSO setup with external identity providers like Google and much more. Extremely cool is how this documentation also updates itself when certain configurations have already been made. That's why it's called Living Documentation.

### Notifications

Superwerker creates OpsItems in OpsCenter when emails are sent from the RootMail feature. With the [Notifications](https://github.com/superwerker/superwerker/blob/main/docs/adrs/notifications.md) feature emails are sent to the specified addresses. This way the user does not have to manually log into the AWS Console and check OpsCenter. Through email, one thus also has a centralized collection point for multiple accounts.

### RootMail

[RootMail](https://github.com/superwerker/superwerker/blob/main/docs/adrs/rootmail.md) creates the uniformed email addresses for the audit and log archive accounts created by Control Tower. For this purpose, a separate Hosted Zone is created, for example aws.mycompany.test with Route53, and the required settings are made with AWS SES to receive the emails.

### Security Hub

The [Security Hub](https://github.com/superwerker/superwerker/blob/main/docs/adrs/securityhub.md) feature enables AWS Security Hub for all accounts. The user needs to log into the audited account to view the aggregated Security Hub view.

In the next section, I would like to share more about my Experience with Superwerker.

## Superwerker Experience

You can find the instructions for running Superwerker [here](https://superwerker.awsworkshop.io/). For me, the installation went quite smoothly. However, the [RootMail](https://github.com/superwerker/superwerker/blob/main/docs/adrs/rootmail.md) nested stack was an exception. I had previously imported my senjuns.com domain and associated Hosted Zone from another AWS account. However, I did not properly configure the name servers from the domain in the designated Hosted Zone. By debugging the Superwerker Lambdas, I noticed this error.

So if you also get the following error logs in the RootMailReady Lambda, you just need to check if you have configured your domain and Hosted Zone properly.

```json
{
    "level": "info",
    "msg": "verification not yet successful",
    "res": {
        "VerificationAttributes": {
            "aws.senjuns.com": {
                "VerificationStatus": "Pending",
    ...
```

```json
{
    "level": "info",
    "msg": "DKIM verification not yet successful",
    "res": {
        "DkimAttributes": {
            "aws.senjuns.com": {
                "DkimEnabled": true,
                "DkimVerificationStatus": "Pending",
    ...
```

If anyone encounters the same or similar problem, I have created a pull request with troubleshooting information.

## Conclusion

Superwerker is a great CloudFormation QuickStart to set up an AWS production environment professionally and easily. Many improvements and new features are already planned in the [Superwerker Backlog](https://github.com/superwerker/superwerker/issues). The Superwerker community is still looking for active support in implementing new features and improvements. I am very excited to continue using the Superwerker deployment in my current project.

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
