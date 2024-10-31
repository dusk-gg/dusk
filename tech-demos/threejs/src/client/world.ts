import { PlaneGeometry, Mesh, MeshLambertMaterial, RepeatWrapping } from "three"
import { getScene } from "./renderer"
import { getAssetUrl } from "../util/assets"
import { loadTexture } from "./models"

export async function setupWorld() {
  const geometry = new PlaneGeometry(100, 100)
  const texture = await loadTexture(getAssetUrl("floor.png"))
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping

  texture.center.set(0.5, 0.5)
  texture.repeat.set(50, 50)
  const material = new MeshLambertMaterial({
    map: texture,
  })
  const baseFloorPlane = new Mesh(geometry, material)
  baseFloorPlane.translateX(50)
  baseFloorPlane.translateZ(50)
  baseFloorPlane.rotateX(-Math.PI / 2)
  baseFloorPlane.receiveShadow = true
  getScene().add(baseFloorPlane)
}
