---
sidebar_position: 2
---

# Syncing Game State

Underlying all multiplayer gaming is syncing game information. This page will use the simple example of Tic Tac Toe to explain how the game state is synced across players using Rune's custom predict-rollback netcode.

## Separation into Game Logic and Rendering {#separation-into-game-logic-and-rendering}

Multiplayer games are generally separated into game logic and rendering. This separation has many benefits, including being able to run dedicated servers that only have game logic. Rune multiplayer games are also separated into logic and rendering.

### Game Logic {#game-logic}

The logic is stored in a single file, `logic.js`, and initialized by running `Rune.initLogic()` with `minPlayers`, `maxPlayers`, `setup` and `actions`. The `minPlayers` and `maxPlayers` values ensure the game only have to consider a number of players between those two values. All other cases are Rune, incl. automatically making remaining people in the room spectators (more info in [Joining and Leaving](advanced/joining-leaving.md)).

The `setup` function returns the initial values for the `game` state, which is the game information that’s synced across players. In the case of Tic Tac Toe, the `game` state describes who’s turn it is and which of the 9 cells have been filled with an X or an O. The `setup` function gets the `players` argument with info about the players at the time of starting the game.

The player can perform one of the `actions` to modify the game state. An `action` is a function that take as input an object with arguments. The function is also provided the `game` state and `playerId` containing the ID of the player, who performed the action. In the case of Tic Tac Toe, the only needed `action` is to mark a cell with an X or O.

Only `logic.js` file can modify the `game` state. The `setup` and `actions` functions cannot make use of any data from outside of their function definition and can’t modify anything outside the function definition (i.e. they’re pure functions w/o side effects).

The remaining parts of the code are hopefully self-explanatory. Some code like the `isVictoryOrDraw` function is left out as it’s not important in this context.

```js
Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: () => {
    return {
      cells: Array(9).fill(null),
      // Allow either player to start
      lastPlayerTurn: undefined,
    }
  },
  actions: {
    markCell: ({ cellId }, { game, playerId }) => {
      // Check it's not the other player's turn and unmarked cell
      if (game.lastPlayerTurn !== playerId || game.cells[cellId]) {
        throw Rune.invalidAction()
      }

      // Update cell and switch turn
      game.cells[cellId] = playerId
      game.lastPlayerTurn = playerId

      // Determine if game has ended
      const winner = isVictoryOrDraw(game)
      if (winner !== undefined) {
        Rune.gameOver()
      }
    },
  },
})
```

### Rendering {#rendering}

The game state should be rendered for the player to interact with. That’s the responsibility of `client.js`, which calls `Rune.initClient` with a `onChange` callback function. Whenever an `action` is performed, the `onChange` function is called with read-only info for updating the game experience (animations, graphics, UI, sound effects). The `onChange` has all the info you might need to update your game, including the `action` / `event` that triggered it, the old and new game states, info about the `players`, etc. The `onChange` callback is reliable in that it's always called every time, even on laggy clients with bad internet connection. 

The `client.js` also binds the UI to call the `actions`. For instance, for Tic Tac Toe, tapping on a cell would trigger `Rune.actions.markCell({ cellId })`.

```js
const onChange = ({
  previousGame,
  game,
  action,
  event,
  players,
  yourPlayerId,
  rollbacks,
}) => {
  // TODO: Update animations, graphics, UI, sound effects
}

Rune.initClient({ onChange })
```

## High-Level Game Syncing Flow {#high-level-game-syncing-flow}

Rune does a lot of magic behind the scenes to sync the game state. Here’s a simplified overview of how it works:

1. A client performs an `action` by interacting with the game (e.g. clicking a cell in Tic Tac Toe). The client optimistically updates `game` state by calling the associated `action` function (i.e. `clickCell` in the case of Tic Tac Toe) and calls `onChange` to update the graphics etc.
2. The `action` is immediately sent to the server. The server runs the associated `actions` function provided by the game, thereby checking that the `action` is valid and whether the game ends.
3. If the `action` is valid, the server updates its groundtruth `game` state and sends the `action` out to all connected clients. If the `action` is not valid, it’s ignored.
4. Each client computes the new `game` state using the `action` payload and the associated function in `actions`. It’s much cheaper bandwidth-wise to send the `action` than the entire `game` state. The client who sent the `action` will also receive the same `action` payload from the server as an acknowledgement message.

## Restrictions {#restrictions}

- Game logic must be written in a subset of JavaScript, see [Server-Side Logic](how-it-works/server-side-logic.md). The client rendering the game can use anything.
- Max 10 actions per player per second.
- Actions must be synchronous, execute in <10 ms and consume <1 MB memory.
- The `onChange` function must be synchronous. It may trigger async functions if needed, but cannot `await` them.
- The `game` state must be <1 MB and any `action` payload below <25 KB to avoid unnecessary network bandwidth usage.
- The `game` state must be JSON-serializable (e.g. no classes / functions / self-references) so it can be sent over the network.
- The logic.js file must be <1 MB as it will be fetched by the server and run inside a VM.

These restrictions are necessary to make great multiplayer games using predict-rollback netcode. Here's more info about [why predict-rollback netcode is the future of multiplayer games](how-it-works/server-side-logic.md#why-this-approach-using-deterministic-code). It's possible to make all kinds of amazing games using this approach (see the [list of supported games](./supported-games.md) for inspiration).

## StateSync Event {#statesync-event}

Games running on Rune should support initializing the game at any possible moment as someone can join as a spectator/player at any time. This could happen e.g. at the start of the game, in the middle of a match, or after game over. This initialization is done using the `stateSync` event. Additionally, the `stateSync` event is also used when restarting the game, reconnecting after an unexpected disconnect, or if the game crashes.

Your game must support this `stateSync` event. If you built your game in a reactive way (i.e. it always rerenders according to `onChange`'s `game` argument), then you don't need to worry about `stateSync` event. If your game has side effects, then you might need to specifically handle this event.

You can test your game by adding players/spectators joining at various times during your game session. See [Simulating Multiplayer](/playtesting/simulating-multiplayer.md) for more info on how you can simulate a multiplayer experience when developing.


## Detecting game restart {#game-restart}

When a new game session is started (start of the game, restart, new player connecting to an ongoing game), the client `onChange` is called with `stateSync` event which contains `isNewGame` parameter set to true. This is useful when games need to initialize assets, UI or other state in the client for a new game.

