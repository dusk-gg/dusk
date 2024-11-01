// The controls that the player provide to the logic
// to control their player
export type Controls = {
  // the x-axis value from the joystick
  x: number
  // the y-axis value from the joystick
  y: number
  // true if the player is pressing jump
  jump: boolean
  // the angle of the camera on the client side
  // needed to work out which direction to move
  // in the logic
  cameraAngle: number
}
