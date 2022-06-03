---
title: Create ACS Infrastructure easy with AWS CDK
date: '2020-07-26'
image: 'alfcdk.jpg'
tags: ['eng', '2020', 'acs', 'alfresco', 'cdk', 'docker-compose']
gerUrl: https://martinmueller.dev/alf-cdk
pruneLength: 50
---

Hi Alfrescans.

Infrastructure as code has been popular in DevOps for quite some time. One of the first pioneers of IaC (Infrastructure as Code) is AWS with Cloudformation. For this, cloudformation templates must be written in JSON or YAML. This works very well but is a time consuming and complex work.

With AWS CDK, a new level of abstraction has been created above the cloudformation templates, which makes it easier than ever to provide the infrastructure for a running ACS. In the next sections I will explain what AWS CDK actually is and how it can help to build AWS infrastructure for ACS.

# What is AWS CDK?
CDK stands for Cloud Development Kit and is an open software development framework for modeling and managing Cloudformation resources and thus AWS infrastructure. AWS CDK synthesizes to Cloudformation Templates. This means that Cloudformation Templates are being created from the CDK code. A so-called CDK App consists of one or more Cloudformation Stacks. It supports well-known languages like Java, Python, JavaScript or TypeScript. For the rest of this article I use TypeScript.

# Why is CDK so great?
The great thing about CDK in the TypeScript flavor are the type definitions which allow for fast progress when developing with an IDEA, since it virtually brings documentation with it thanks to the types. Also, the years of experience with cloud formation have already resulted in excellent defaults, which rarely need to be overwritten. CDK also takes care of the upload of the synthesized cloudformation template and assets into an S3. Also, the CDK framework is open source and if you want to take a closer look at how CDK works, you can do so in [GitHub](https://github.com/aws/aws-cdk).

So AWS CDK is an excellent way to provide the infrastructure for an ACS deployment. In the following section, I'll explain the two stacks Ec2 stack and EKS stack created with CDK.

# CDK Constructs
Constructs can be either low level or high level. Low level constructs represent a Cloudformation resource. High level constructs are a combination of several low level constructs. The whole CDK app represents a tree with the app itself as root. After that come the high level constructs and the leaves are the low level constructs. For completeness, I should add that low level constructs are getting auto generated from existing Cloudformation resources.

A good example is the high level construct Vpc from the package @aws-cdk/aws-ec2 which is a combination of resources like Vpc, InternetGateway, Cidr or VpC Iam Role. The creation of the high level VPC Construct looks like this:

```TypeScript
import { Vpc } from '@aws-cdk/aws-ec2';
import { Stack, App} from '@aws-cdk/aws-ec2';

class VpcStack extends Stack {
  constructor(app: app, id: string) {
    super(app, id);

    new Vpc(this, 'vpc'); // just this line
  }
}

const app = new App();
new VpcStack(app, 'VpcStack');

app.synth();
```

Only the line ```new Vpc(this, 'vpc');``` is required to define a complete public VPC. Doing the same in a Cloudformation template would be 200 lines long! This is made possible because CDK has extremely useful default settings. You can see how well this framework benefits from years of experience with Cloudformation. If you would like to create a private VPC you only need to pass a third parameter object:

```TypeScript
new Vpc(this, 'CustomVPC', {
  cidr: '10.0.0.0/16',
  maxAzs: 2,
  subnetConfiguration: [{
    cidrMask: 26,
    name: 'isolatedSubnet',
    subnetType: SubnetType.ISOLATED,
  }],
  natGateways: 0
});
```

# Ec2 Stack
The code is public and in my [GitHub Repo](https://github.com/mmuller88/alf-cdk-ec2). The ACS deployment was generated using the [Alfresco Docker Installer](https://github.com/Alfresco/alfresco-docker-installer) and uses Docker Compose to orchestrate the ACS deployment services. The CDK app is defined in the file index.ts. If no CDK Apps have been deployed yet, the CDK Toolkit Stack must be created in the target region with:

```
cdk bootstrap aws://<ACCOUNT-NUMBER>/<REGION>
```

Then the stack is deployed with the following command:

```
npm run build && cdk deploy
```

If everything went well, the Alfresco Content App should be available on the public DNS Url for a short ACA. For example, ec2-34-201-46-76.compute-1.amazonaws.com. You can get that URL directly from the AWS browser in the Ec2 section or define an Output resource and your CDK stack.

The CDK app creates a cloudformation stack that deploys an Ec2 instance behind an application load balancer. The ACS Deploy Code, which is also contained in the same repo, is copied to the Ec2 instance and ACS is started. Docker Compose serves as a container orchestrator.

This is ideal for simple developer environments, as Docker Compose templates can be created quickly and are easily extensible. However, if you want to create a production-like ACS deployment, you should use Kubernetes as a container orchestrator.

# EKS Stack
EKS stands for Elastic Kubernetes Service and provides a Kubernetes Masternode when used. The Ec2 worker nodes are also configured. In contrast to the Ec2 stack, the EKS stack uses Kubernetes to orchestrate the ACS deployment services. There are already some good examples how to create an EKS deployment with CDK. [Here](https://github.com/mmuller88/alf-cdk-eks) you can find my GitHub code. The following properties are needed to create the cluster:

```TypeScript
const eksCluster = new Cluster(this, 'cluster', {
  clusterName: this.stackName,
  mastersRole: eksClusterAdmin,
  vpc: vpc,
  kubectlEnabled: true, // we want to be able to manage k8s resources using CDK
  defaultCapacity: 0, // we want to manage capacity our selves
  version: CubernetesVersion.V1_17,
});
```

I overwrite the cluster name generated by the CDK with **clusterName** because it is not reader-friendly. The **masterRole** allows my IAM User Admin access to the cluster. The workernode is then defined as follows:

```TypeScript
const onDemandASG = new AutoScalingGroup(this, 'OnDemandASG', {
  vpc: vpc,
  role: workerRole,
  minCapacity: 1,
  maxCapacity: 1,
  instanceType: new InstanceType('t2.large'),
  machineImage: new EksOptimizedImage({
    cybernetic version: '1.17',
    nodeType: NodeType.STANDARD // without this, incorrect SSM parameter for AMI is resolved
  }),
  updateType: UpdateType.ROLLING_UPDATE
});
```

To make Alfresco accessible via URLs, you need to define the address as well. I use a Nginx Ingress in AWS Flavour:

```TypeScript
new HelmChart(this, 'NginxIngress', {
  cluster: eksCluster,
  chart: 'nginx-ingress',
  repository: 'https://helm.nginx.com/stable',
  namespace: 'kube-system',
  values: {
    'rbac': {
      'create': true
    },
    'controller': {
      'scope': {
        'enabled': true,
        namespace: acsNamespace
      },
      'config': {
        'force-ssl-redirect': true,
        server tokens: false
      },
      'service': {
        'targetPorts': {
          'https': 80
        },
        annotations: {
          'service.beta.kubernetes.io/aws-load-balancer-backend-protocol': 'http',
          'service.beta.kubernetes.io/aws-load-balancer-ssl-ports': 'https',
          'service.beta.kubernetes.io/aws-load-balancer-ssl-cert': awsCertArn,
          'external-dns.alpha.kubernetes.io/hostname': `${acsNamespace}.eks.alfpro.net`
          'service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy': awsCertPolicy
        },
        publishService: {
          'enabled': true
        }
      }
    }
  }
})
```

After successful deployment with

```
npm run build && cdk deploy
```

the following output appears:

```
 ✅ AcsEksCluster

Outputs:
AcsEksCluster.ClusterConfigCommand43AAE40F = aws eks update-kubeconfig --name AcsEksCluster --region us-east-1 --role-arn arn:aws:iam::1111122223333:role/AcsEksCluster-eksClusterAdminE955DB57-1H9KJVEE241KS
AcsEksCluster.clusterGetTokenCommand06AE992E = aws eks get-token --cluster-name AcsEksCluster --region us-east-1 --role-arn arn:aws:iam::1111122223333:role/AcsEksCluster-eksClusterAdminE955DB57-1H9KJVEE241KS
```

The aws eks update-config command can be used to connect to the cluster and apply cluster configurations using kubectl.

## Helm 3 Issue
Unfortunately none of the ACS Charts, i.e. Community and Enterprise, are compatible with Helm 3 at this time. This means we can not use the existing HelmChart CDK Constructor to install ACS. Alternatively, ACS must be installed with Helm 2.

# Summary
AWS CDK is an exciting framework for building Alfresco infrastructure in AWS. CDK synthesizes into cloud formation templates, so there is little or no need to change existing CI CD pipelines. The gain from using CDK is huge. E.g. the type definition prevents bugs already in the editor. Many lines of code are saved and there is no or hardly any need to template YAML. For me CDK is the next logical step for IaC in AWS. There are even the first efforts to integrate CDK into the [Terraform](https://github.com/hashicorp/terraform-cdk/) ecosystem, which I find very exciting. I would be really interested to hear of you experiences with CDK :)!

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://www.facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on www.github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

  