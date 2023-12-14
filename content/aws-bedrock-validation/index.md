---
title: Validate your AWS Bedrock LLM responses
show: "no"
date: "2023-12-17"
image: "index.webp"
tags: ["eng", "2023", "aws", "bedrock", "ai", "nofeed"] #nofeed
# engUrl: https://martinmueller.dev/cdk-cost-spikes-eng
pruneLength: 50
---

Validating the response from your Language Learning Model (LLM) is a critical step in the development process. It ensures that the response is in the correct format and contains the expected data. Manual evaluation can quickly become tiresome, especially when making frequent changes to your LLM. Automating or partially automating the validation process is highly recommended to save time and effort.

To ensure efficiency and accuracy, it is highly recommended to automate or partially automate the validation process. In this post, I will demonstrate how you can achieve this automation.

## Before

When I refer to LLM, I am talking about the use of existing foundation models through AWS Bedrock, such as Claude, LLama2, and others. You can learn more about AWS Bedrock [here](https://aws.amazon.com/bedrock/). Additionally, there are other techniques you can use to enhance the response, such as prompt refinements, RAG (Retrieval Augmentation using Vector Databases), or fine-tuning.

## Ideas

Responses from Language Learning Models (LLMs) are often non-deterministic, meaning that different responses can be generated even with the same prompt. However, this behavior can be adjusted to some extent using LLM parameters such as temperature.

### Validate the Shape

In many cases, the response may contain deterministic parts that can be used to partially validate it. For instance, I rely on Claude to provide a JSON response. I have taught Claude the schema of the JSON response, and by performing a schema validation test, I can verify if Claude adheres to the schema. Verifying a JSON schema is very simple. 

Each programming language has a library that can be used to validate the schema. For instance, in TypeScript, I use the [zod library](https://github.com/colinhacks/zod) to create and validate the schema. Which looks like that:

```ts
import { z } from 'zod';

export const NinoxFieldSchema = z.strictObject({
  base: z
    .enum([
      'string',
      'boolean',
      ...
    ])
    .optional(),
  caption: z.string().optional(),
  captions: z.record(z.string()).optional(),
  required: z.boolean().optional(),
  order: z.number().optional(),
  ...
});

export type NinoxField = z.infer<typeof NinoxFieldSchema>;

export const NinoxTableSchema = z.strictObject({
  nextFieldId: z.number().optional(),
  caption: z.string().optional(),
  captions: z.record(z.string()).optional(),
  hidden: z.boolean().optional(),
  ...
});

export type NinoxTable = z.infer<typeof NinoxTableSchema>;

```

And as part of my unit tests:

```ts
test('check schema', async () => {
    ...

    const body = JSON.parse(response.body);

    const validationResult = NinoxTableSchema.safeParse(
        JSON.parse(body.json),
    );
    if (!validationResult.success) {
        console.log(validationResult.error.message);
    }
    expect(validationResult.success).toBeTruthy();
});
```

### Validate Sub-Prompts

In my current AI application, I utilize multiple prompts to generate the final response. While validating the entire response may be challenging, I can easily validate some of the sub-prompts. For instance, I have a deterministic prompt for which I can verify the response.

### Golden Response

This is an idea from the AI community that shows promise. Although I haven't personally tested it yet, the concept is to compare the response with a "golden response" to ensure its correctness. By generating the golden response using the same Language Learning Model (LLM) and comparing it with the actual response, we can determine if they are identical or very similar. This approach holds potential and I'm eager to try it out soon.

## Example

* Response is JSON. JSON has a schema we can check on
* Making multiple prompts and some of them are indeed deterministic

## Thanks

I would like to express my gratitude to the AWS Community for their invaluable assistance in helping me.

A special thanks goes to [Chris Miller](https://www.linkedin.com/in/chris-t-miller) for giving me a lot of thoughts and feedback on my validation approach. [Neylson Crepalde](https://www.linkedin.com/in/neylsoncrepalde/) for making me aware and explaining the golden response validation method.

Once again, thank you all for your support and contributions.

## Conclusion

Working with AWS Bedrock AI is incredibly enjoyable. The field is constantly evolving, and there is always something new to learn. In this post, I explained how to validate your LLM responses.

I hope you found this post helpful, and I look forward to sharing more with you in the future.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on the:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)
