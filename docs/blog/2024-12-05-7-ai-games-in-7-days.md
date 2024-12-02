---
title: 7 AI games in 7 Days
description: Building 7 AI games in 7 Days
slug: 7-ai-games-in-7-days
tags: [Game Development]
image: /img/blog/social-previews/7aigames.png
authors:
- name: Kevin Glass 
  title: Founding Engineer at Rune  
  url: https://x.com/cokeandcode
  image_url: /img/blog/people/kevin-glass.jpg
  hide_table_of_contents: true
---

<head>
  <title>7 AI games in 7 Days</title>
  <meta property="og:title" content="7 AI games in 7 Days"/>
</head>

We're just added AI to the Rune SDK so your games can now make use of generative AI responses. As part of getting this release of the SDK out we decided to build out some AI games. So the challenge was set, can we build 7 unique (carefully scoped) AI based in 7 days? Here's what happened and what we learnt during the process. 

## Preparation 

Trying to make on day a game means getting everything in place before hand. As I was always told, Prior Preparation Prevents Pretty Poor Performance. In this case we started without 25 ideas for AI games, whittled that down to 7 good ones and built wire frames to explore the design. Then our designer, the formidable Shane, took them and produced beautiful graphics in the associated themes. 

With the designs in hand we were ready for building 7 AI games in 7 Days.

## Rules

If you're going to have a challenge you might as well set out the rules at the start so here goes:

1. 7 Days is consecutive working days - weekends off!
2. A day is a normal 8 hour working stint. No pulling an all nighter and claiming the game was built.
3. Games start from the Rune standard TypeScript template. 
4. Code reuse between games via cut and paste of common code. No building a library and then building 7 games on it.
5. All games should run in the Dev UI and on the production app.
6. Of course all the games will be built on Rune!

## How does it work?

