---
title: Amplify AppSync Permission
show: "yes"
date: "2023-02-05"
image: "index.jpg"
tags: ["eng", "2023", "aws", "cdk", "amplify"]
gerUrl: https://martinmueller.dev/amplify-permission
pruneLength: 50 #ihr
---

Hi,

With Amplify AppSync it is possible to configure an AWS AppSync with declarative code. With [Directives](https://docs.amplify.aws/cli-legacy/graphql-transformer/directives/) like __@model__, __@auth__ or __@function__ other AWS services like DynamoDB, Cognito or Lambda can be connected to AppSync in a meaningful way. This makes it a powerful tool. With just a few lines of GraphQL code, a lot can be configured in AWS, so to speak.

Below you can see an Amplify AppSync example:

```graphql
type User
  @model
  @key(fields: ["email"])
  @auth(
    rules: [
      { allow: groups, groups: ["admin"] }
      { allow: private, provider: iam }
      { allow: owner, ownerField: "email", identityClaim: "email" }
    ]
  ) {
  email: String!
  role: Role!
  ...
}
```

There is a lot going on here! With the @model directive, a DynamoDB table with the name User is automatically created which stores the user entries as DynamoDB items. With @key the email is set as PK (Partition Key). The permission, who is allowed to access the items, is defined with @auth. A user in the admin group is allowed to query, mutate and subscribe to all items.

With { allow: private, provider: iam } an IAM entity that has the required permissions is also allowed to querry, mutate and subscribe to the items. I use this for example with lambdas that should perform certain tasks like creating new users in the table when they log in via Cognito for the first time.

Last but not least with { allow: owner, ownerField: "email", identityClaim: "email" } Cognito users who have identified themselves via oauth2 are allowed to access their items. The identity claim email is supplied by the Cognito JWT token and is then matched with the email defined in the item.

Pretty cool, isn't it? With just these few lines of Amplify AppSync GraphQL code, we get a lot of functionality.

## Permission for shared items

Defining permission with @auth works very well for simple cases like the user example shown here. But what if you want to access items from multiple users? Well here are several possibilities I want to introduce. But first I will introduce the table with the shared items:

```graphql
type Project
  @model
  @auth(
    rules: [
      { allow: groups, groups: [ "admin"] }
      { allow: private, provider: iam }
    ]
  ){
  id: ID!
  projectNumber: Int!
  ...
}
```

A project should be accessible to several users. The simplest approach would be to store the users in a string list.

## String-List

The code must be adapted only minimally with:

```graphql
type Project
  @model
  @auth(
    rules: [
      { allow: groups, groups: [ "admin"] }
      { allow: private, provider: iam }
      { allow: owner, ownerField: "userEmails", identityClaim: "email" }
    ]
  ){
  id: ID!
  projectNumber: Int!
  userEmails: [String] # <-- user string list
  ...
}
```

The userEmails string list now just needs to be kept up to date with the emails from the users who can access it. However, managing the userEmails is costly and requires additional code and space in the item.

## Virtual Lambda

We could also use a virtual lambda which dynamically calculates if the user should have access or not.

```graphql
type Project
  @model
  @auth(
    rules: [
      { allow: groups, groups: [ "admin"] }
      { allow: private, provider: iam }
      { allow: owner, ownerField: "userEmail", identityClaim: "email" }
    ]
  ){
  id: ID!
  projectNumber: Int!
  userEmail: String @function("userEmailLambda")
  ...
}
```

The solution is impressive because of the reduced space in the DynamoDB table. However, with a large number of items it would mean a large number of lambda calls which would drive up the cost. Also, the delay due to the lambda call can be too significant.

## JWT Claim

This idea is probably the most creative. Using the pre-token-generation trigger Lambda a claim can be set which signals which item may be accessed. The code for Amplify AppSync looks something like this:

```graphql
type Project
  @model
  @auth(
    rules: [
      { allow: groups, groups: [ "admin"] }
      { allow: private, provider: iam }
      { allow: owner, ownerField: "id", identityClaim: "currentProjectId" }
    ]
  ){
  id: ID!
  projectNumber: Int!
  ...
}
```

The identity claim __currentProjectId__ is set by the pre-token-generation trigger Lambda. I find this method the most elegant and use it in my projects.

The code for the lambda might look something like this:

```ts
import AppsyncClient from 'appsync-client';
import * as lambda from 'aws-lambda';
import {
  CreateUserDocument,
  GetUserDocument,
  Role,
} from './../../stueli/src/lib/api';

const { APPSYNC_URL } = process.env;

const client = new AppsyncClient({ apiUrl: APPSYNC_URL });

/**
 * https://www.npmjs.com/package/appsync-client
 * @param event
 */
export async function handler(event: lambda.PreTokenGenerationTriggerEvent) {
  console.debug(`event: ${JSON.stringify(event)}`);

  const { getUser } = await client.request({
    query: GetUserDocument,
    variables: {
      email: event.request.userAttributes.email,
    },
  });

  console.debug(`getUser=${JSON.stringify(getUser ?? {})}`);

  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      ...(getUser?.currentProjectId
        ? { currentProjectId: getUser.currentProjectId }
        : {}),
    },
  };

  console.debug(
    `event.response.claimsOverrideDetails=${JSON.stringify(
      event.response.claimsOverrideDetails,
    )}`,
  );

  return event;
}
```

The Lambda determines first which Project the user may access with __currentProjectId__ and then it sets the claim `currentProjectId:1234`. Now must be implemented of course still like the user the currentProjectId at all change and/or set can and like afterward the JWT Token is reloaded.

In my case, this happens when the user clicks on the project via the React router. First, the currentProjectId entry is made in the user table and then the JWT token is reloaded using the JWT Refresh token. If you would like to have this in detail, please write me.

## Conclusion

I have presented here different methods of how permissions can be realized with the Amplify AppSync directive @auth. If you have any other cool ideas, feel free to let me know.

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on the:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

OR

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

And don't forget to visit my site

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)