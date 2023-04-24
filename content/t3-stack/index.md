---
title: What did I learn from Theos T3 Stack Tutorial Video.
show: "no"
date: "2023-02-05"
image: "index.jpg"
tags: ["de", "2023", "nextjs", "tailwind", "trpc", "prisma", "nofeed"]
pruneLength: 50 #ihr
---

For developing an MVP (Minimal Viable Product), I'm all in to the [T3 Stack](https://martinmueller.dev/t3-stack-mvp). The T3 Stack consist of the following components: NextJS, TailwindCSS, trpc and prisma. That gives you an amazing developer experience when developing. I really think it can beat no-code and low-code solutions when developing your MVP. [Theo]() was so kind to record a video for how to develop a [Twitter clone with the T3 Stack](https://www.youtube.com/watch?v=YkOSUVzOAA4). I surely learned a ton out of that video and not only about the T3 Stack, moreover of how to become a better developer. I will share my learnings with you in this post.

## My Background

I consider myself as a full-stack developer. I started out like 2016 with Java in backend worlds. With 2017 I got fascinated to the AWS Cloud and shifted my focus to AWS DevOps. In 2021 I started to learn React which was super tough for me and I didn't felt like making fast progress as I was used to from backend. But I fell in love with TypeScript and starting from them it was my preferred choice of programming language. So until now I never felt super confident as a React frontend developer. I was super pumped when I saw the T3 Stack and it has an been an amazing journey so far.

## What I learned

## Don' split

* Don't split into separated files to early. Throughout the whole course.

## When do components

* Organizing in components early on when it contains state or even just props

## Detangle Workflows

* Detangle workflows. Where he loads users from clerk and gets the posts from database around Minute 50.

## Do auth with Clerk

* Using Clerk for authentication and creating a signin/signout flows and components.

## Becoming a div master

* Using a border to see the layout like from a div. Around Minute 10

## Component please

* Creating a loading spinner component with using flowbite
* Wrapping component in Page

## tRPC authenticated

* Writing an authenticated procedure with TRPC around 1:10.

* How to invalidate the useQuery cache and fetch new data `getAll.invalidate()`. 1:36

* Implementing a rate limiter

WEITER 1:33:45

## Homework

At the end Theo mentioned he would to the input of the Post Wizard with [react-hook-form]() instead state managing. That is What I did.

* https://kitchen-sink.trpc.io/react-hook-form?file=#content

## Fazit

Ich habe hier unterschiedliche Methoden vorgestellt wie Permissions mit der Amplify AppSync directive @auth realisiert werden können. Wenn ihr noch andere coole Ideen habt, dann lasst es mich gerne wissen.

Ich liebe es, an Open-Source-Projekten zu arbeiten. Viele Dinge kannst du bereits frei nutzen auf [github.com/mmuller88](https://github.com/mmuller88). Wenn du meine Arbeit dort und meine Blog-Posts toll findest, denke doch bitte darüber nach, mich zu unterstützen:

[![Buy me a Ko-Fi](https://storage.ko-fi.com/cdn/useruploads/png_d554a01f-60f0-4969-94d1-7b69f3e28c2fcover.jpg?v=69a332f2-b808-4369-8ba3-dae0d1100dd4)](https://ko-fi.com/T6T1BR59W)

Oder

[![Buy me a Ko-Fi](https://theastrologypodcast.com/wp-content/uploads/2015/06/become-my-patron-05.jpg)](https://www.patreon.com/bePatron?u=29010217)

Und schau doch mal auf meiner Seite vorbei

[![martinmueller.dev](https://martinmueller.dev/static/84caa5292a6d0c37c48ae280d04b5fa6/a7715/joint.jpg)](https://martinmueller.dev/resume)