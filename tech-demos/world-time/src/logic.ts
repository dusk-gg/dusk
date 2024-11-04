import type {
  GameStateWithPersisted as RuneGameStateWithPersisted,
  PlayerId,
  RuneClient,
} from "rune-sdk"

export type GameState = {
  //This will store how long each player has been in the current game session. Game session ends by players leaving the game/restarting it.
  sessionPlayTime: Record<PlayerId, number>
}

type GameActions = {
  tap: () => void
}

//These keys are optional because we delete them after game over is triggered
type Persisted = {
  //This will be used to know how much time the user has not clicked the button. We'll know it by comparing with Rune.worldTime()
  gameStartedAt?: number
  //This value will be used to store number of seconds the game was opened. It will increase by 1 every time update runs. By default Rune runs 1 update function per second.
  inGameTimeInSeconds?: number
}

export type GameStateWithPersisted = RuneGameStateWithPersisted<
  GameState,
  Persisted
>

declare global {
  const Rune: RuneClient<GameState, GameActions, Persisted>
}

//If we see that player doesn't have any persisted data, initialize it.
function initPersistPlayer(
  game: Pick<GameStateWithPersisted, "persisted">,
  playerId: PlayerId
) {
  if (Object.keys(game.persisted[playerId]).length === 0) {
    game.persisted[playerId] = {
      gameStartedAt: Rune.worldTime(),
      inGameTimeInSeconds: 0,
    }
  }
}

Rune.initLogic({
  //Enable player persistence
  persistPlayerData: true,
  minPlayers: 1,
  maxPlayers: 6,
  setup: (allPlayerIds, { game }) => {
    //Initialize all players at the start of the room
    allPlayerIds.forEach((playerId) => {
      initPersistPlayer(game, playerId)
    })

    return {
      sessionPlayTime: allPlayerIds.reduce(
        (acc, cur) => {
          acc[cur] = 0

          return acc
        },
        {} as Record<PlayerId, number>
      ),
    }
  },
  actions: {
    tap: (_, { playerId, game, allPlayerIds }) => {
      game.persisted[playerId] = {} as any

      //Mark every user as won except the one that clicked the button
      Rune.gameOver({
        players: allPlayerIds.reduce(
          (acc, cur) => {
            acc[cur] = cur === playerId ? ("LOST" as const) : ("WON" as const)

            return acc
          },
          {} as Record<PlayerId, "WON" | "LOST">
        ),
      })
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      //Initialize any player that joins the game
      initPersistPlayer(game, playerId)
      game.sessionPlayTime[playerId] = 0
    },
    playerLeft: (playerId, { game }) => {
      delete game.sessionPlayTime[playerId]
    },
  },

  //Update runs 1 time per second. Here we update total in game time & current session time.
  update: ({ game, allPlayerIds }) => {
    allPlayerIds.forEach((playerId) => {
      game.persisted[playerId].inGameTimeInSeconds! += 1
      game.sessionPlayTime[playerId] += 1
    })
  },
})
