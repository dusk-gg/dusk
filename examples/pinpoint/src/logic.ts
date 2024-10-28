import { calculateDistanceKm } from "./lib/calculateDistanceKm"
import { calculateScore } from "./lib/calculateScore"
import { panoramas } from "./lib/data/panoramasLogic"
import { GameState } from "./lib/types/GameState"
import { shouldTriggerGameOver } from "./lib/shouldTriggerGameOver"
import { triggerGameOver } from "./lib/triggerGameOver"
import { pickRandom } from "./lib/pickRandom"
import { generateWeightedPanoramas } from "./lib/generateWeightedPanoramas"
import { hasEveryoneGuessed } from "./lib/hasEveryoneGuessed"
import { missedGuess } from "./lib/missedGuess"

export const numRounds = 5
export const roundDuration = 25

// weightedPanoramas is generated for pickRandom
// The chance of picking panorama with higher weight increases because it appears more times in weightedPanoramas array
const weightedPanoramas = generateWeightedPanoramas(panoramas)

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 6,
  persistPlayerData: true,
  setup: (playerIds) => {
    const rounds: GameState["rounds"] = []
    const usedPanoramas = new Set<number>()

    for (let i = 0; i < numRounds; i++) {
      // Pick random weighted panorama that has not been used yet
      let newPanoramaIdx

      while (!newPanoramaIdx || usedPanoramas.has(newPanoramaIdx)) {
        newPanoramaIdx = pickRandom(weightedPanoramas)
      }

      const [longitude, latitude] = panoramas[newPanoramaIdx]

      rounds.push({
        index: newPanoramaIdx,
        coords: [longitude, latitude],
      })
      usedPanoramas.add(newPanoramaIdx)
    }

    return {
      sessionId: Math.round(Math.random() * 1e9),
      playerIds,
      rounds,
      currentRound: 0,
      roundTimerStartedAt: null,
      guesses: [],
    }
  },
  actions: {
    makeGuess: (location, { game, playerId }) => {
      const currentRound = game.currentRound
      const existingGuess = game.guesses.find(
        (guess) => guess.playerId === playerId && guess.round === currentRound
      )

      if (existingGuess) throw Rune.invalidAction()

      const distance =
        Math.round(
          calculateDistanceKm(location, game.rounds[game.currentRound].coords) *
            1e4
        ) / 1e4

      game.guesses.push({
        playerId,
        round: game.currentRound,
        location,
        distance,
        score: calculateScore(distance),
      })

      if (game.playerIds.length > 1 && !game.roundTimerStartedAt) {
        game.roundTimerStartedAt = Rune.gameTime() / 1000
      }

      if (
        game.guesses.filter((guess) => guess.round === game.currentRound)
          .length === game.playerIds.length
      ) {
        game.roundTimerStartedAt = null
      }

      if (shouldTriggerGameOver(game)) triggerGameOver(game)
    },
    nextRound: (_, { game }) => {
      if (game.currentRound === numRounds - 1) throw Rune.invalidAction()

      const currentRound = game.currentRound
      const guesses = game.guesses.filter(
        (guess) => guess.round === currentRound
      )

      if (guesses.length !== game.playerIds.length) throw Rune.invalidAction()

      game.currentRound++
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      game.playerIds = game.playerIds.filter((id) => id !== playerId)
      game.guesses = game.guesses.filter((guess) => guess.playerId !== playerId)

      if (hasEveryoneGuessed(game)) game.roundTimerStartedAt = null
    },
    playerJoined: (playerId, { game }) => {
      const everyoneGuessedBeforeNewPlayerJoined = hasEveryoneGuessed(game)

      game.playerIds.push(playerId)

      if (everyoneGuessedBeforeNewPlayerJoined) {
        game.guesses.push(missedGuess(playerId, game))
      }
    },
  },
  update: ({ game }) => {
    if (
      game.roundTimerStartedAt &&
      Rune.gameTime() / 1000 >= game.roundTimerStartedAt + roundDuration
    ) {
      const playersWhoGuessed = game.guesses
        .filter((guess) => guess.round === game.currentRound)
        .map((guess) => guess.playerId)
      const playersWhoDidNotGuess = game.playerIds.filter(
        (playerId) => !playersWhoGuessed.includes(playerId)
      )

      for (const playerId of playersWhoDidNotGuess) {
        game.guesses.push(missedGuess(playerId, game))
      }

      game.roundTimerStartedAt = null

      if (shouldTriggerGameOver(game)) triggerGameOver(game)
    }
  },
})
