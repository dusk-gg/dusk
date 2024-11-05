---
sidebar_position: 100
---

# Porting Existing Game

Amazing that you're considering adapting your game for multiplayer on Rune! 🥳

We recommend you follow **approach 1** below, which will take care of any boilerplate and provide a nice development experience with Rune-specific ESLint & Vite plugins. You can quickly get a minimal multiplayer version of your game working, then add more game logic step-by-step. Alternatively, you can add the SDK manually.

### Approach 1: Rune Template

Create a new Rune game project by running:

```sh
npx rune@latest create
```

You now have a simple example game with game logic and client rendering files. You can then copy your game logic and rendering code into the `logic.ts` and `client.ts` files respectively. Take a look at [Quick Start](../quick-start.md) for an introduction to these files or [Syncing Game State](./syncing-game-state.md) for a more in-depth explanation.

We recommend that you enable ESLint in your editor to detect issues while developing your game. The template code already has the necessary configuration for ESLint.

### Approach 2: Manual Setup

This approach requires you to be careful, especially if you're using TypeScript or a bundler as you will need to update your setup to export a `logic.js` file. If you still like to do the setup manually, here's how you do it:

1. Create a file called `logic.js` that has all [game logic](../quick-start.md#game-logic) and calls `Rune.initLogic()`
2. Create a file called `client.js` that's responsible for [rendering](../quick-start.md#rendering) and calls `Rune.initClient()`
3. Load the SDK before any other script in your `index.html` along with the two files:
```html
<script src="https://cdn.jsdelivr.net/npm/rune-sdk@4/multiplayer-dev.js"></script>
<script src="./logic.js"></script>
<script src="./client.js"></script>
```
4. Setup [Rune's ESLint plugin](server-side-logic.md#editor-integration) to detect issues in your game logic
5. Move all your game logic into `logic.js` and make `client.js` import all your rendering code

You can also look at the [Tic Tac Toe](https://github.com/rune/rune/tree/staging/examples/tic-tac-toe) example game to understand how to set up a game manually.

### Questions?

We're happy to help! Just write us on the [Rune Discord](https://discord.gg/rune-devs) server.
