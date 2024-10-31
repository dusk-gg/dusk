import type { PlayerId, RuneClient } from "rune-sdk"
import {
  CHARACTER_MODEL_COUNT,
  MOVE_SPEED_PER_FRAME,
  LOGIC_FPS,
  MOVE_SPEED,
} from "./shared/constants"
import { Controls } from "./shared/controls"
import { Character, Vec3 } from "./shared/types"
import { createGameMap, GameMap } from "./shared/map"

export interface GameState {
  map: GameMap
  controls: Record<PlayerId, Controls>
  characters: Character[]
}

type GameActions = {
  update: (controls: Controls) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

function addCharacter(id: string, state: GameState) {
  const char: Character = {
    id,
    type: Math.floor(Math.random() * CHARACTER_MODEL_COUNT),
    position: { x: 0, y: 0, z: 0 },
    angle: 0,
    speed: 0,
  }
  state.characters.push(char)
}

export function getDirectionFromAngle(angle: number): Vec3 {
  // clamp the angle resolution to prevent stutters
  angle = Math.floor(angle * 100) / 100

  return { x: -Math.sin(angle), y: 0, z: Math.cos(angle) }
}

export function getNewPositionAndAngle(
  controls: Controls,
  pos: Vec3
): { pos: Vec3; angle: number } {
  const dir = getDirectionFromAngle(controls.cameraAngle)
  const result = {
    pos: { ...pos },
    angle: 0,
  }
  result.angle = -(controls.cameraAngle - Math.atan2(-controls.x, controls.y))
  if (controls.x < 0) {
    result.pos.x += dir.z * MOVE_SPEED_PER_FRAME * Math.abs(controls.x)
    result.pos.z -= dir.x * MOVE_SPEED_PER_FRAME * Math.abs(controls.x)
  }
  if (controls.x > 0) {
    result.pos.x -= dir.z * MOVE_SPEED_PER_FRAME * Math.abs(controls.x)
    result.pos.z += dir.x * MOVE_SPEED_PER_FRAME * Math.abs(controls.x)
  }
  if (controls.y < 0) {
    result.pos.x -= dir.x * MOVE_SPEED_PER_FRAME * Math.abs(controls.y)
    result.pos.z -= dir.z * MOVE_SPEED_PER_FRAME * Math.abs(controls.y)
  }
  if (controls.y > 0) {
    result.pos.x += dir.x * MOVE_SPEED_PER_FRAME * Math.abs(controls.y)
    result.pos.z += dir.z * MOVE_SPEED_PER_FRAME * Math.abs(controls.y)
  }
  return result
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 6,
  updatesPerSecond: LOGIC_FPS,
  setup: (allPlayerIds) => {
    const state: GameState = {
      map: createGameMap(),
      controls: {},
      characters: [],
    }

    for (const id of allPlayerIds) {
      addCharacter(id, state)
    }
    return state
  },
  events: {
    playerLeft: (playerId, { game }) => {
      // remove the character that represents the player that left
      game.characters = game.characters.filter((c) => c.id !== playerId)
    },
    playerJoined: (playerId, { game }) => {
      addCharacter(playerId, game)
    },
  },
  update: ({ allPlayerIds, game }) => {
    for (const playerId of allPlayerIds) {
      const controls = game.controls[playerId]
      const character = game.characters.find((c) => c.id === playerId)

      if (controls && (controls.x !== 0 || controls.y !== 0) && character) {
        const newPos = getNewPositionAndAngle(controls, character.position)
        character.position.x = newPos.pos.x
        character.position.z = newPos.pos.z
        character.angle = newPos.angle

        character.speed =
          Math.sqrt(controls.x * controls.x + controls.y * controls.y) *
          MOVE_SPEED
      } else if (character) {
        character.speed = 0
      }
    }
  },
  actions: {
    update: (controls: Controls, { game, playerId }) => {
      game.controls[playerId] = controls
    },
  },
})
