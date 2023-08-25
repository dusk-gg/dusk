import { animals, emotions } from "./lib/types/GameState"
import { getRandomItem } from "./lib/getRandomItem"
import { setActor } from "./lib/setActor"
import { isLastActor } from "./lib/isLastActor"
import { newTurn } from "./lib/newTurn"
import { startGameCheck } from "./lib/startGameCheck"

export const numRounds = 3
export const turnCountdown = 3
export const turnDuration = 30
export const turnAlmostOverAt = 5
export const endOfTurnDuration = 3
export const displayCorrectGuessFor = 3

Rune.initLogic({
  minPlayers: 3,
  maxPlayers: 4,
  setup: (playerIds) => ({
    players: playerIds.map((id) => ({
      id,
      readyToStart: false,
      actor: false,
      score: 0,
      latestTurnScore: 0,
      latestRoundScore: 0,
    })),
    gameStarted: false,
    round: 0,
    currentTurn: null,
    guesses: [],
    gameOver: false,
  }),
  actions: {
    setReadyToStart: (_, { game, playerId }) => {
      if (game.gameStarted) throw Rune.invalidAction()

      const player = game.players.find((player) => player.id === playerId)

      if (!player) throw Rune.invalidAction()
      player.readyToStart = true

      startGameCheck(game)
    },
    makeGuess: ({ animal, emotion }, { game, playerId }) => {
      if (!game.currentTurn) throw Rune.invalidAction()

      const guess = {
        playerId,
        animal,
        emotion,
        correct:
          game.currentTurn.animal === animal &&
          game.currentTurn.emotion === emotion,
      }

      game.guesses.push(guess)

      if (guess.correct) {
        const player = game.players.find((player) => player.id === playerId)
        const actor = game.players.find((player) => player.actor)

        if (!player || !actor) throw Rune.invalidAction()

        player.score += 1
        player.latestTurnScore += 1
        player.latestRoundScore += 1
        actor.score += 1
        actor.latestTurnScore += 1
        actor.latestRoundScore += 1

        game.currentTurn.animal = getRandomItem(animals)
        game.currentTurn.emotion = getRandomItem(emotions)

        if (!game.currentTurn.timerStartedAt) throw Rune.invalidAction()
        game.currentTurn.timerStartedAt += displayCorrectGuessFor
      }
    },
    nextRound: (_, { game }) => {
      if (game.round + 1 === numRounds) throw Rune.invalidAction()
      if (game.currentTurn?.stage !== "result") throw Rune.invalidAction()

      for (const player of game.players) {
        player.latestRoundScore = 0
      }

      game.round += 1
      setActor(game, "first")
      newTurn(game)
    },
  },
  events: {
    playerLeft: (playerId, { game }) => {
      game.players = game.players.filter((player) => player.id !== playerId)

      startGameCheck(game)

      if (
        game.currentTurn &&
        (game.currentTurn.stage === "acting" ||
          game.currentTurn.stage === "countdown")
      ) {
        if (isLastActor(game)) {
          game.currentTurn.stage = "result"
        } else {
          setActor(game, "next")
          newTurn(game)
        }
      }
    },
  },
  update: ({ game }) => {
    if (!game.currentTurn || !game.currentTurn.timerStartedAt) return

    switch (game.currentTurn.stage) {
      case "countdown":
        if (
          Rune.gameTimeInSeconds() >=
          game.currentTurn.timerStartedAt + turnCountdown
        ) {
          game.currentTurn.stage = "acting"
          game.currentTurn.timerStartedAt = Rune.gameTimeInSeconds()
        }
        break
      case "acting":
        if (
          Rune.gameTimeInSeconds() >=
          game.currentTurn.timerStartedAt + turnDuration
        ) {
          game.currentTurn.stage = "endOfTurn"
          game.currentTurn.timerStartedAt = Rune.gameTimeInSeconds()
        }
        break
      case "endOfTurn":
        if (
          Rune.gameTimeInSeconds() >=
          game.currentTurn.timerStartedAt + endOfTurnDuration
        ) {
          for (const player of game.players) {
            player.latestTurnScore = 0
          }

          if (isLastActor(game)) {
            game.currentTurn.stage = "result"

            if (game.round + 1 === numRounds) {
              game.gameOver = true
              Rune.gameOver({
                players: game.players.reduce(
                  (acc, player) => ({
                    ...acc,
                    [player.id]: player.score,
                  }),
                  {}
                ),
                delayPopUp: true,
              })
            }
          } else {
            setActor(game, "next")
            newTurn(game)
          }
        }
        break
    }
  },
})
