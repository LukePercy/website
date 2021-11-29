---
title: Getting Dicey Trading Cards
date: 2021-11-14
blurb: Technical -  An opportunity to learn to code. A Twitch Extension for https://twitch.tv/gettingdicey
---

# Preamble

---

As part of my weekly routine, Monday's at 7:30pm NZT I sit down to watch Twitch for a couple of hours of Dungeons and Dragons from a local D&D crew.
Hosted by an old collegue of mine, [Getting Dicey](https://twitch.tv/gettingdicey) is alot of fun. Just, a bunch of kiwis having a laugh after work.

The Twitch stream has been rather successful over the last 3 years, gaining over 900 followers, with plenty of regulars and subscribers tuning in every Monday from around the world (_waves_ to Kyosti).

# The Idea

---

Host and Dungeon Master (whom I'll call our Product Owner) had a desire to introduce something to the channel, something that users could participate and engage with while on stream, but without them having commit to paying with real money.

There are a few ways viewers can support Twitch streamers, either following the channel, which is free, or paid methods such as Subscribing or buying and giving the channel 'Bits', a digital currency on the platform where you can buy a bundled amount and share with any channel you are watching with the click of a button.

Twitch released a few years ago another support method, Channel Points. These accumulate beneath the chat (twitch viewers can interact with Streamers via chat messaging as well), as you watch the stream, you are awarded roughly 30 points per 15 minutes. Viewers can, like Bits, select an option below the chat to spend their Channel Points on various rewards curated by the broadcaster.

# Could I do it?

---

The first thing I did was sit down and take a look at Twitch's developer docs. After about 2 hours of looking over the documentation, it did appear to have a very extensive [Rest Api](https://dev.twitch.tv/docs/api/).

The Product Owner and I had a chat on the community discord, so they could brief me on the idea, I then broke it down into a simpler user story.

> As a Viewer
>
> I want to spend Twitch Channel Points to unlock a random getting dicey trading card
>
> So that I can collect and view them

From here I could break down the objectives...But before I open an editor, more research was needed. I knew [Twitch Extensions](https://dev.twitch.tv/docs/extensions) existed, I knew there was a developer community out there, and I hadn't written any code in a very long time...

## Presentation Proof of Concept

---

I wanted to learn a few things with the proof of concept:

- React.js
- Displaying _n_ number of cards nicely and intutively

My gut estimate was this was going to take 3 weekends of schedule, roughly spending 2 hours each day, and my lovely wife would take the kids out for a couple of Saturdays so I could spend roughly 3 to 6 hours each weekend. That was my goal, and enough to keep me motivated.

# and 3 weekends later...I had a PoC.

---

---

---

![Proof of Concept of trading cards](/GDCollectionPrototype.gif "Animated gif of prototype") ![Proof of Concept of trading cards card flip](/GDflipfix.gif "Animated gif of prototype")

# PoC TICK!

---

Now that I had a PoC. It was time to understand if and how I could store data, thats where [MongoDB](https://cloud.mongodb.com/) came in. Now it was getting tricky. You see, there are some limitations with [Twitch Extensions](https://dev.twitch.tv/docs/extensions), particularily what you can, and cannot do client side in the extension itself. Twitch hosts the client side code to iframe the application in various views, Twitch do not provide a backend. I needed to store various things, OAuth API tokens, viewers card collection data etc. This needed a backend. After, a few hours of reading, I learned alot about Twitch Extension architecture, such as the EBS or "Extension Backend Service". This has to be hosted by you, the Extension developer, and Twitch provides the preferred mechanisms to connect to that EBS using JWT or [JSON Web Tokens](https://jwt.io/).

[Heroku](https://www.heroku.com/) to the rescue! Wow, we live in an amazing time in the web, I haven't been this excited since Flash and ActionScript...Anywho, Heroku _is a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud._ What this means, is I am able to easily set up a Node server on Heroku (for free) under the Hobbyiest tier (though we are now paying for the $7 tier now that it's live), and it only took an hour to learn and deployments are simply a git commit. A Special thanks to my work colleque Feng, as here is where I got a bit stuck...

I learned HEAPS here:

- Nodejs
- Authenticated Headers
- fetch
- CORS...so much CORS

This took a fair bit to do, lots of trial and error, but with some perseverance, and some help from what I consider a real developer, we got it all working.

# Twitch APIs and ComfyJs

---

---

This part was actually pretty simple, I had come accross a open source JavaScript library from Twitch developer [instafluff](https://www.instafluff.tv/) called [Comfyjs](https://github.com/instafluff/ComfyJS). This essentially reduced a ton of effort to set up the functionality to unlock cards. But, it did introduce a problem, I originally had this in the client side application. Without thinking too much about how authentication works on Twitch Extensions, so a big learning for me here is that Twitch has no (to my knowledge) way of setting up environment variables or secrets. These need to be stored on your EBS, and thus a refactor was needed to put it all server side on Heroku.

A benefit is, moving things sever side actually cleared up a bug where if viewers had the stream open in more than one browser tab they could unlock multiple cards for each screen they had open, yup, thats software dev, you never really know what will happen until users get a hold of it. We had run a few live tests with a few users during development, it was hugely helpful to see how different viewers interacted with the app.

# Release v1 - 3 Months after POC

---

---

---

![Release version one](/Walkthrough1.gif "Animated gif of first release currently live")

We did it team! We went live in October and the app is running and it still has some features and improvements to come. Though I will be taking a small break to write my second book, which I have been procrastinating from since starting this project, reduce work in progress!

You can come check out the app and collect some trading cards over at [https://www.twitch.tv/gettingdicey](https://www.twitch.tv/gettingdicey) Live on Mondays 7:30pm NZT