Let's take a quick look at how the Rune SDK exposes AI to developers. It's really incredibly simple to work with and thats what made it possible to churn out these games. You can check out the [full documentation](https://developers.rune.ai/docs/advanced/ai) for more details.

### Prompting the AI

To send a prompt to the AI we simply invoke `Rune.ai.promptRequest()` from anywhere in our logic code, passing a collection of messages for the AI to interpret. Since the AI API is stateless if we want it to understand a full conversation we need to pass it the past messages and the new ones in the request.

As you can see below, the prompt request can take both text and image prompts. In the Rune SDK we only support passing in `data://` URI's for images because we'd want to ensure the games are always available to the players, hence not allowing dependencies on external resources.

```javascript
Rune.ai.promptRequest({
  messages: [
    { role: "user", 
      content: { type: "text", text: "What is Rune.ai?" } },
    { role: "user", 
      content: { type: "image_data", image_url: dataUri } },
  ],
})
```

### Getting AI responses

The response to the prompt is received through a callback in the game logic as shown below. As you can see the `response` text is provided back to the logic which can then update game state. 

```javascript
Rune.initLogic({
  ...
  ai: {
    promptResponse: ({ response }) => {
      console.log(response)
    },
  },
})
```

And thats it! It's really a very simple API to use with the Rune platform managing the requests/responses and retrying the AI in the case of failures and timeouts.

## Games

Each day/game is described below including notes on the interesting parts of the AI interactions.

### Day 1 - Storyteller AI
<img align="right" width="150" src="/img/blog/callouts/storyteller-ai.png"></img>

[Play!](https://join.rune.ai/game/Gy09RBNl-gwE) | [Kick Off](https://www.youtube.com/watch?v=8lKNgpjHBKU) | [Time Lapse](https://www.youtube.com/watch?v=0_4ULXo4dsU) | [Post-Mortem](https://www.youtube.com/watch?v=Gn8graz6wV4)

Our first game, Storyteller AI, has the players collaboratively write an epic story together by suggesting simple terms that the AI then weaves into the story. There's no winner, or rather everyone is a winner with a brand new story. The fun comes when people start suggesting strange and wacky terms which are attributed to them in the story. 

#### What did we learn?

* The first game was always going to find the edges of the implementation and of course the development ran into a few bugs which were fixed along with writing the game on the first day. 
* Prompting an AI to write a story needs guidelines otherwise it just goes no where. It's important to set out clearly that there will need to be a conclusion.
* Players struggle to think of suitable terms, having the AI suggest some seems like an AI talking to an AI, but play tested appreciated having the suggestions.
* The Open AI API can take 10+ seconds to respond now and again, you have to account for that possibility in design.

### Day 2 - Dating AI Game
<img align="right" width="150" src="/img/blog/callouts/dating-ai-game.png"></img>

[Play!](https://join.rune.ai/game/gCPAZuWc-hgE) | [Kick Off](https://www.youtube.com/watch?v=KFYHmLUhbr0) | [Time Lapse](https://www.youtube.com/watch?v=BqEhuZTlkyU) | [Post-Mortem](https://www.youtube.com/watch?v=2fhItmAAik0)

Definitely my favorite idea from the original list, the *Dating AI Game* is based on those old blind dating shows from the 70s and 80s. Players take the part of contestants attempting to win a date by answering their potential date's questions in the most fun way. The AI plays the part of the question asker and the overall narrator. Players really do seem to enjoy this one, particularly entering the most rude answer they can think of.

#### What did we learn?

* Players will always try to be rude / outlandish - make the choice how you want the AI to respond don't leave it to chance!
* Asking the AI to do 'three rounds of questions and then a conclusion' doesn't always result in 3 rounds - sometimes 2, sometimes 8. You need to be very strict and clear when the game should finish. Even if all your examples are 3 rounds the AI may not pick up on this.
* Coming up with varied questions is difficult for the AI, especially in a constrained contextual scenario like a old school dating show when driven by examples. It often repeats the same questions in different sessions. You can get better results by explaining the reason for the example, e.g. `The example below is for structure not for content. Please come up with as varied questions and responses as possible.`

### Day 3 - Find the AI
<img align="right" width="150" src="/img/blog/callouts/find-the-ai.png"></img>

[Play!](https://join.rune.ai/game/ujHChE5Q-iAE) | [Kick Off](https://www.youtube.com/watch?v=FFajH5qzOFY) | [Time Lapse](https://www.youtube.com/watch?v=jODPLOrx1Ig) | [Post-Mortem](https://www.youtube.com/watch?v=-LbzUwZXS7U)

With Find the AI we're adapting the good old Werewolf game into a simple Rune game. The AI generates a simple question, players answer it and so does the AI. The AI has been instructed to sound as human as possible including adding typos and slang. The players are then presented all the answers and have to guess which one is the AI. Having the AI act human is fun, but watching players trying to sound like an AI is really great. 

#### What did we learn?

* Making an AI sound human isn't easy. 
* AI responses tend to be elaborate and use great grammar and spelling. Humans, especially those using mobile keyboards, don't do that. They generally use short terse answers and they make mistakes (auto correct is everyone's friend right?). 
* Asking the AI to sound more human with `Use slang or abbreviations to sound more human` results in an obvious AI that is intentionally making a mistake every time and throwing in slang for no reason. 
* Giving the AI a "dial" gives the best results, `use slang 50% of the time`, `make an auto-correct mistake 10% of the time` seemed to give better more human responses but didn't make it into the final game.

### Day 4 - The AI Times
<img align="right" width="150" src="/img/blog/callouts/the-ai-times.png"></img>

[Play!](https://join.rune.ai/game/K6CmPyI5-igE) | [Kick Off](https://www.youtube.com/watch?v=txwfVyAgvuo) | [Time Lapse](https://www.youtube.com/watch?v=9e-1mgHVeqg) | [Post-Mortem](https://www.youtube.com/watch?v=SP97rXevq6Q)

A novel idea that was thought up by the team, in the AI Times players are presented with a random image and asked to provide a short caption. The generative AI is then prompted to create a tabloid style front page including headline and tag line. The players then vote on their favorite story to choose a winner. The mix of abstract odd image and the imagination of the players results in some really wonderfully silly front pages. 

#### What did we learn?

* Telling the AI what to value as input is really important. In this case we are feeding the AI with the player's caption and a description of the image that was provided to the player (generated offline). Initially the AI was producing essentially the same story for all players because they all had the same image.
* Being explicit about the weight to apply to the inputs helped a lot, e.g. `The player's input should be considered 10x more important than the content of the image when writing the articles`

### Day 5 - GIF vs AI
<img align="right" width="150" src="/img/blog/callouts/gif-vs-ai.png"></img>

[Play!](https://join.rune.ai/game/HfUtYbv3-hwE) | [Kick Off](https://www.youtube.com/watch?v=GGIl9zjuZ-w) | [Time Lapse](https://www.youtube.com/watch?v=eZtJVbPrGr4) | [Post-Mortem](https://www.youtube.com/watch?v=H9ourtJtU4UQ)

Probably the player favorite so far is GIF vs AI - a twist on the popular Death by AI game. The AI generates a life threatening scenario and a GIF is chosen to represent it. Players then have to respond with how they'll attempt to survive by selecting a GIF. Finally the AI evaluates the scenario and the provided survival GIF to determine if the player survives and selects a GIF to represent the outcome. Adding in the GIFs makes the game quicker to play and the AI interpretation of the GIF can lead to un-intended and funny outcomes. 

#### What did we learn?

* The Tenor generated GIF descriptions that are provided as meta-data are often of just the first frame and don't include details of what happens in the animation. Though not accurate, in our case this leads to fun mistakes!
* The AI seems capable of providing "good" search terms based on longer textual descriptions. While AI summarization is expected to be good I hadn't expected it to be able to extract the relevant terms from the text to get a reasonably accurate GIF result from a search. 

### Day 6 - AI Art Judge
<img align="right" width="150" src="/img/blog/callouts/ai-art-judge.png"></img>

[Play!](https://join.rune.ai/game/ndNWZDVQ-iQE) | [Kick Off](https://www.youtube.com/watch?v=8CA15ifaukw) | [Time Lapse](https://www.youtube.com/watch?v=-bo8DCdm0QA) | [Post-Mortem](https://www.youtube.com/watch?v=7u4s8Ud87eQ)

One of the great things about the AI in the Rune SDK is that it exposes image analysis as part of the same single API. AI Art Judge uses this to become an art critic. Players suggest a 'thing' to be drawn. They're then given a fixed time to draw a picture of the randomly picked item. Once everyone is done, the AI evaluates the drawings based on the original input and provides a very artsy and funny critique. It turns out AI is an expert in being pompous. 

#### What did we learn?

* Asking the AI which is the best "...." doesn't result in an understandable result for players. The AI often doesn't pick the objectively better representation of the item. 
* Ran out of time, but it may have been better to ask `what is in this image` and then get a match weight comparing that output with the original item description.
* Image analysis isn't expensive as long as your images are smaller than 512x512 (generally plenty for this sort of game). Any bigger and costs go up quickly.

### Day 7 - AI Emoji Interview
<img align="right" width="150" src="/img/blog/callouts/ai-emoji-interview.png"></img>

[Play!](https://join.rune.ai/game/o591Hl2V-iwE) | [Kick Off](https://www.youtube.com/watch?v=cxq3vC-hGso) | [Time Lapse](https://www.youtube.com/watch?v=K2XMQ_vbLa0) | [Post-Mortem](https://www.youtube.com/watch?v=z7ogah2k4y0)

In the final game of the 7 days we wanted to try out how AI interprets emojis. The AI Emoji Interview game has the AI acting an interviewer for a made up and crazy job opportunity. Players must take part in the interview but can only provide emojis as answers. The AI interprets the emojis as answers and eventually selects a player to get the job. Switching from text to emoji speeds the game up and players still seem to be able to get their point across easily. 

#### What did we learn?

* AI can understand emoji as easily as normal text. It can even interpret the meaning of combined emoji's in most common cases.
* Similar to generating questions above, generating "crazy" jobs is difficult for AI. It tends to generate similar jobs even when prompted to have a wide search space. In hind sight it may have been better to generate 100 crazy jobs offline and used these as input rather than relying on a dynamically generated job title.

## General Observations

It's been an interest week of making games with lots of experimentation using AI through the Rune SDK. All the games were playable and fun to a level but could have been taken further and refined more. Here's some general impressions of using AI in games:

* Examples are king! Providing examples to the AI as part of the initial prompt keeps the structure of the interaction manageable.  
* Structured output, e.g. asking the AI to produce JSON, seems to greatly decrease the appropriateness of the responses and limits the pseudo-creativity of the output. 
* The common advice is to repeat important parts of prompts towards the end of the initial prompt. This didn't seem to have much effect this week. Adding explicit rules at the end of the prompt that re-enforced some of the initial prompt had a larger impact.
* Calling out early in the prompt that `we're playing a game` seems to result in the AI having a decent grasp immediately that there is likely to be a series of interactions. It also seems to set a tone for responses.
* Using the `system` vs `user` role does have an impact. `system` should be used to set the rules of the game and the general structure. `user` should be used to provide player input. Prompting a set of runes using `user` role doesn't work as well as using `system`. Prompting player input in `system` role works find as long as you're prefixing the input with `the user entered...` but this becomes awkward quickly. Using `system` for player input also leaves more room open for players providing input to try and change the rules.

## Conclusion

It's been a fun, if tiring, week writing a game a day. The games themselves have come out pretty fun and I'm looking forward to how they do when they hit the 100,000's of players available on the Rune platform. Pretty much all the guidance on writing prompts generally applied to using it for games - though it is quite difficult to keep the AI from expanding outside of the rules you want to enforce for the game. With the addition of this easy AI API into the SDK I can't wait to see what developers build!

Want to learn more? Join us on [Discord](https://discord.gg/rune-devs) for a chat!


