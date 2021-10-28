# Rune Games SDK

Tiny SDK for making your HTML5 game run inside [Rune](https://play.google.com/store/apps/details?id=ai.rune.tincan).

## Install

```sh
$ npm install --save rune-games-sdk
```

Or include the following line in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/rune-games-sdk@1.3/dist/browser.min.js"></script>
```

## Usage

Initialize the Rune SDK once your game is fully ready.

```js
Rune.init({
  startGame: myStartGameFunction,
  pauseGame: myPauseGameFunction,
  resumeGame: myResumeGameFunction,
  getScore: myGetScoreFunction,
})
```

At this point, the game can show animations to entice the player, but should not start the actual gameplay as the game may be preloaded. When the player wants to start your game, Rune will call the provided `startGame` function to let your game know to start the gameplay.

Once the player loses the game, your game should call `Rune.gameOver()`. This tells Rune to show the "game over" screen. Your game should not show any "game over" screen and your game does not need to keep track of the user's highscore.

When the player is ready to play again, Rune will call the `startGame` function. Your game should then reset all gameplay back to the experience as a completely new player, including resetting the score.

The player may pause the game through the Rune interface. When this happens, the `pauseGame` function is called to let your game know to freeze all gameplay. Similarly, the `resumeGame` function should unfreeze all gameplay, leaving the player in the same state as before they paused the game.

The Rune SDK may request your game's score at anytime by calling the `getScore` function. This function should return your game's score as a number.

Take a look at our [example game](https://github.com/rune/rune-games-sdk/blob/staging/examples/bunny-twirl/index.js) for inspiration or dive into the [source code](https://github.com/rune/rune-games-sdk/blob/staging/src/index.ts).

## Debugging Locally

To make it easy for you to debug your game locally, this SDK will:

- Call the `startGame` function 3 seconds after your game called `Rune.init()`
- Call the `startGame` function 3 seconds after your game called `Rune.gameOver()`

This simulates what the SDK will do based on player actions when your game is running inside [Rune](https://play.google.com/store/apps/details?id=ai.rune.tincan).

## Score

For the Rune leaderboard logic to work correctly, your game's score should:

- be an integer
- be between 0 and 1 billion (i.e. no negative or extremely high values)
- treat higher scores as better

This is the case by default for most games.

## Audio

Your game can have soundtracks and sound effects. However, your game should not play any audio before the `startGame` function is called.

## Help

If you're having trouble, please feel free to file an issue in our [GitHub issue tracker](https://github.com/rune/rune-games-sdk/issues).
