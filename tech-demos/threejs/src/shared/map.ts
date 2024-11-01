export const GAME_MAP_WIDTH = 100
export const GAME_MAP_HEIGHT = 100
export type GameMapElement = number
export type GameMap = GameMapElement[]

export function createGameMap(): GameMap {
  const map: GameMap = []

  setHeightAt(map, 51, 51, 0.15 * 1)
  setHeightAt(map, 52, 51, 0.15 * 2)
  setHeightAt(map, 53, 51, 0.15 * 3)
  setHeightAt(map, 54, 51, 0.15 * 4)
  setHeightAt(map, 51, 52, 1)
  setHeightAt(map, 52, 52, 1)
  setHeightAt(map, 53, 52, 1)
  setHeightAt(map, 54, 52, 1)
  setHeightAt(map, 51, 54, 1)
  setHeightAt(map, 52, 54, 1)

  return map
}

export function setHeightAt(
  map: GameMap,
  x: number,
  z: number,
  height: number
) {
  map[x + z * GAME_MAP_WIDTH] = height
}

export function getHeightAt(map: GameMap, x: number, z: number) {
  x = Math.floor(x)
  z = Math.floor(z)
  return map[x + z * GAME_MAP_WIDTH] ?? 0
}
