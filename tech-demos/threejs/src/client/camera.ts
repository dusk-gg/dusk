/**
 * The camera handling provides a nice character controller that
 * works a bit like Roblox. Your movement is always relative
 * to the camera angle apart from when you move left or right
 * where the camera is also adjust slightly to follow the turn.
 *
 * Independently its possible to rotate the camera view with
 * a second touch giving the player the ability to run forward
 * and turn the camera.
 *
 * Finally the camera also interpolates
 */
import { Euler, PerspectiveCamera, Vector3 } from "three"
import { Character3D } from "./character"

// the position the camera is looking at - independent of the
// player position so we can move it smoothly
const lookAt: Vector3 = new Vector3(0, 1, 0)
// The angle we're trying to get to on the camera local Y axis. Independent
// of the actual value so it can be moved smoothly
let targetAngleY: number = 0
// The angle we're trying to get to on the cameral local Z axis. Independent
// of the actual value so it can be moved smoothly
let targetAngleZ: number = Math.PI

// The ThreeJS camera
const camera: PerspectiveCamera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  150
)

/**
 * Initialize the camera - this will be
 * quickly overridden by where the player is
 */
export function setupCamera() {
  camera.position.set(0, 1, 5)
  camera.lookAt(0, 1, 0)
}

/**
 * Update the camera per frame based on where the player
 * character is
 *
 * @param targetCharacter The character (the player) that the
 * camera should be focused on
 */
export function updateCamera(targetCharacter: Character3D) {
  // the offset from the ground the camera maintains
  const cameraHeight = 2
  // The distance from the target (look at)
  const cameraDistance = 4
  // The speed that the camera lerps at
  const cameraSoftness = 0.2
  // The height we're looking at - so we're not looking
  // at the player's feet
  const cameraTargetHeight = 1

  // work out where the camera "should be" once it's
  // finished smoothly moving
  const { x, y, z } = targetCharacter.model.position

  const targetPosition = new Vector3(cameraDistance, 0, 0)
  targetPosition.applyEuler(new Euler(0, -targetAngleY, -targetAngleZ))
  targetPosition.add(new Vector3(x, y + cameraHeight, z))

  // interpolate the camera's position to the place we want it to be
  camera.position.lerp(targetPosition, cameraSoftness)
  // interpolate the cameras's target to the player
  lookAt.lerp(new Vector3(x, y + cameraTargetHeight, z), cameraSoftness)
  camera.lookAt(lookAt)
}

/**
 * Accessor for other part of the game
 *
 * @returns The camera instance we're using to view the game
 */
export function getCamera() {
  return camera
}

/**
 * Rotate the camera on its local Z-Axis. Used for dragging
 * the camera angle around
 *
 * @param delta The amount to change the rotation in radians
 */
export function rotateCameraZ(delta: number): void {
  targetAngleZ += delta

  // clamp the angle so we don't get into weird flip over
  // cases
  targetAngleZ = Math.min(Math.max(targetAngleZ, 2.8), 6.7)
  if (targetAngleZ > 4 && targetAngleZ < 4.5) {
    targetAngleZ = 4
  }
  if (targetAngleZ > 5.2 && targetAngleZ < 5.5) {
    targetAngleZ = 5.5
  }
}

/**
 * Rotate the camera on the Y Axis - used for turning
 * when we move left/right
 *
 * @param delta The amount to change the rotation in radians
 */
export function rotateCameraY(delta: number): void {
  targetAngleY += delta
}

/**
 * Work out the angle that the camera is looking on the
 * Y axis. This controls how we move forward/backwards
 *
 * @returns The angle in radians on the Y axis of the camera
 */
export function getCameraAngle(): number {
  const dir = new Vector3()
  camera.getWorldDirection(dir)
  const angle = Math.atan2(-dir.x, dir.z)
  return angle
}
