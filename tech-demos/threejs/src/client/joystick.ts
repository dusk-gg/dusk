import nipplejs, { JoystickManager } from "nipplejs"

export type JoystickState = {
  x: number
  y: number
}

// the current state of the virtual joystick
let joystickState = { x: 0, y: 0 }

const joystickDiv = document.getElementById("joystick") as HTMLDivElement
let joystick: JoystickManager = nipplejs.create({
  mode: "static",
  zone: joystickDiv ?? document.body,
  position: { left: "50%", bottom: "50%" },
  threshold: 0.2,
})
let controller = joystick.get(0)

document.addEventListener("touchcancel", () => {
  resetJoystick()
})

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
setTimeout(() => {
  resetJoystick()
}, 1000)

/**
 * Display the joystick on screen. This actually adds the DOM
 * elements for the joystick to the screen.
 */
export function showJoystick(): void {
  if (controller) {
    controller.add()
  }
  joystickDiv.style.pointerEvents = "all"
}

/**
 * Hide the joystick on screen. This actually removes the DOM
 * elements for the joystick to the screen.
 */
export function hideJoystick(): void {
  if (controller) {
    controller.remove()
  }
  joystickDiv.style.pointerEvents = "none"
}

/**
 * Get the current position of the joystick
 *
 * @returns The x/y axis of the joystick position
 */
export function getJoystickState(): JoystickState {
  return joystickState
}
