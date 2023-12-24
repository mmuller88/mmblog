---
title: How to Unit Testing your AWS Bedrock AI Lambda
show: "No"
date: "2023-12-18"
image: "index.jpg"
tags: ["eng", "2023", "aws", "bedrock", "ai", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/aws-bedrock-validation
pruneLength: 50
---

* Playing with the AWS Bedrock API for AI MVPs is super fun. Recently wrote https://martinmueller.dev/aws-bedrock-validation.
* I love being to quickly iterate my ideas for MVPs so unit testing is super important.

## Lambda Unit Testing

* When using Lambda to call the AWS Bedrock API writing Lambda unit tests is super powerful to quickly evaluate and test your LLM settings and prompts.

## Lambda Streaming Response & Unit Testing

* I'm using the Lambda Streaming Response feature. For having an earlier feedback from the LLM similar as you experience when using ChatGPT. As I use the Lambda Streaming response the exact arguments for the handler function are a bit tricky. Streaming Response Example blog posts.

## Examples

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

## Golden Response

...

## Thanks

I would like to express my gratitude to the AWS Community for their invaluable assistance in helping me.

A special thanks goes to [Chris Miller](https://www.linkedin.com/in/chris-t-miller) for giving me a lot of thoughts and feedback on my validation approach. [Neylson Crepalde](https://www.linkedin.com/in/neylsoncrepalde/) for making me aware and explaining the golden response validation method.

Once again, thank you all for your support and contributions.

## Conclusion

Working with AWS Bedrock AI is incredibly enjoyable. The field is constantly evolving, and there is always something new to learn. In this post, I explained how to partly validate your LLM responses.

I am passionate about contributing to Open Source projects. You can find many of my projects on [GitHub](https://github.com/mmuller88) that you can already benefit from.

If you found this post valuable and would like to show your support, consider supporting me back. Your support will enable me to write more posts like this and work on projects that provide value to you. You can support me by:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Pateron](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
