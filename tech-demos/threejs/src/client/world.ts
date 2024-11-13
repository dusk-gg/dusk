/**
 * Setup the static parts of the world. A plane for the floor
 * textured to look like blocks and the game map itself
 */
import {
  PlaneGeometry,
  Mesh,
  MeshLambertMaterial,
  RepeatWrapping,
  DoubleSide,
  BoxGeometry,
  Texture,
} from "three"
import { getScene } from "./renderer"
import { getAssetUrl } from "../util/assets"
import { loadTexture } from "./models"
import {
  GameMap,
  GAME_MAP_WIDTH,
  GAME_MAP_HEIGHT,
  getHeightAt,
} from "../shared/map"

// True if we've built the game map (the blocks) - only
// want to do this once
let builtGameMap: boolean = false
// The texture that we'll apply to walls when we create them
let wallTexture: Texture

/**
 * Setup the static parts of the world
 */
export async function setupWorld() {
  // create a big plane for the floor and texture it appropriately
  const geometry = new PlaneGeometry(GAME_MAP_WIDTH, GAME_MAP_HEIGHT)
  const texture = await loadTexture(getAssetUrl("floor.png"))
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping

  texture.center.set(0.5, 0.5)
  texture.repeat.set(GAME_MAP_WIDTH / 2, GAME_MAP_HEIGHT / 2)
  const material = new MeshLambertMaterial({
    map: texture,
    side: DoubleSide,
  })
  const baseFloorPlane = new Mesh(geometry, material)
  baseFloorPlane.translateX(50)
  baseFloorPlane.translateZ(50)
  baseFloorPlane.rotateX(-Math.PI / 2)
  baseFloorPlane.receiveShadow = true
  getScene().add(baseFloorPlane)

  // load the texture we'll apply to walls when we add them
  wallTexture = await loadTexture(getAssetUrl("walltexture.png"))
  wallTexture.wrapS = RepeatWrapping
  wallTexture.wrapT = RepeatWrapping
  wallTexture.center.set(0.5, 0.5)
}

/**
 * Build the logic driven game map out of blocks in the world
 *
 * @param map The data map to rendered
 */
export function buildGameMap(map: GameMap): void {
  // only build the game map once
  if (builtGameMap) {
    return
  }

  builtGameMap = true

  // cycle through any blocks that are defined and create
  // a simple box with the wall texture at the right height
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
