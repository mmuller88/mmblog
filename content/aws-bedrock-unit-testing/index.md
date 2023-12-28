---
title: How to Unit Testing your AWS Bedrock AI Lambda
show: "no"
date: "2023-12-30"
imagePreviewUrl: "https://nwjl3sera1.execute-api.us-east-1.amazonaws.com?projectId=unittesting&state=preview"
imageVisitorUrl: "https://nwjl3sera1.execute-api.us-east-1.amazonaws.com?projectId=unittesting&state=visitor"
tags: ["eng", "2023", "aws", "bedrock", "ai", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/aws-bedrock-validation
pruneLength: 50
---

Using the AWS Bedrock API for MVPs is super fun! I just recently wrote an article how you can make the LLM Claude respond in JSON. Check it out [here](https://martinmueller.dev/aws-bedrock-validation). Even it is super fun it can become tiresome and annoying to test your LLM settings and prompts. In this article I will explain how you can unit test your Lambda function that calls the AWS Bedrock API. Being able to unit test your prompt lets you quickly iterate to your desired MVP or project state you have in mind.

## Lambda Unit Testing

As it core a Lambda is really just a function that executes code. So unit testing it is pretty simple. You just need to call the function with the desired arguments and validate the response. And if you use node jest makes it easy to run your test code.

## Lambda Streaming Response & Unit Testing

The Lambda Streaming Response allows to leverage the streaming response from your LLM. Using the streaming response from your LLM is important as it gives your early feedback. That is pretty much what is happening when ChatGPT gives your those word by word streaming response.

## Lambda

Here I show you a bit from the Lambda Function I want to unit test later.

```ts
async function handler(
  event: APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2>,
  responseStream: lambdaStream.ResponseStream,
  ctx?: Context,
) {
  console.log(`event: ${JSON.stringify(event)}`);

  const body = event.body ? JSON.parse(event.body) : undefined;
  const { userInput, ninoxTables } = body;

  ...

  const bedrockParams: InvokeModelCommandInput = {
    modelId: 'anthropic.claude-v2:1',
    contentType: 'application/json',
    accept: '*/*',
    body: JSON.stringify({
      prompt: `\n\nHuman: ${prompt}\n\nAssistant:{`,
      // prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
      temperature: 0,
      top_k: 250,
      top_p: 0.999,
      max_tokens_to_sample: 4096,
    }),
  };
  console.log(`bedrockParams: ${JSON.stringify(bedrockParams)}`);

  const command = new InvokeModelWithResponseStreamCommand(bedrockParams);

  //InvokeModelWithResponseStreamCommandOutput
  const response: any = await client.send(command);
  ...

  responseStream.end();
}
```

## Unit Testing

And here is the unit test in a file living next to my Lambda function.

```ts
import { ArcbotLambdaInput, handler } from '../src/arcbot-stack.stream';

...

test('userInput: How is the weather?', async () => {
  const response = await handler(
    mockEvent({
      userInput: 'How is the weather?',
    }),
    //@ts-ignore
    '',
  );
  console.log(response);

  // do some validation
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body)).toEqual({
    respond: 'I do not understand. Please rephrase!',
  });
});

test('Create a customer table', async () => {
  const response = await handler(
    mockEvent({
      userInput: 'Create a customer table',
    }),
    //@ts-ignore
    '',
  );

  // do some validation
  commonExpects(response);
  const body = JSON.parse(response.body) as Record<string, NinoxTable>;
  console.log(`body: ${JSON.stringify(body, null, 2)}`);

  const validationResult = z.record(NinoxTableSchema).safeParse(body);
  if (!validationResult.success) {
    console.log(validationResult.error.message);
  }
  expect(validationResult.success).toBeTruthy();

  expect(Object.entries(body)[0][0]).toBe('customer');
  expect(Object.entries(body)[0][1].caption).toBe('Customer');
});

const mockEvent = ({ userInput }: ArcbotLambdaInput) => {
  const event: lambda.APIGatewayProxyEventV2 = {
    version: '',
    ...
    body: JSON.stringify({ userInput } as ArcbotLambdaInput),
  };

  return event;
};
```

## Conclusion

Unit testing your Lambda function that calls the AWS Bedrock API is super important. It allows you to quickly iterate to your desired MVP or project state you have in mind. I hope this article was helpful for you. If you have any questions or feedback please reach out to me.

I am passionate about contributing to Open Source projects. You can find many of my projects on [GitHub](https://github.com/mmuller88) that you can already benefit from.

If you found this post valuable and would like to show your support, consider supporting me back. Your support will enable me to write more posts like this and work on projects that provide value to you. You can support me by:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Pateron](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
