// A simple 3 dimensional vector that the logic can use. We don't
// want the logic to get dependent on ThreeJS since it'll pull
// in lots of non-logic safe elements so provide
export type Vec3 = {
  x: number
  y: number
  z: number
}

// The logic side representation of a in game character
export type Character = {
  // the ID given to the character - the player ID in this case
  // but left as a string to support non-player characters later
  id: string
  // the type of the character, maps to a 3D model
  type: number
  // the position of the player in the world
  position: Vec3
  // the angle of the Y axis the player is facing
  angle: number
  // the speed the player was moving at their last step
  lastMovementSpeed: number
  // the velocity on the Y axis of the character (for falling and jumping)
  velocityY: number
}
