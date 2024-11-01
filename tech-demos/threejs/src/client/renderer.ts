/**
 * The core rendering loop and ThreeJS rendering. We run at
 * 30 FPS for low end mobile devices to keep up
 */
import {
  ACESFilmicToneMapping,
  Color,
  FogExp2,
  PCFShadowMap,
  Scene,
  WebGLRenderer,
} from "three"
import { getCamera, rotateCameraY, rotateCameraZ, updateCamera } from "./camera"
import { updateCharacterPerFrame } from "./character"
import { updateInput } from "./input"
import { getLocalCharacter3D } from "../client"
import { getShadowingLightGroup } from "./lights"
import { RENDER_FPS } from "../shared/constants"

// the main ThreeJS scene we're rendering
const scene: Scene = new Scene()

// the Three JS renderer
const renderer = new WebGLRenderer({
  powerPreference: "high-performance",
  antialias: true,
})

// the last window width we've applied. Allows
// for resizing the window when we're testing on web
let lastWindowWidth = 0
// the last window height we've applied. Allows
// for resizing the window when we're testing on web
let lastWindowHeight = 0
// the last mouse/finger position recorded - used
// for dragging the screen
let mouseX = 0
// the last mouse/finger position recorded - used
// for dragging the screen
let mouseY = 0
// Record whether the user has currently touched/moused
// the screen for dragging
let mouseDown = false

/**
 * Get the main scene we're displaying so other parts
 * of the game can add to it
 *
 * @returns The main ThreeJS scene being rendered
 */
export function getScene() {
  return scene
}

/**
 * The core render loop responsible for updating the
 * different parts of the game and rendering the scene
 * with ThreeJS
 */
function render() {
  // resize the display if the game has been changed when
  // testing on the web
  if (
    lastWindowWidth !== window.innerWidth ||
    lastWindowHeight !== window.innerHeight
  ) {
    lastWindowWidth = window.innerWidth
    lastWindowHeight = window.innerHeight
    getCamera().aspect = window.innerWidth / window.innerHeight
    getCamera().updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  // update the different elements of the game
  updateInput()
  const localPlayer = getLocalCharacter3D()
  if (localPlayer) {
    getShadowingLightGroup().position.x = localPlayer.model.position.x
    getShadowingLightGroup().position.z = localPlayer.model.position.z

    updateCamera(localPlayer)
  }
  updateCharacterPerFrame(1 / RENDER_FPS)

  // render the game with ThreeJS
  renderer.render(scene, getCamera())
}

/**
 * Setup the game's renderer in ThreeJS
 */
export function setupRenderer() {
  // tone mapping controls how the color of points in the
  // world is mapped to pixels on the screen. This tone mapping
  // gives the rich look
  renderer.toneMapping = ACESFilmicToneMapping

  renderer.setPixelRatio(1)

  // enable the shadow map rendering
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap

  // add the renderer to the DOM
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // background color with a fog to the distance
  const skyBlue = 0x87ceeb
  scene.background = new Color(skyBlue)
  scene.fog = new FogExp2(skyBlue, 0.02)

  // setup dragging off the joystick to move the camera
  const touchDevice = "ontouchstart" in document.documentElement
  if (touchDevice) {
    renderer.domElement.addEventListener("touchstart", (e) => {
      mouseX = e.targetTouches[0].clientX
      mouseY = e.targetTouches[0].clientY
      mouseDown = true
    })
    renderer.domElement.addEventListener("touchend", () => {
      mouseDown = false
    })
    renderer.domElement.addEventListener("touchmove", (e) => {
      if (mouseDown) {
        const dx = e.targetTouches[0].clientX - mouseX
        const dy = e.targetTouches[0].clientY - mouseY
        mouseX = e.targetTouches[0].clientX
        mouseY = e.targetTouches[0].clientY

        rotateCameraZ(dy * 0.01)
        rotateCameraY(dx * 0.01)
      }
    })
  } else {
    renderer.domElement.addEventListener("mousedown", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      mouseDown = true
    })
    renderer.domElement.addEventListener("mouseup", () => {
      mouseDown = false
    })
    renderer.domElement.addEventListener("mousemove", (e) => {
      if (mouseDown) {
        const dx = e.clientX - mouseX
        const dy = e.clientY - mouseY
        mouseX = e.clientX
        mouseY = e.clientY

        rotateCameraZ(dy * 0.01)
        rotateCameraY(dx * 0.01)
      }
    })
  }

  // render the scene every at the configured FPS
  setInterval(() => {
    render()
  }, 1000 / RENDER_FPS)
}
