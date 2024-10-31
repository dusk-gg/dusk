export type Vec3 = {
  x: number
  y: number
  z: number
}

export type Character = {
  id: string
  type: number
  position: Vec3
  angle: number
  speed: number
}
