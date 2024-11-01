/**
 * NippleJS (https://github.com/yoannmoinet/nipplejs) is a great library
 * for virtual/on-screen joysticks. This manages that joystick.
 */
import nipplejs, { Joystick, JoystickManager } from "nipplejs"

/**
 * The current state of the joystick axis
 */
export type JoystickState = {
  x: number
  y: number
}

// the current state of the virtual joystick
let joystickState = { x: 0, y: 0 }

// setup the joyst
const joystickDiv = document.getElementById("joystick") as HTMLDivElement
let joystick: JoystickManager
let controller: Joystick

document.addEventListener("touchcancel", () => {
  // if we get a touch cancel then we've moved off the game
  // to another part of UI. Only way to clear this at the moment
  // is to recreate the joystick
  resetJoystick()
})

/**
 * Reset the joystick at init and should the state get
 * incorrect based on touch cancel/
 *
 * https://github.com/yoannmoinet/nipplejs/issues/64
 */
export function resetJoystick() {
  if (joystick) {
    joystick.destroy()
  }
  if (controller) {
    controller.remove()
  }
  joystick = nipplejs.create({
    mode: "static",
    zone: joystickDiv ?? document.body,
    position: { left: "50%", bottom: "50%" },
    threshold: 0.2,
    color: "",
  })
  controller = joystick.get(joystick.ids[0])
  joystick.on("move", (event, joystick) => {
    joystickState = joystick.vector
    // clamp inputs to stop stutter
    joystickState.x = Math.floor(joystickState.x * 30) / 30
    joystickState.y = Math.floor(joystickState.y * 30) / 30
  })
  joystick.on("end", () => {
    joystickState = { x: 0, y: 0 }
  })
}

resetJoystick()
// added this to clear out invalid initial states that
// can happen on load
setTimeout(() => {
  resetJoystick()
}, 1000)

/**
 * Get the current position of the joystick
 *
 * @returns The x/y axis of the joystick position
 */
export function getJoystickState(): JoystickState {
  return joystickState
}
