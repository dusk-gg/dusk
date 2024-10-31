import { AmbientLight, DirectionalLight, Object3D } from "three"
import { getScene } from "./renderer"

// The texture size of the shadow map - 2048 should be safe
// on all devices and the resolution is "good enough"
export const SHADOW_MAP_SIZE = 2048
// The near plane for the shadow camera
export const SHADOW_MAP_NEAR_PLANE = 0.001
// The far plan for the shadow camera (this changes how the resolution
// of the shadow map is calculated)
export const SHADOW_MAP_FAR_PLANE = 500
// The distance of the edges of the shadow map frustum
export const SHADOW_MAP_BOUNDS = 7

// the light group containing any shadow generating lights so we
// can move them with the camera to update the shadow map
let lightGroup: Object3D
let directionalLight: DirectionalLight
let ambientLight: AmbientLight

/**
 * Setup the limited lighting in the scene
 */
export function setupLights() {
  // base ambient lighting so everything is visible
  ambientLight = new AmbientLight(0xffffff, 1)
  getScene().add(ambientLight)

  // create the moveable directional light that generates
  // the shadow map
  lightGroup = new Object3D()
  directionalLight = new DirectionalLight(0xffffff, 1)
  directionalLight.position.set(-3, 3, 3)
  lightGroup.add(directionalLight)
  lightGroup.add(directionalLight.target)
  getScene().add(lightGroup)

  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = SHADOW_MAP_SIZE
  directionalLight.shadow.mapSize.height = SHADOW_MAP_SIZE
  directionalLight.shadow.camera.near = SHADOW_MAP_NEAR_PLANE
  directionalLight.shadow.camera.far = SHADOW_MAP_FAR_PLANE
  directionalLight.shadow.camera.left = -SHADOW_MAP_BOUNDS
  directionalLight.shadow.camera.right = SHADOW_MAP_BOUNDS
  directionalLight.shadow.camera.top = SHADOW_MAP_BOUNDS
  directionalLight.shadow.camera.bottom = -SHADOW_MAP_BOUNDS
}

/**
 * Retrieve the light group of lights that generate
 * shadows so they can be moved with the camera/player
 *
 * @returns The light group containing shadow generating lights
 */
export function getShadowingLightGroup(): Object3D {
  return lightGroup
}
