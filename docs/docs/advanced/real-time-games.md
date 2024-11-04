---
sidebar_position: 61
---

# Real-Time Games

Rune synchronizes clocks across clients + server to easily add time-based game logic. You can get the synchronized time using `Rune.gameTime()` or `Rune.worldTime()` and make fast-paced games with an `update()` loop running many times pr. second.

## Game Time {#game-time}

You can use `Rune.gameTime()` inside your game, which returns the milliseconds that have passed since the start of the game. By default, Rune provides time precision of a second, which should work well for most casual game purposes.

For instance, this could be used to track how long it took for user to make a guess:

```javascript
// logic.js

function allPlayersDone(game) {
  // ...
}

function setNewQuestionAndAnswer(game) {
  // ...
}

Rune.initLogic({
  setup: (allPlayerIds) => {
    return {
      scores: Object.fromEntries(allPlayerIds.map((id) => [id, 0])),
      roundStartAt: 0,
      question: "A group of otters is called what?",
      correctAnswer: "A raft"   
    }
  },
  actions: {
    guess: ({ answer }, { game, playerId }) => {
      if (answer === game.correctAnswer) {
        // Increment score based on time
        const timeTaken = Rune.gameTime() - roundStartAt

        scores[playerId] += max(30 - timeTaken, 0)
      }

      // Start a new round once everyone has answered
      if (allPlayersDone(game)) {
        roundStartAt = Rune.gameTime()
        setNewQuestionAndAnswer(game)
      }
    },
  },
})

```

## World time {#world-time}

To track time outside the game, Rune exposes `Rune.worldTime()`. This function returns a timestamp in milliseconds since the epoch. Using this value allows to build daily challenges, time-based events. `Rune.worldTime()` has 1 second precision.

```javascript
// logic.js

Rune.initLogic({
    setup: () => {
        return {
          holidaysEvent:
            Rune.worldTime() > new Date(2024, 12, 20).getTime() &&
            Rune.worldTime() < new Date(2025, 1, 7).getTime(),
        }
    },
})

```

## Update Function {#update-function}

You can provide an `update` function inside your `logic.js` file to run game logic on an interval. When game state is changed inside your `update` function, the `onChange` inside `client.js` is called with `update` event. Here’s a game, where players have to make a move within 30 seconds or else their turn will pass:

```javascript
// logic.js

Rune.initLogic({
  // ... (code from previous example)
  update: ({ game }) => {
    // Check if 30 seconds has passed, then switch to another question
    if (Rune.gameTime() - game.roundStartAt > 30) {
      roundStartAt = Rune.gameTime()
      setNewQuestionAndAnswer(game)
    }
  }
})

```

By default, the `update` function runs every second. This works well for most party games and makes your game run smoothly and efficiently on almost any device. However, some game will need to run the update function much more frequently than once pr. second. A game like Paddle needs to update the position of the ball and the players' paddles many times per second. The game can specify this by providing `updatesPerSecond` to `Rune.initLogic()`. In the following example, the `update` function will be called 30 times per second on all clients:

```javascript
Rune.initLogic({
  update: ({ game }) => {
    game.ballPosition += game.ballSpeed
    // ... (remaining game logic)
  },
  updatesPerSecond: 30
})
```

The `update` function is run in a synchronized way across all clients and the server. Only actions are sent to the server, which makes Rune real-time games very bandwidth efficient so that they can work even on mobile devices with limited bandwidth. Even with our optimizations, your game might still experience stuttering due to latency between players or varying frame rates across devices. Rune helps you [reduce this stuttering through interpolators](reducing-stutter.md).

## The `timeSync` Event {#the-timesync-event}

Network packets between the client and server are sometimes delayed due to bad internet connection. If that happens, the server might execute the action at different game time compared to the optimistic client action. If this has impact on game state, the client that made the optimistic action will receive a `onChange` call with `timeSync` event.

Let's consider a game with the following game logic:

```javascript
// logic.js

Rune.initLogic({
  setup() {
    return {
      clickedAt: 0,
    };
  },
  actions: {
    click(_, { game }) {
      game.clickedAt = Rune.gameTime();
    },
  },
})
```

The game is played by two players (Player A and Player B), who do the following:

* PlayerA calls the action `click` when game time is at second 4. Player A receives `onChange` call with `click` action as an argument, making Player A see `game.clickedAt = 4`.
* Server receives and processes the action at game time second 5.
* Every client receives that the action was executed at 5th second.

Player A's `onChange` function will now be called with `timeSync` event to reconcile that the server processed the action at second 5 (and the server holds the truth). In this way, both players end up with `game.clickedAt = 5`.

## Further Reading {#further-reading}

- [See how the Pinpoint example game uses time](https://github.com/rune/rune/blob/staging/examples/pinpoint/src/logic.ts)
- [See how to reduce stutters in fast-paced games](reducing-stutter.md)
