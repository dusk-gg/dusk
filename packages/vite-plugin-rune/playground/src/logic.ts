import type { RuneClient } from "rune-sdk/multiplayer"
import { helpers } from "./shared/helpers"
import data from "./data.json"
//@ts-ignore
import sum from "math-sum"

export interface GameState {
  count: number
}

type GameActions = {
  increment: (params: { amount: number }) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

export function getCount(game: GameState) {
  return game.count
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (): GameState => {
    return { count: sum([data.x, 2, 3]) }
  },
  actions: {
    increment: ({ amount }, { game }) => {
      console.log(helpers.deep)
      console.log(helpers.flat)
      game.count += amount
    },
  },
})
