import { GameState } from "./types/GameState"
import { getRandomItem } from "./getRandomItem"

export function newTurn(game: GameState) {
  game.currentTurn = {
    animal: getRandomItem(game.animals),
    emotion: getRandomItem(game.emotions),
    stage: "countdown",
    timerStartedAt: Dusk.gameTimeInSeconds(),
    latestActingStartedAt: Dusk.gameTimeInSeconds(),
    showSkipGuessButton: false,
  }
}
