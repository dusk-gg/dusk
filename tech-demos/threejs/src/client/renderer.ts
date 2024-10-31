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

const scene: Scene = new Scene()
const renderer = new WebGLRenderer({
  powerPreference: "high-performance",
  antialias: true,
})
const FPS = 30
let lastWindowWidth = 0
let lastWindowHeight = 0
let mouseX = 0
let mouseY = 0
let mouseDown = false

export function getScene() {
  return scene
}

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

  updateInput()
  const localPlayer = getLocalCharacter3D()
  if (localPlayer) {
    getShadowingLightGroup().position.x = localPlayer.model.position.x
    getShadowingLightGroup().position.z = localPlayer.model.position.z

    updateCamera(localPlayer)
  }
  updateCharacterPerFrame(1 / FPS)
  renderer.render(scene, getCamera())
}

export function setupRenderer() {
  // tone mapping controls how the color of points in the
  // world is mapped to pixels on the screen. This tone mapping
  // gives the rich look
  renderer.toneMapping = ACESFilmicToneMapping

  renderer.setPixelRatio(1)

  // enable the shadow map rendering
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

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

  setInterval(() => {
    render()
  }, 1000 / FPS)
}
