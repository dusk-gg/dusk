import {
  ACESFilmicToneMapping,
  Color,
  FogExp2,
  PCFShadowMap,
  Scene,
  WebGLRenderer,
} from "three"
import { getCamera, updateCamera } from "./camera"
import { updateCharacterPerFrame } from "./character"
import { updateInput } from "./input"
import { getLocalCharacter3D } from "./client"

const scene: Scene = new Scene()
const renderer = new WebGLRenderer({
  powerPreference: "high-performance",
  antialias: true,
})
const FPS = 30
let lastWindowWidth = 0
let lastWindowHeight = 0

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

  setInterval(() => {
    render()
  }, 1000 / FPS)
}
