---
title: Automatically validate your AWS Bedrock LLM Responses
show: "yes"
date: "2023-12-18"
imagePreviewUrl: "https://api.ab.martinmueller.dev?projectId=validation&state=preview"
imageVisitorUrl: "https://api.ab.martinmueller.dev?projectId=validation&state=visitor"
tags: ["eng", "2023", "aws", "bedrock", "ai"] #nofeed
# engUrl: https://martinmueller.dev/aws-bedrock-validation
pruneLength: 50
---

Validating the response from your Language Learning Model (LLM) is a critical step in the development process. It ensures that the response is in the correct format and contains the expected data. Manual evaluation can quickly become tiresome, especially when making frequent changes to your LLM. Automating or partially automating the validation process is highly recommended to save time and effort. In this post, I will discuss and demonstrate some ideas how you can achieve this automation.

## Before

When I refer to LLM, I am talking about the use of existing foundation models through AWS Bedrock, such as Claude, LLama2, and others. You can learn more about AWS Bedrock [here](https://aws.amazon.com/bedrock/). There are techniques you can use to enhance the response, such as prompt refinements, RAG (Retrieval Augmentation using Vector Databases), or fine-tuning.

Responses from Language Learning Models (LLMs) are often non-deterministic, meaning that different responses can be generated even with the same prompt. However, this behavior can be adjusted to some extent using LLM parameters such as temperature.

## Ideas

In the following sections I will present some ideas for creating automated tests for your LLM responses. I will also provide some examples of how I implemented these ideas in my own projects.

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

### Validate Sub-Responses

In my current AI application, I utilize multiple LLM calls to generate the final response. While validating the entire response may be challenging, I can easily validate some of the sub-responses. For instance, I have a deterministic response for which I can verify the response. The deterministic response classifies a user's intent into a specific category. For example, if the user asks to create a table, the intent is classified as "create_table". That will generate a deterministic sub-response in my AWS Lambda for the "create_table" intent. To test the accuracy of the classification, you can use well-known methods such as train-validation-test Split the training data into subsets for training and validation. I'll describe this technique more in the next section.

### Train-Validation-Test Split

The [train-validation-test split](https://medium.com/@evertongomede/the-significance-of-train-validation-test-split-in-machine-learning-91ee9f5b98f3) is very crucial to messsure the performance of the LLM. One methods of those splits is the k-fold cross validation. I try to explain this approach in easy words. Make sure to check the far more technical artical from [Everton Gomede, PhD, The Significance of Train-Validation-Test Split in Machine Learning](https://medium.com/@evertongomede/the-significance-of-train-validation-test-split-in-machine-learning-91ee9f5b98f3)!

For instance, you could use 90 percent of the data for training and 10 percent for validation. Then, you can use the validation data to test the accuracy of the classification. Additionally, you can use permutation to shift the 10 percent of the validation data. I implemented a simple algorithm in TypeScript which helps me to calculate the accuracy of the classification:

```ts
import { test } from "@jest/globals"
import * as ArcbotStackStream from "../src/arcbot-stack.stream"
import {
 call_bedrock,
 generate_intent_identification_prompt,
 generate_table_identification_prompt,
 modify_table_prompt,
 relationship_json_prompt,
} from "../src/arcbot-stack.stream"
import {
 intentTrainingsData,
 modifyTableTrainingsData,
 oneToManyTrainingsData,
 tableIdentificationData,
} from "../src/training-data"

const runEvaluation = async <T extends { [s: string]: string[] }>(
 trainingData: T,
 jestSpy: jest.SpyInstance<T, [], any>,
 promptRefinement: (userInput: string) => Promise<string>,
 jsonResponse?: boolean
) => {
 const getTrainingAndEvaluationPermutations = (trainingsData: T) => {
  // Split trainings data into training and evaluation data
  const sliceTrainingsData = (fromPercentage: number, toPercentage: number) =>
   Object.entries(trainingsData).reduce(
    (acc, data) => {
     const evaluationSlice = data[1].slice(
      data[1].length * fromPercentage,
      data[1].length * toPercentage
     )
     const trainingSlice = data[1].filter((d) => !evaluationSlice.includes(d))
     return {
      training: { ...acc.training, [data[0]]: trainingSlice } as T,
      evaluations: {
       ...acc.evaluations,
       [data[0]]: evaluationSlice,
      } as T,
     }
    },
    {
     training: {} as T,
     evaluations: {} as T,
    }
   )
  const trainingPercentage = 0.9
  const validationPercentage = 1 - trainingPercentage

  // permute the training and evaluation data
  const trainingValidationPermutations = [
   sliceTrainingsData(0, 0 + validationPercentage),
  ]
  for (let i = 0 + validationPercentage; i < 1; i = i + validationPercentage) {
   trainingValidationPermutations.push(
    sliceTrainingsData(i, i + validationPercentage)
   )
  }

  console.log(
   `trainingValidationPermutations: ${JSON.stringify(
    trainingValidationPermutations
   )}`
  )
  return trainingValidationPermutations
 }

 let correctResponses = 0
 let wrongResponses = 0

 const trainingRecords = getTrainingAndEvaluationPermutations(trainingData)

 for (const trainingPermutation of trainingRecords) {
  console.log(`trainingPermutation=${JSON.stringify(trainingPermutation)}`)

  jestSpy.mockImplementation(() => trainingPermutation.training)

  for (const evaluationRecords of Object.entries(
   trainingPermutation.evaluations
  )) {
   for (const input of evaluationRecords[1]) {
    const intent_prompt = await promptRefinement(input)
    const response = await call_bedrock(intent_prompt, jsonResponse)

    let received = response

    // trim to JSON string
    if (jsonResponse) {
     received = JSON.stringify(JSON.parse(received))
    }

    console.log(`Expected ${evaluationRecords[0]}\nReceived ${received}`)

    if (evaluationRecords[0] === received) {
     correctResponses++
    } else {
     wrongResponses++
    }
   }
  }
 }
 console.log(
  ` correctResponses: ${correctResponses}\n wrongResponses: ${wrongResponses} \n ${
   correctResponses / (correctResponses + wrongResponses)
  } accuracy`
 )
}

test("evaluate one to many", async () => {
 const mockTrainingsData = jest.spyOn(
  ArcbotStackStream,
  "getOneToManyTrainingData"
 )

 const oneToManyPromptRefinement = async (userInput: string) =>
  relationship_json_prompt(
   {
    CUSTOMER: { caption: "Customer" },
    EMPLOYEE: { caption: "Employee" },
    INVOICE: { caption: "Invoice" },
   },
   userInput
  )

 await runEvaluation(
  oneToManyTrainingsData,
  mockTrainingsData,
  oneToManyPromptRefinement,
  true
 )
})

test("evaluate intent", async () => {
 const mockTrainingsData = jest.spyOn(
  ArcbotStackStream,
  "getIntentTrainingData"
 )

 const generate_intent_identification_promptRefinement = async (
  userInput: string
 ) => generate_intent_identification_prompt(userInput)

 await runEvaluation(
  intentTrainingsData,
  mockTrainingsData,
  generate_intent_identification_promptRefinement
 )
})

test("evaluate table identification", async () => {
 const mockTrainingsData = jest.spyOn(
  ArcbotStackStream,
  "getTableIdentificationData"
 )

 const generate_table_identification_promptRefinement = async (
  userInput: string
 ) => {
  const prompt = generate_table_identification_prompt(
   userInput,
   Object.keys(tableIdentificationData)
  )

  return prompt
 }

 await runEvaluation(
  tableIdentificationData,
  mockTrainingsData,
  generate_table_identification_promptRefinement
 )
})

test("evaluate modify table", async () => {
 const mockTrainingsData = jest.spyOn(
  ArcbotStackStream,
  "getModifyTableTrainingsData"
 )

 modifyTableTrainingsData

 const modify_table_promptRefinement = async (userInput: string) => {
  const prompt = await modify_table_prompt({}, userInput)

  return prompt
 }

 await runEvaluation(
  modifyTableTrainingsData,
  mockTrainingsData,
  modify_table_promptRefinement,
  true
 )
})
```

I think the most interesting part here is the method interface `getTrainingAndEvaluationPermutations(trainingData)` as that always expect the same format as input and gives you back a permuted test validation split of the input training data. The training data have to be in record string list shape:

```ts
<T extends { [s: string]: string[] }>
```

Where the key represents the expected result / classification class / LLM output and the value represents possible inputs which leads to the result. The result will be this type:

```ts
{
 training: T
 evaluations: T
}
;[]
```

It is an Array representing the permutations. Each permutation has a `training` and `evaluations` slice.

One traing data example would be:

```ts
export const intentTrainingsData: { [key: string]: string[] } = {
 create_new_table: [
  "Create table to store invoices",
  "I need to store my customers information",
  "I need a table for my employees",
 ],
 modify_existing_table: [
  "Customers table should also have an address",
  "Add address to the customer table",
  "Invoice should have a date",
 ],
 link_two_tables: [
  "Customer should have multiple invoices",
  "Each employee should be responsible for multiple customers",
 ],
 do_not_know: [
  "How are you today?",
  "What is your name?",
  "What is the weather today?",
 ],
}
```

This training set is to teach the model the intent recognition of the user. The permuted training validation would looks like:

```ts
[
 {
  training: {
   create_new_table: [
    "Create table to store invoices",
    "I need to store my customers information",
   ],
   modify_existing_table: [
    "Customers table should also have an address",
    "Add address to the customer table",
   ],
   link_two_tables: [
    "Customer should have multiple invoices",
   ],
   do_not_know: [
    "How are you today?",
    "What is your name?",
    "What is the weather today?",
    "2 + 3",
   ],
  },
  evaluations: {
   create_new_table: [
     "I need a table for my employees",
   ],
   modify_existing_table: [
     "Invoice should have a date",
   ],
   link_two_tables: [
    "Customer should have multiple invoices",
    "Each employee should be responsible for multiple customers",
   ],
   do_not_know: [
    "How are you today?",
    "What is your name?",
   ],
  },
 },
 {
  training: {
   create_new_table: [
    "Create table to store invoices",
    "I need to store my customers information",
    "I need a table for my employees",
   ],
   modify_existing_table: [
    "Customers table should also have an address",
    "Add address to the customer table",
    "Invoice should have a date",
   ],
   link_two_tables: [
    "Each employee should be responsible for multiple customers",
   ],
   do_not_know: [
    "How are you today?",
    "What is your name?",
    "What is the weather today?",
    "2 + 3",
   ],
  },
  evaluations: {
   create_new_table: [
    "Create table to store invoices",
    "I need to store my customers information",
    "I need a table for my employees",
   ],
   modify_existing_table: [
    "Customers table should also have an address",
    "Add address to the customer table",
    "Invoice should have a date",
   ],
   link_two_tables: [
    "Customer should have multiple invoices",
    "Each employee should be responsible for multiple customers",
   ],
   do_not_know: [
    "What is the weather today?",
   ],
  },
 },
]
```

### Golden Response

This is an idea from the AI community that shows promise. Although I haven't personally tested it yet, the concept is to compare the response with a "golden response" to ensure its correctness. The golden response can be compared with the actual response with the same Language Learning Model (LLM). We can then determine if they are identical or very similar. This approach holds potential and I'm eager to try it out soon.

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