import "./client/styles.css"

import { getScene, setupRenderer } from "./client/renderer"
import { loadTexture, setupModels } from "./client/models"
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
import {
  GAME_MAP_HEIGHT,
  GAME_MAP_WIDTH,
  GameMap,
  getHeightAt,
} from "./shared/map"
import {
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  RepeatWrapping,
  Texture,
} from "three"
import { getAssetUrl } from "./util/assets"

let localPlayerCharacter: Character3D
let builtGameMap: boolean = false
let wallTexture: Texture
;(async () => {
  setupRenderer()
  setupCamera()
  setupLights()

  wallTexture = await loadTexture(getAssetUrl("walltexture.png"))
  wallTexture.wrapS = RepeatWrapping
  wallTexture.wrapT = RepeatWrapping
  wallTexture.center.set(0.5, 0.5)

  await setupModels()
  setupWorld()
  setupInput()

  Rune.initClient({
    onChange: ({ game, yourPlayerId }) => {
      if (!builtGameMap) {
        buildGameMap(game.map)
      }
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

export function buildGameMap(map: GameMap): void {
  builtGameMap = true

  for (let x = 0; x < GAME_MAP_WIDTH; x++) {
    for (let z = 0; z < GAME_MAP_HEIGHT; z++) {
      const height = getHeightAt(map, x, z)
      if (height) {
        const geometry = new BoxGeometry(1, 1, 1)
        const material = new MeshLambertMaterial({ map: wallTexture })
        const cube = new Mesh(geometry, material)
        cube.castShadow = true
        cube.receiveShadow = true
        cube.scale.y = height
        cube.position.x = x + 0.5
        cube.position.y = height / 2
        cube.position.z = z + 0.5
        getScene().add(cube)
      }
    }
  }
}
