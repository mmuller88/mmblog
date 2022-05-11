---
title: Create and delete AWS Accounts programmatically
show: "yes"
date: "2022-05-11"
# image: "title.png"
tags: ["eng", "2022", "aws", "sdk", "organizations"] #nofeed
gerUrl: https://martinmueller.dev/sdk-org
pruneLength: 50
---

Hi.

In AWS, it is best practice to create new accounts if, for example, you want to deploy different stages such as dev, qa and prod for your solution. It is also common to create so-called sandbox AWS accounts to provide these new employees for testing AWS services. There are many more reasons why new AWS accounts should be created.

Now creating such AWS accounts can be quite time consuming if it has to be done manually. With AWS Organizations, the AWS [JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html) and a little TypeScript knowledge, the process can be automated for the most part. In this post, I'll introduce how this works. To do this, I first explain what AWS Organizations is in the first place and then I introduce the two TypeScript scripts that can create and delete the AWS Sandbox accounts using the AWS SDK.

## AWS Organizations

AWS Organizations helps to manage the AWS accounts. In so called Organizational Unites (OU) accounts can be grouped together. Furthermore, security mechanisms such as policies can be defined across accounts. AWS Organizations offers much more functionality and I would like to refer to the public documentation. Interesting for this post is that there is also a [JavaScript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html) wrapper for the AWS Organizations API that we will use in the next sections to dynamically create and delete accounts.

## createAccount and deleteAccount

I created a small helper library in [GitHub](https://github.com/mmuller88/aws-accounts) to simplify the programmatic creation and deletion of AWS accounts. An AWS SDK script could then be easily built such as:

```ts
import {
 createAccount,
 moveAccountToOU,
 getAccountIdFromName,
} from "aws-accounts

export async function main(): Promise<void> {
 var args = process.argv.slice(2)

 if (args.length !== 1) {
  usage()
  throw new Error("Wrong number of arguments")
 }

 const accountName = args[0]

 const response = await createAccount(accountName)
 const accountId = await getAccountIdFromName(accountName)
 if (accountId) {
  await moveAccountToOU(accountId, "ou-zblx-w7yw0qge")
 }
}
```

The code can also be seen in the repo [here](https://github.com/mmuller88/aws-accounts/blob/main/test/createAccountScript.ts).

The library is a lightweight wrapper around AWS SDK TypeScript v.2 . With `await createAccount(accountName)` the account is created first. Then with `await getAccountIdFromName(accountName)` and `await moveAccountToOU(accountId)` the account is moved to the defined OU (Organizational Unit).

## Summary

In this blog post I explained why it is sometimes necessary to create new AWS accounts and how this can be done using AWS Organizations and the JavaScript SDK. For this I created a createAccount and a deleteAccount script and presented them here. Did you find the post helpful or do you have any suggestions for improvement? Let me know and write me :).

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

I love to work on Open Source projects. A lot of my stuff you can already use on <https://github.com/mmuller88> . If you like my work there and my blog posts, please consider supporting me on:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Or

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)
