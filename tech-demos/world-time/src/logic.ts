import type {
  GameStateWithPersisted as RuneGameStateWithPersisted,
  PlayerId,
  RuneClient,
} from "rune-sdk"

export type GameState = {
  sessionPlayTime: Record<PlayerId, number>
}

type GameActions = {
  tap: () => void
}

type Persisted = {
  gameStartedAt?: number
  inGameTimeInSeconds?: number
}

export type GameStateWithPersisted = RuneGameStateWithPersisted<
  GameState,
  Persisted
>

declare global {
  const Rune: RuneClient<GameState, GameActions, Persisted>
}

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
  persistPlayerData: true,
  minPlayers: 1,
  maxPlayers: 6,
  setup: (allPlayerIds, { game }) => {
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
      initPersistPlayer(game, playerId)
      game.sessionPlayTime[playerId] = 0
    },
    playerLeft: (playerId, { game }) => {
      delete game.sessionPlayTime[playerId]
    },
  },

  update: ({ game, allPlayerIds }) => {
    allPlayerIds.forEach((playerId) => {
      game.persisted[playerId].inGameTimeInSeconds! += 1
      game.sessionPlayTime[playerId] += 1
    })
  },
})
