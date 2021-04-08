---
title: Scrum and GitHub
date: '2021-02-11'
image: 'git.jpg'
tags: ['eng', '2021', 'github']
gerUrl: https://martinmueller.dev/github-scrum
pruneLength: 50
---

Hi.

Our development team does an exciting experiment. We work in Scrum and organize ourselves mainly with GitHub. That works really great1. In this article I describe how we use GitHub for that.

Even though I have experience with Scrum for about 5 years as a developer I give a little disclaimer here. I have never done a Scrum certification. So I will probably misrepresent or misclassify terms. I would then like to ask you to correct me.

Also, our team has only been working together in Scrum for a little over a month. The team is relatively small with 4 people 3 fullstack developers and 1 product owner. Nevertheless I think this post can help you to improve your work process in your team.

In the next section I'll tell you more about GitHub and how we use it to organize ourselves in Scrum.

# GitHub and Scrum

My [GitHub account](https://github.com/mmuller88) is active since 2016. GitHub is by far my favorite Git provider environment. Privately, I use GitHub a lot. I am very happy that I can now use GitHub for work as well. Our main motivations to use GitHub are the low costs and the fact that many developers are already used to GitHub.

In the next section I explain how we use some GitHub features to manage our Scrum way of working.

## GitHub Issues as Tickets

The issues on GitHub can be perfectly used as tickets for Scrum. Using labels it is even possible to give the tickets a size. A size in this context is a number to estimate the complexity of the ticket. Usually these are the Fibonacci numbers 1 3 5 8 13 .

Labels can also be used to assign tickets to their respective components. Component means a kind of subcategory of the project like "component: api" or "component: app" .

## GitHub Projects as Scrum Boards

GitHub Projects are great for Scrum Boards. We have 3 Projects for 3 Boards. Each board represents its own time range and level of abstraction.

### Current Sprint Board

The most important board is of course the "Current Sprint Board" (see in the middle of the cover image). We do a two-week sprint and with the "Current Sprint Board" we reflect on the work or the tickets we are currently working on and want to work on. It has three columns ToDo, In Progress and Done.

Tickets from the Backlog Scrum Board, which will be introduced in the next section, end up here first in the ToDo column. At this point, the tickets should be understandable and sized. At the end of each Sprint, the Done column is emptied and the ToDo column is refilled.

### Backlog Board
The Backlog Board (see below in the title image) is intended for tasks in the period of 2 - 6 weeks and includes all tickets that are not yet in the current Sprint Board. Here they are collected and refined piece by piece. There are four columns from left to right: Backlog, Ready for Sizing, Ready for Sprint and Next Sprint.

In each column, the ticket is refined, e.g. when the ticket is moved from Backlog to Ready for Sizing, it must be comprehensible to all developers so that it can be sized.

When the ticket goes into the Ready for Spring column, it is now ready to potentially go into the next sprint. In the Next Sprint column we agree on which tickets we want to handle in the next sprint.

### Future Board
The Future Board is for ideas / tasks that are still relatively unclear and are in a time interval of about 6 weeks to a year. So far we hardly use this board and have ideas in a separated [Miro](https://miro.com) board.

# Summary
I am still totally flashed how well it works with the tools on GitHub to work in Scrum. The UI of GitHub seems very sophisticated and allows a great Scrum experience. Just give it a try :) !

Thanks to the [DeepL translater (free version)](https://DeepL.com/Translator) for helping with translating to english and saving me tons of time :).

To the wonderful readers of this article I'm saying that feedback of any kind is welcome. In the future I will try to include a discussion and comment feature here. In the meantime, please feel free to send me feedback via my social media accounts such as [Twitter](https://twitter.com/MartinMueller_) or [FaceBook](https://facebook.com/martin.muller.10485). Thank you very much :).

I love to work on Content Management Open Source projects. A lot from my stuff you can already use on https://github.com/mmuller88 . If you like my work there and my blog posts, please consider supporting me on Patreon:

<a href="https://patreon.com/bePatron?u=29010217" data-patreon-widget-type="become-patron-button">Become a Patreon!</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>