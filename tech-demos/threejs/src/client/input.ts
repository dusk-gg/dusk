/**
 * Manages the player input and sending that input to the logic
 * side.
 */
import { Controls } from "../shared/controls"
import { getCameraAngle, rotateCameraY } from "./camera"
import { getJoystickState } from "./joystick"

// the state of the keyboard keyed on the name of the key.
const keyPressed: Record<string, boolean> = {}
// to be sent when we change the controls
let lastSentControls: Controls = { x: 0, y: 0, cameraAngle: 0, jump: false }
// The time at which the last action for control update was sent. We keep this
// less than 10 a second but override it if movement is blocked
let lastSentTime: number = Date.now()

// the amount of space in the middle of the joystick thats considered dead - i.e.
// doesn't generate movement - without this the smallest touch causes motion
export const DEAD_ZONE = 0.25
// the amount the camera can rotate to keep up with a turning player
export const CAMERA_ROTATE = 0.05
// The interval that we send a controls action - need to leave space
// to send an immediate update should we get blocked
export const CONTROLS_SEND_INTERVAL = 150
// True if the player has pushed the jump button
export let jump: boolean = false

/**
 * Setup the input event listener for keyboard and
 * jump button. Keyboard provided for testing only
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

  document.getElementById("jump")?.addEventListener("mousedown", () => {
    jump = true
  })
  document.getElementById("jump")?.addEventListener("touchstart", () => {
    jump = true
  })
}

/**
 * Check if a key is pressed on the keyboard
 *
 * @param key The key to check for
 * @returns True if that key is pressed
 */
function isKeyDown(key: string) {
  return keyPressed[key] === true
}

/**
 * Update the input every frame
 */
export function updateInput() {
  // apply joystick and keyboard state to work out the new
  // control state to send
  const joystickState = getJoystickState()
  const currentControls: Controls = {
    x: 0,
    y: 0,
    cameraAngle: getCameraAngle(),
    jump: isKeyDown(" ") || jump,
  }

  // generate controls to send to the server
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

  // if the controls indicate left/right motion then rotate the camera
  // slightly to follow the turn
  if (currentControls.x < 0) {
    rotateCameraY(-CAMERA_ROTATE * (Math.abs(currentControls.x) - DEAD_ZONE))
  }
  if (currentControls.x > 0) {
    rotateCameraY(CAMERA_ROTATE * (Math.abs(currentControls.x) - DEAD_ZONE))
  }

  // only send the control update if something has changed
  if (
    lastSentControls.x !== currentControls.x ||
    lastSentControls.y !== currentControls.y ||
    lastSentControls.cameraAngle !== currentControls.cameraAngle ||
    lastSentControls.jump !== currentControls.jump
  ) {
    // only send the control update if we haven't sent one recent, or if:
    //
    // * We've stopped
    // * We've jumped
    //
    // Need to do those one's promptly to make it feel like the player
    // has direct control
    if (
      Date.now() - lastSentTime > CONTROLS_SEND_INTERVAL ||
      currentControls.jump || // send jump instantly
      (currentControls.x === 0 &&
        currentControls.y === 0 &&
        (lastSentControls.x !== 0 || lastSentControls.y !== 0))
    ) {
      Rune.actions.update(currentControls)
      lastSentControls = currentControls
      lastSentTime = Date.now()
      jump = false
    }
  }
}
