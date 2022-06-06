import { createMachine, interpret, assign } from "xstate"
import { randomNumberGenerator } from "./rng"
import { validateScore } from "./validations"
import { postRuneEvent } from "./messageBridge"
import { InitInput } from "../types"

export type Events =
  | ({ type: "onGameInit" } & InitInput & {
        version: string
      })
  | { type: "onGameOver" }
  | { type: "onAppPause" }
  | { type: "onAppRestart"; gamePlayUuid: string }
  | { type: "onAppRequestScore" }
  | { type: "onAppPlay"; gamePlayUuid: string }
  | { type: "onAppStart (legacy)" }

type Context = {
  gamePlayUuid: string
  rng: () => number
  legacyGameStarted: boolean
} & InitInput

export type StateMachineService = ReturnType<typeof createStateMachine>

// Link to state machine - https://stately.ai/registry/systems/8c37004d-1cc7-4c13-b5a0-9be06d1a2abc
export function createStateMachine(challengeNumber: number) {
  const machine = createMachine(
    {
      tsTypes: {} as import("./stateMachine.typegen").Typegen0,
      preserveActionOrder: true, // Ensures that assign actions are called in order (see https://xstate.js.org/docs/guides/context.html#action-order and https://github.com/statelyai/xstate/issues/3383)
      schema: {
        context: {} as Context,
        events: {} as Events,
      },

      context: {
        gamePlayUuid: "UNSET", // Game play uuid only makes sense while playing
        rng: randomNumberGenerator(challengeNumber),
        restartGame: () => {
          throw new Error("restartGame is not initialized!")
        },
        resumeGame: () => {
          throw new Error("resumeGame is not initialized!")
        },
        getScore: () => {
          throw new Error("getScore is not initialized!")
        },
        pauseGame: () => {
          throw new Error("pauseGame is not initialized!")
        },
        legacyGameStarted: false,
      },

      // START - Exported JSON from state machine (don't remove newline below)

      id: "SDK",
      initial: "LOADING",
      states: {
        LOADING: {
          on: {
            onGameInit: {
              actions: ["ASSIGN_CALLBACKS", "SEND_INIT"],
              target: "INIT",
            },
            onGameOver: {
              target: "ERROR",
            },
          },
        },
        ERROR: {
          type: "final",
          entry: "SEND_ERROR",
        },
        INIT: {
          initial: "PAUSED",
          states: {
            PLAYING: {
              entry: "ASSIGN_LEGACY_GAME_STARTED",
              on: {
                onAppPause: {
                  actions: "CALL_PAUSE_GAME",
                  target: "PAUSED",
                },
                onGameOver: {
                  actions: [
                    "SEND_GAME_OVER",
                    "RESET_DETERMINISTIC_RANDOMNESS",
                    "ASSIGN_LEGACY_GAME_ENDED",
                  ],
                  target: "GAME_OVER",
                },
                onAppRestart: {
                  actions: [
                    "SEND_SCORE",
                    "ASSIGN_GAME_PLAY_UUID",
                    "RESET_DETERMINISTIC_RANDOMNESS",
                    "CALL_RESTART_GAME",
                  ],
                },
                "onAppStart (legacy)": {
                  actions: [
                    "SEND_SCORE",
                    "RESET_DETERMINISTIC_RANDOMNESS",
                    "CALL_RESTART_GAME",
                  ],
                },
              },
            },
            PAUSED: {
              on: {
                onAppPlay: {
                  actions: ["ASSIGN_GAME_PLAY_UUID", "CALL_RESUME_GAME"],
                  target: "PLAYING",
                },
                onGameOver: {
                  target: "#SDK.ERROR",
                },
                "onAppStart (legacy)": {
                  actions: "CALL_RESUME_GAME",
                  target: "PLAYING",
                },
              },
            },
            GAME_OVER: {
              on: {
                onAppPlay: {
                  actions: ["ASSIGN_GAME_PLAY_UUID", "CALL_RESTART_GAME"],
                  target: "PLAYING",
                },
                onGameOver: {
                  target: "#SDK.ERROR",
                },
                "onAppStart (legacy)": {
                  actions: "CALL_RESTART_GAME",
                  target: "PLAYING",
                },
              },
            },
          },
          on: {
            onAppRequestScore: {
              actions: "SEND_SCORE",
            },
            onGameInit: {
              target: "ERROR",
            },
          },
        },
      },

      // END - Exported JSON from state machine (don't remove newline above)
    },
    {
      actions: {
        ASSIGN_CALLBACKS: assign((context, initParams) => {
          return {
            ...context,
            ...initParams,
          }
        }),
        RESET_DETERMINISTIC_RANDOMNESS: assign((context) => ({
          ...context,
          rng: randomNumberGenerator(challengeNumber),
        })),
        ASSIGN_LEGACY_GAME_STARTED: assign((context) => ({
          ...context,
          legacyGameStarted: true,
        })),
        ASSIGN_LEGACY_GAME_ENDED: assign((context) => ({
          ...context,
          legacyGameStarted: false,
        })),
        ASSIGN_GAME_PLAY_UUID: assign((context, event) => ({
          ...context,
          gamePlayUuid: event.gamePlayUuid,
        })),
        CALL_RESUME_GAME: ({ resumeGame, startGame, legacyGameStarted }) => {
          startGame && !legacyGameStarted ? startGame() : resumeGame()
        },
        CALL_PAUSE_GAME: ({ pauseGame }) => {
          pauseGame()
        },
        CALL_RESTART_GAME: ({ restartGame, startGame }) => {
          // TODO: remove startGame once all games are migrated to v2
          startGame ? startGame() : restartGame()
        },
        SEND_SCORE: ({ gamePlayUuid, getScore }) => {
          const score = getScore()

          validateScore(score)

          postRuneEvent({
            type: "SCORE",
            gamePlayUuid,
            score,
            challengeNumber,
          })
        },
        SEND_INIT: (_, { version }) => {
          postRuneEvent({ type: "INIT", version })
        },
        SEND_ERROR: ({ gamePlayUuid }, event, meta) => {
          const statePath = (meta.state.history?.toStrings() || []).slice(-1)[0]

          const errorMessage = `Fatal issue: Received ${event.type} while in ${statePath}`

          postRuneEvent({
            type: "ERR",
            gamePlayUuid,
            errMsg: errorMessage,
          })
        },
        SEND_GAME_OVER: ({ gamePlayUuid, getScore }) => {
          const score = getScore()

          validateScore(score)

          postRuneEvent({
            type: "GAME_OVER",
            gamePlayUuid,
            score,
            challengeNumber,
          })
        },
      },
    }
  )

  const service = interpret(machine)

  service.onTransition((state, event) => {
    // As soon as state machine is initialized, it calls onTransition, but the state.changed is undefined (see https://xstate.js.org/docs/guides/states.html#state-changed)
    if (state.changed === undefined) {
      return
    }

    // If nothing has changed inside the state machine (state/context) that means that the event was not handled.
    if (!state.changed) {
      const statePath = (state.toStrings() || []).slice(-1)[0]

      const { gamePlayUuid } = state.context
      const msg = `Received ${event.type} while in ${statePath}`
      postRuneEvent({
        type: "WARNING",
        gamePlayUuid,
        msg,
      })
    }
  })

  service.start()

  return service
}
