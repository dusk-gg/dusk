/**
 * A simple game map made of heights across a array
 * of tiles in the world
 */

// width of the game map in tiles
export const GAME_MAP_WIDTH = 100
// height of the game map in tiles
export const GAME_MAP_HEIGHT = 100
// wrapper for the content of each tile - useful
// if we want to add color or other attributes later
export type GameMapElement = number
// the actual game map is an array of tiles. We only
// specify the height if its non-zero to keep the size down
export type GameMap = GameMapElement[]

/**
 * Create a new game map with a test world
 *
 * @return The newly created game map
 */
export function createGameMap(): GameMap {
  const map: GameMap = []

  // raw data for the world map - this is just a tech
  // demo
  setHeightAt(map, 51, 51, 0.15 * 1)
  setHeightAt(map, 52, 51, 0.15 * 2)
  setHeightAt(map, 53, 51, 0.15 * 3)
  setHeightAt(map, 54, 51, 0.15 * 4)
  setHeightAt(map, 51, 52, 1)
  setHeightAt(map, 52, 52, 1)
  setHeightAt(map, 53, 52, 1)
  setHeightAt(map, 54, 52, 1)

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      setHeightAt(map, 51 + x, 54 + y, 1)
    }
  }
  return map
}

/**
 * Set the height at given tile location
 *
 * @param map The map to set the tile on
 * @param x The x location on the tile map
 * @param z The z location on the tile map
 * @param height The height of the block at this location
 */
export function setHeightAt(
  map: GameMap,
  x: number,
  z: number,
  height: number
) {
  map[x + z * GAME_MAP_WIDTH] = height
}

/**
 * Get the height at a given location. We're going to keep
 * this simple and fast since we'll want to do a few of these
 * in the logic
 *
 * @param map The map that we're accessing
 * @param x The x location on the tile map
 * @param z The z location on the tile map
 * @return The height of the block at this location
 */
export function getHeightAt(map: GameMap, x: number, z: number) {
  x = Math.floor(x)
  z = Math.floor(z)
  return map[x + z * GAME_MAP_WIDTH] ?? 0
}
