import type { PlayerId, RuneClient } from "rune-sdk"
import {
  CHARACTER_MODEL_COUNT,
  MOVE_SPEED_PER_FRAME,
  LOGIC_FPS,
  MOVE_SPEED,
  MAX_STEP_UP,
  GRAVITY,
  JUMP_POWER,
} from "./shared/constants"
import { Controls } from "./shared/controls"
import { Character, Vec3 } from "./shared/types"
import { createGameMap, GameMap, getHeightAt } from "./shared/map"

// the game state we store for the running game
export interface GameState {
  // the gamp map for collisions etc
  map: GameMap
  // the controls reported for each player
  controls: Record<PlayerId, Controls>
  // the characters in the game world
  characters: Character[]
}

// the actions provided by the clients into the logic. In this
// case its simply the controls
type GameActions = {
  update: (controls: Controls) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

/**
 * Add a character to the game world
 *
 * @param id The ID to assign to the character
 * @param state The current game state
 */
function addCharacter(id: string, state: GameState) {
  const char: Character = {
    id,
    type: Math.floor(Math.random() * CHARACTER_MODEL_COUNT),
    position: {
      x: 50 - state.characters.length,
      y: 0,
      z: 50 - state.characters.length,
    },
    angle: -Math.PI / 2,
    lastMovementSpeed: 0,
    velocityY: 0,
  }
  state.characters.push(char)
}

/**
 * To work out collisions and stepping up we're using a basic box
 * around the location and sampling the heights. This is efficient
 * enough since our game map is just an array of heights
 *
 * @param game The game state including the map
 * @param x The x location to check at
 * @param z The z location to check at
 * @returns The maximum height sample around that point
 */
function findHeightAt(game: GameState, x: number, z: number) {
  let maxHeight = 0
  const characterSize = 0.5
  const step = characterSize / 5
  for (
    let xoffset = -characterSize / 2;
    xoffset <= characterSize / 2;
    xoffset += step
  ) {
    for (
      let zoffset = -characterSize / 2;
      zoffset <= characterSize / 2;
      zoffset += step
    ) {
      maxHeight = Math.max(
        maxHeight,
        getHeightAt(game.map, x + xoffset, z + zoffset)
      )
    }
  }

  return maxHeight
}

/**
 * Convert a angle to vector for calculating movement
 *
 * @param angle The angle of rotation on the Y axis
 * @return A unity vector in that direction
 */
export function getDirectionFromAngle(angle: number): Vec3 {
  // clamp the angle resolution to prevent stutters
  angle = Math.floor(angle * 100) / 100

  return { x: -Math.sin(angle), y: 0, z: Math.cos(angle) }
}

/**
 * Work out what the movement should be based on the player's controls
 * and the angle of the camera
 *
 * @param controls The control state for the player moving
 * @param pos The current position
 * @returns The new position and angle for the player
 */
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

// bootstrap the Rune logic side SDK
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

    // create a character for each player
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
      // someone joined, add a new character for them
      addCharacter(playerId, game)
    },
  },
  update: ({ allPlayerIds, game }) => {
    // each frame we want to apply the player's controls
    for (const playerId of allPlayerIds) {
      const controls = game.controls[playerId]
      const character = game.characters.find((c) => c.id === playerId)

      if (character) {
        // find out the height at the player's current position
        const height = findHeightAt(
          game,
          character.position.x,
          character.position.z
        )
        // handle falling
        if (height < character.position.y) {
          character.velocityY -= GRAVITY
        }
        // handle jumping
        if (
          controls &&
          height === character.position.y &&
          controls.jump &&
          character.velocityY === 0
        ) {
          character.velocityY = JUMP_POWER
        }

        character.position.y += character.velocityY
        // hit ground
        if (character.position.y < height) {
          character.position.y = height
          character.velocityY = 0
        }
      }

      // if the player is trying to move then apply the movement assuming its not blocked
      if (controls && (controls.x !== 0 || controls.y !== 0) && character) {
        // work out where the player would move to
        const newPos = getNewPositionAndAngle(controls, character.position)
        // check the height at that location
        const height = findHeightAt(game, newPos.pos.x, newPos.pos.z)
        const step = height - character.position.y
        // if we can step up the height or its beneath us then move the player
        if (step < MAX_STEP_UP) {
          // not blocked
          if (step > 0) {
            // stepping up
            character.position.y = height
          }
          character.position.x = newPos.pos.x
          character.position.z = newPos.pos.z
          // record the speed so the client side know hows quickly to interpolate
          character.lastMovementSpeed =
            Math.sqrt(controls.x * controls.x + controls.y * controls.y) *
            MOVE_SPEED
        }
        character.angle = newPos.angle
      } else if (character) {
        character.lastMovementSpeed = 0
      }
    }
  },
  actions: {
    update: (controls: Controls, { game, playerId }) => {
      // record the player's controls
      game.controls[playerId] = controls
    },
  },
})
