import { pickRandom } from "./lib/pickRandom"
import { calculateDistanceKm } from "./lib/calculateDistanceKm"
import { calculateScore } from "./lib/calculateScore"
import { panoramas } from "./lib/data/panoramasLogic"
import { GameState } from "./lib/types/GameState"
import { shouldTriggerGameOver } from "./lib/shouldTriggerGameOver"
import { triggerGameOver } from "./lib/triggerGameOver"

export const numRounds = 5
export const roundDuration = 25

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (playerIds) => {
    const rounds: GameState["rounds"] = []
    const remainingPanoramas = [...panoramas]

    for (let i = 0; i < numRounds; i++) {
      const randomPanorama = pickRandom(remainingPanoramas)
      remainingPanoramas.splice(remainingPanoramas.indexOf(randomPanorama), 1)
      rounds.push({
        index: panoramas.indexOf(randomPanorama),
        coords: randomPanorama,
      })
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
        game.roundTimerStartedAt = Rune.gameTimeInSeconds()
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
    },
  },
  update: ({ game }) => {
    if (
      game.roundTimerStartedAt &&
      Rune.gameTimeInSeconds() >= game.roundTimerStartedAt + roundDuration
    ) {
      const playersWhoGuessed = game.guesses
        .filter((guess) => guess.round === game.currentRound)
        .map((guess) => guess.playerId)
      const playersWhoDidNotGuess = game.playerIds.filter(
        (playerId) => !playersWhoGuessed.includes(playerId)
      )

      for (const playerId of playersWhoDidNotGuess) {
        game.guesses.push({
          playerId,
          round: game.currentRound,
          location: [0, 0],
          distance: Infinity,
          missed: true,
          score: 0,
        })
      }

      game.roundTimerStartedAt = null

      if (shouldTriggerGameOver(game)) triggerGameOver(game)
    }
  },
})
