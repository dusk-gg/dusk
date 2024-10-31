import { getCameraAngle, rotateCameraY } from "./camera"
import { getJoystickState } from "./joystick"
import { Controls } from "./logic"

// the state of the keyboard keyed on the name of the key.
const keyPressed: Record<string, boolean> = {}
// to be sent when we change the controls
let lastSentControls: Controls = { x: 0, y: 0, cameraAngle: 0 }
// The time at which the last action for control update was sent. We keep this
// less than 10 a second but override it if movement is blocked
let lastSentTime: number = Date.now()

export const DEAD_ZONE = 0.25
// the amount the camera can rotate to keep up with a turning player
export const CAMERA_ROTATE = 0.01
// The interval that we send a controls action - need to leave space
// to send an immediate update should we get blocked
export const CONTROLS_SEND_INTERVAL = 150

/**
 * Setup the input event listener
 */
export function setupInput() {
  window.addEventListener("keydown", (e) => {
    // record key state
    keyPressed[e.key] = true
  })

  window.addEventListener("keyup", (e) => {
    // record key state
    keyPressed[e.key] = false
  })
}

export function isKeyDown(key: string) {
  return keyPressed[key] === true
}

export function updateInput() {
  // apply joystick and keyboard state to work out the new
  // control state to send
  const joystickState = getJoystickState()
  const currentControls: Controls = {
    x: 0,
    y: 0,
    cameraAngle: getCameraAngle(),
  }

  if (isKeyDown("a") || joystickState.x < -DEAD_ZONE) {
    currentControls.x = isKeyDown("a") ? -1 : joystickState.x
  }
  if (isKeyDown("d") || joystickState.x > DEAD_ZONE) {
    currentControls.x = isKeyDown("d") ? 1 : joystickState.x
  }
  if (isKeyDown("w") || joystickState.y > DEAD_ZONE) {
    currentControls.y = isKeyDown("w") ? 1 : joystickState.y
  }
  if (isKeyDown("s") || joystickState.y < -DEAD_ZONE) {
    currentControls.y = isKeyDown("s") ? -1 : joystickState.y
  }

  if (currentControls.x < 0) {
    rotateCameraY(-CAMERA_ROTATE * (Math.abs(currentControls.x) - DEAD_ZONE))
  }
  if (currentControls.x > 0) {
    rotateCameraY(CAMERA_ROTATE * (Math.abs(currentControls.x) - DEAD_ZONE))
  }

  if (
    lastSentControls.x !== currentControls.x ||
    lastSentControls.y !== currentControls.y ||
    lastSentControls.cameraAngle !== currentControls.cameraAngle
  ) {
    if (
      Date.now() - lastSentTime > CONTROLS_SEND_INTERVAL ||
      (currentControls.x === 0 &&
        currentControls.y === 0 &&
        (lastSentControls.x !== 0 || lastSentControls.y !== 0))
    ) {
      Rune.actions.update(currentControls)
      lastSentControls = currentControls
      lastSentTime = Date.now()
    }
  }
}
