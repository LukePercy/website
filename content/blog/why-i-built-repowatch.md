---
title: "Why I Built repowatch.io"
author: "Luke Percy"
date: "2026-03-24"
excerpt: "Building something immediate in a period of uncertainty"
description: "repowatch.io started as a lightweight way to assess inherited codebases, but the deeper reason for building it was agency during a period of uncertainty."
---

There is the product explanation for **repowatch.io**, and then there is the real reason I built it.

## The product explanation

The product explanation is straightforward enough.

There is a lot of noise right now around **shadow AI**, **vibe-coded apps**, **inherited repositories**, and teams trying to work out what risk they are actually carrying in their **codebases**. **repowatch.io** came from that space: a lightweight way to get a quick read on a codebase across **code quality**, **test confidence**, **security basics**, and **AI-risk signals**.

Part of the reason I built it is that I could not see many **lightweight code scanning tools** that pulled those signals together in one place. There are plenty of tools that go deep on one layer, but far fewer that give you a fast, practical read across the broader mix of risk that shows up in modern repositories.

I also think there is room for a **low-cost developer tool** in this space. Not every team needs, or can justify, a heavyweight enterprise platform just to get an initial sense of what they are dealing with. Sometimes they need an affordable way to triage a repository quickly, understand where the sharper edges are, and decide what deserves deeper attention.

But that is only part of the story.

## The more honest reason

The more honest reason is that I wanted to build something immediate. Something I could ship, test, and put in front of people without waiting for permission.

When runway is short and not much is locked in yet, it is easy to feel like too much of your future sits in other people’s hands. CVs and cover letters go out. Some opportunities move quickly, others take longer to work through, and product ideas often sit in that awkward space between possibility and proof. You can spend a lot of time waiting to hear whether something will happen.

That kind of waiting is not just a financial problem. It gets into your head too, especially if you are the sort of person who is always trying to make sense of what to do next.

For me, **repowatch.io** was a way of creating some movement in the middle of that **uncertainty**. Not because I was certain it would work. Not because I thought I had discovered the next big thing. More because it was something immediate, useful, and within my control. It gave me somewhere to put energy, and some creativity to apply to a real problem. For me, that was not a small thing.

## Building for agency, not certainty

Sometimes building is not really about certainty. It is about **agency**. It is about taking a real problem, however small, and turning it into something concrete.

- A live product
- A working site
- A proposition someone can react to
- A price
- A customer flow
- A thing that now exists in the world rather than just in your head

**repowatch.io** may turn into a useful small **SaaS**. It may generate some income. It may produce **market signal**. It may simply become proof that I can still spot an opening, move quickly, and ship something real. Any of those outcomes would be worthwhile.

## The posture I am trying to hold

I think that is also the broader posture I am trying to hold right now:

- Build where I can
- Test ideas in the open
- Create options instead of only waiting for them to appear
- Stay practical
- Keep some momentum

That applies as much to **repowatch.io** as it does to **advisory work** or the other work I am trying to shape. None of it is guaranteed. But I would still rather be moving than sitting entirely still.

## More than a product

So yes, **repowatch.io** is a product. It is also a marker. A small reminder to myself that even in uncertain periods, I can still make things happen.

If that resonates, or if you are dealing with **inherited codebases**, **rushed builds**, or the odd **vibe-coded app** that somehow became important, **repowatch.io** is live here:

[https://repowatch.io/](https://repowatch.io/)

## Build notes and session timeline

If you want the practical implementation details, I captured the full diagnosis and deployment session below, including the publish timing issue, ISR fix, and what we changed in CI.

<ConversationSummaryEmbed
	title="How the first RepoWatch blog release was debugged"
	description="A side-by-side conversation and engineering timeline covering root cause, deploy fixes, and process lessons."
/>
