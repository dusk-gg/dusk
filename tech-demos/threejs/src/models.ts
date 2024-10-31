import {
  Mesh,
  MeshLambertMaterial,
  Object3D,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js"
import { getAssetUrl } from "./assets"

// loader for GLTF models (thanks threejs!)
const gltfLoader = new GLTFLoader()
// texture loader from threejs
const textureLoader = new TextureLoader()

const characterModels: GLTF[] = []

function loadGLTF(
  url: string,
  cast: boolean = true,
  receive: boolean = true
): Promise<GLTF> {
  console.log("Loading: ", url)

  return new Promise<GLTF>((resolve, reject) => {
    gltfLoader.load(
      url,
      (model) => {
        model.scene.traverse((child) => {
          child.castShadow = cast
          child.receiveShadow = receive
        })
        resolve(model)
      },
      undefined,
      (e) => {
        reject(e)
      }
    )
  })
}

export function loadTexture(url: string): Promise<Texture> {
  return new Promise<Texture>((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        texture.colorSpace = SRGBColorSpace
        resolve(texture)
      },
      undefined,
      (e) => {
        reject(e)
      }
    )
  })
}

export function applyTexture(obj: Object3D, texture: Texture) {
  obj.traverse((node) => {
    if (node instanceof Mesh) {
      node.material = new MeshLambertMaterial({ map: texture })
    }
  })
}
export function getCharacterModel(id: number) {
  return characterModels[id]
}

export async function setupModels() {
  const promises = []

  const texture = await loadTexture(getAssetUrl("models/Textures/colormap.png"))
  for (let i = 0; i < 6; i++) {
    const code = String.fromCharCode("a".charCodeAt(0) + i)
    const female = loadGLTF(
      getAssetUrl("models/character-female-" + code + ".glb")
    )
    promises.push(female)
    female.then((model) => {
      applyTexture(model.scene, texture)
      characterModels[i] = model
    })
    const male = loadGLTF(getAssetUrl("models/character-male-" + code + ".glb"))
    promises.push(male)
    male.then((model) => {
      applyTexture(model.scene, texture)
      characterModels[i + 6] = model
    })
  }

  await Promise.all(promises)
}
