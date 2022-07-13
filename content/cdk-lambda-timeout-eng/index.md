---
title: Catch AWS Lambda Timeouts 
show: "yes"
date: "2022-07-10"
# image: "lambda.png"
tags: ["eng", "2022", "aws"] #nofeed
gerUrl: https://martinmueller.dev/cdk-lambda-timeout
pruneLength: 50 #du
---

[![cdk-lambda-timeout-eng](https://img.youtube.com/vi/9Oeu9ewrwXQ/0.jpg)](https://www.youtube.com/watch?v=9Oeu9ewrwXQ)
(Click me :D)

<iframe width="420" height="315" src="https://www.youtube.com/watch?v=9Oeu9ewrwXQ"></iframe>

Ahoy,

AWS Lambda is probably one of the most famous if not the most famous compute service from AWS. In fact, Lambda is also my favorite AWS service because it makes implementing business logic very easy and straightforward. However, a few times I had the problem that the timeout of Lambda was too low and thus the code was not completely executed. Debugging or catching this error was also often exhausting and annoying. A good solution for me was to use the Lambda Duration Metrics to define an alarm.

```ts
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as lambdajs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

const exampleLambda = new lambdajs.NodejsFunction(this, 'ExampleLambda', {
    timeout: core.Duration.seconds(10),
});

new timeoutAlarm - new cw.Alarm(this, 'TimeoutAlarm') {
    metric: exampleLambda.metricDuration({ statistic: 'max' }),
    threshold: exampleLambda.timeout?.toMilliseconds() ?? 1,
    evaluationPeriods: 1,
}

const topic = new sns.Topic(
    this,
    'ErrorTopic',
);
topic.addSubscription(
    new subscriptions.EmailSubscription('alice@bob.com')
);
timeoutAlarm.addAlarmAction(
    new actions.SnsAction(topic)
);
```

As you can see here, a simple Lambda JS Function is created at the beginning. By the way the [NodejsFunction construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_nodejs.NodejsFunction.html) also supports TypeScript. Then the timeout alarm is defined which uses the duration metric and the timeout value from the Lambda to configure.

After that, an Error Topic is created via which the triggered alarm is forwarded by email using an EmailSubscription.

## Advantages

The advantage of this solution is that the Lambda code does not need to be modified and the problem is solved on infrastructure level or AWS CDK level. This solution can be applied to other Lambda languages like Python or Java as well.

## Conclusion

Lambda timeout caching is annoying. With a little AWS CDK code and the Lambda Duration metric, the problem is quickly solved.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
