import type { PlayerId, RuneClient } from "rune-games-sdk/multiplayer"
import {
  COUNTDOWN_MS,
  CUBE_DEPTH,
  CUBE_WIDTH,
  HALF_SHIP_WIDTH,
  LEFT_WALL_POSITION,
  RIGHT_WALL_POSITION,
  SHIP_DEPTH,
  SHIP_START_POSITIONS,
  TRACK_DISTANCE,
  UPDATES_PER_SECOND,
  NUMBER_OF_CUBES,
  CUBE_COLORS,
} from "./config"

type Cube = { x: number; z: number; colorIdx: number }
type ShipDirection = "left" | "right" | null

type Ship = {
  position: {
    x: number
    z: number
  }
  rotation: {
    z: number
  }
  direction: ShipDirection
  xSpeed: number
  zSpeed: number
  topZSpeed: number
}

type Phase = "PAUSED" | "COUNTDOWN" | "PLAYING"

export interface GameState {
  startedAt: number | null
  phase: Phase
  ships: Record<PlayerId, Ship>
  cubes: Cube[]
  completedPlayers: Record<PlayerId, { place: number; elapse: number }>
}

type GameActions = {
  switchPhase: (phase: Phase) => void
  setShipDirection: (direction: ShipDirection) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  // NB: Use literal number below because of bug with parsing. Sync with UPDATES_PER_SECOND
  updatesPerSecond: 30,
  setup: (allPlayerIds): GameState => {
    // Setup ships
    const ships: Record<PlayerId, Ship> = {}

    const shipStartPositions =
      SHIP_START_POSITIONS[
        Math.min(allPlayerIds.length - 1, SHIP_START_POSITIONS.length - 1)
      ]
    for (const [idx, playerId] of allPlayerIds.entries()) {
      ships[playerId] = {
        position: {
          x: shipStartPositions[idx % shipStartPositions.length],
          z: 0,
        },
        rotation: {
          z: 0,
        },
        xSpeed: 0,
        zSpeed: 50,
        topZSpeed: 50,
        direction: null,
      }
    }

    // Setup cubes
    const cubes: Cube[] = []
    for (let i = 0; i < NUMBER_OF_CUBES; i++) {
      cubes.push({
        x:
          Math.random() * (Math.abs(LEFT_WALL_POSITION) + RIGHT_WALL_POSITION) -
          RIGHT_WALL_POSITION,
        z: -(20 + Math.random() * (TRACK_DISTANCE - 20)),
        colorIdx: Math.floor(Math.random() * CUBE_COLORS.length),
      })
    }

    return {
      startedAt: null,
      phase: "PAUSED",
      ships,
      cubes,
      completedPlayers: {},
    }
  },
  actions: {
    switchPhase: (phase, { game }) => {
      if (game.phase === phase) return

      game.phase = phase
      if (game.phase === "COUNTDOWN") {
        game.startedAt = Rune.gameTime()
      }
    },
    setShipDirection: (direction, { game, playerId }) => {
      game.ships[playerId].direction = direction
    },
  },

  update: ({ game, allPlayerIds }) => {
    if (game.phase === "PAUSED") {
      return
    }

    if (game.phase === "COUNTDOWN" && game.startedAt) {
      if (Rune.gameTime() - game.startedAt > COUNTDOWN_MS) {
        game.phase = "PLAYING"
      }

      return
    }

    for (const playerId of allPlayerIds) {
      // Ignore completed player
      if (game.completedPlayers[playerId]) continue

      const ship = game.ships[playerId]

      // Horizontal speed used for changing ship direction
      const xSpeedRate = 0.14
      if (ship.direction === null) {
        ship.xSpeed *= 0.8
      } else if (ship.direction === "left") {
        ship.xSpeed += 0.02 * xSpeedRate
      } else if (ship.direction === "right") {
        ship.xSpeed -= 0.02 * xSpeedRate
      }

      ship.xSpeed = Math.max(-0.5, Math.min(0.5, ship.xSpeed))
      ship.position.x += ship.xSpeed * xSpeedRate * -10
      ship.position.x = Math.min(
        Math.max(ship.position.x, LEFT_WALL_POSITION + HALF_SHIP_WIDTH),
        RIGHT_WALL_POSITION - HALF_SHIP_WIDTH,
      )

      // Forward speed
      const zSpeedRate = 0.002
      if (ship.zSpeed < 300) {
        // Quickly increase speed
        ship.zSpeed *= 1.01
        // Cap max speed
        ship.zSpeed = Math.min(ship.zSpeed, 300)
      } else {
        // Slowly increase speed
        ship.zSpeed += 10 / UPDATES_PER_SECOND
        // Cap max speed
        ship.zSpeed = Math.min(ship.zSpeed, 800)
      }
      ship.topZSpeed = Math.max(ship.topZSpeed, ship.zSpeed)
      ship.position.z -= ship.zSpeed * zSpeedRate

      ship.rotation.z = (ship.rotation.z + ship.xSpeed * 10) * 0.7
      ship.rotation.z = Math.min(0.4, Math.max(-0.4, ship.rotation.z))

      // Decrease speed on collision
      for (const cube of game.cubes) {
        if (
          Math.abs(ship.position.z - cube.z) <
            CUBE_DEPTH / 2 + SHIP_DEPTH / 2 &&
          Math.abs(ship.position.x - cube.x) < CUBE_WIDTH / 2 + HALF_SHIP_WIDTH
        ) {
          ship.zSpeed *= 0.5
          // Cap min speed
          ship.zSpeed = Math.max(ship.zSpeed, 50)
        }
      }

      // Add to completedPlayers when player finishes
      if (-ship.position.z >= TRACK_DISTANCE) {
        ship.position.z = -TRACK_DISTANCE
        ship.zSpeed = 0

        const place = Object.keys(game.completedPlayers).length + 1
        const elapse = Rune.gameTime()
        game.completedPlayers[playerId] = { place, elapse }
      }

      // Game over when all players finish
      if (Object.keys(game.completedPlayers).length === allPlayerIds.length) {
        Rune.gameOver({
          players: Object.fromEntries(
            Object.entries(game.completedPlayers).map(
              ([playerId, { place }]) => [
                playerId,
                place === 1 ? "WON" : "LOST",
              ],
            ),
          ),
        })
      }
    }
  },

  events: {
    playerLeft(playerId, { game }) {
      delete game.completedPlayers[playerId]
    },
  },
})
