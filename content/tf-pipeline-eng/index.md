---
title: Terraform CI/CD Staging Pipeline with CircleCI
show: "no"
date: "2022-10-01"
image: "title.png"
tags: ["eng", "2022", "aws", "terraform", "serverless", "nofeed"] #nofeed
gerUrl: https://martinmueller.dev/tf-pipeline
pruneLength: 50 #du
---

Hi,

Terraform CI/CD staging pipelines, where the CD stands for Continuous Deployment, allow a secure and continuous development of infrastructure with Terraform. Typically, a commit in the main branch starts the pipeline and the desired changes are first executed on the DEV stage. Through a manual approval, the changes can then be rolled out to the QA Stage and then to the PROD Stage with the pipeline.

I would like to present here how such a Terraform CI/CD staging pipeline with AWS as cloud provider can look like.

## Why a CI/CD staging pipeline?

Together with the customer we plan and develop a complex AWS setup with [Hasura](https://hasura.io/), RDS, ECS and many other AWS services. Among other things, this setup should also interact with the existing production environment in Salesforce. So it is of utmost importance to test new functionalities on a DEV and QA environment.

These environments DEV and QA should behave as similar as possible to the PROD environment. Furthermore, changes should be executable quickly on the PROD environment with as few manual steps as possible. Exactly for these requirements a CI/CD staging pipeline is suitable.

## Multi-Account Setup

To create a CI/CD staging pipeline it is best practice to use a separate AWS account for each stage like DEV, QA or PROD. So the pipeline setup must be able to bootstrap or initialize these accounts with Terraform and then roll out changes.

For the multi-account setup I used the article [Terraform AWS Multi-Account Setup](https://cloudly.engineer/2021/terraform-aws-multi-account-setup/aws/) as a model, where config files like [accounts/dev/backend.conf](https://github.com/mmuller88/tf-pipeline-circleci/blob/main/accounts/dev/backend.conf) and [accounts/dev/terraform.tfvars](https://github.com/mmuller88/tf-pipeline-circleci/blob/main/accounts/dev/terraform.tfvars) are used to configure the respective stage. Super cool now is that this allows the same [main.tf](https://github.com/mmuller88/tf-pipeline-circleci/blob/main/main.tf) to be used for all staging environments.

Too often I see customers working with Terraform creating separate TF files for each staging environment and copying resources back and forth. This needs to stop and the approach described here can help!

## CircleCI Staging Pipeline

[CircleCI](https://circleci.com/) is a continuous integration and continuous delivery platform for DevOps functionalities. Similar to other DevOps platforms like Travis or GitHub Actions, a pipeline yaml definition is created in the .circleci folder named config.yml. What I find very great is that CircleCI supports manual approvals and makes them easy to integrate with:

```yml
workflows:
  version: 2
  plan_approve_apply:
    jobs:
      - dev-plan-apply
      - dev-hold-apply:
          type: approval
          requires:
            - dev-plan-apply
     ...
```

This way the planned infrastructure changes can first be reviewed and then implemented. You can see the complete code [here](https://github.com/mmuller88/tf-pipeline-circleci/blob/main/.circleci/config.yml).

## Outlook

Next I want to introduce [CDKTF](https://github.com/hashicorp/terraform-cdk) so that the infrastructure can be defined with TypeScript. Similar to what was the case for me with AWS CDK, I expect this to speed up development with Terraform. The type support allows me to identify missing Terraform properties early on. Also, the documentation of the properties is very convenient and I hardly have to look in the Terraform documentation.

After that, I'm also very excited to see how AWS resources like Aurora, ECS, VPC and so on integrate with Terraform. The whole thing expands my set of tools with which I can build cool stuff in AWS.

## Conclusion

A CI/CD staging pipeline is an important tool to build reliable infrastructure in AWS. Here in this article, I have shown you how to do it with Terraform in AWS. Since I am still a beginner in Terraform, I may have made small mistakes. If you have any suggestions for improvement or want to discuss simple cool projects with me, feel free to write to me :)!

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to English and saving me tons of time :).

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Or

[![Be my Patron](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
