import "./client/styles.css"

import { setupRenderer } from "./client/renderer"
import { setupModels } from "./client/models"
import { setupCamera } from "./client/camera"
import { setupLights } from "./client/lights"
import { setupWorld } from "./client/world"
import {
  Character3D,
  createCharacter3D,
  getCharacter3D,
  getCurrentCharacterIds,
  removeCharacter3D,
  updateCharacter3DFromLogic,
} from "./client/character"
import { setupInput } from "./client/input"

let localPlayerCharacter: Character3D

;(async () => {
  setupRenderer()
  setupCamera()
  setupLights()
  await setupModels()
  setupWorld()
  setupInput()

  Rune.initClient({
    onChange: ({ game, yourPlayerId }) => {
      for (const char of game.characters) {
        // theres a new character we haven't got in out scene
        if (!getCharacter3D(char.id)) {
          const char3D = createCharacter3D(char)
          if (char.id === yourPlayerId) {
            localPlayerCharacter = char3D
          }
        }

        updateCharacter3DFromLogic(char)
      }
      for (const id of getCurrentCharacterIds()) {
        // one of the scene characters has been removed
        if (!game.characters.find((c) => c.id === id)) {
          removeCharacter3D(id)
        }
      }
    },
  })
})()

export function getLocalCharacter3D(): Character3D | undefined {
  return localPlayerCharacter
}