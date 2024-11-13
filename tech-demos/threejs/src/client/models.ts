/**
 * Loading models in Three JS. We use MeshLambertMaterial for performance
 * on mobile devices.
 */
import {
  Mesh,
  MeshLambertMaterial,
  Object3D,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js"
import { getAssetUrl } from "../util/assets"

// loader for GLTF models (thanks threejs!)
const gltfLoader = new GLTFLoader()
// texture loader from threejs
const textureLoader = new TextureLoader()

// The collection of character models we've loaded
const characterModels: GLTF[] = []

/**
 * Load a GLTF model from the given URL
 */
function loadGLTF(url: string): Promise<GLTF> {
  console.log("Loading: ", url)

  return new Promise<GLTF>((resolve, reject) => {
    gltfLoader.load(
      url,
      (model) => {
        // make every model loaded a shadow caster and receiver
        model.scene.traverse((child) => {
          child.castShadow = true
          child.receiveShadow = true
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

/**
 * Load a texture from a URL into a Three JS texture
 *
 * @param url The URL to load from
 * @returns The newly created texture object
 */
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

/**
 * Apply a texture to a model. The ThreeJS loaders make assumptions where
 * referenced textures are so we need to manually apply them
 *
 * @param obj The object to be textured
 * @param texture The texture to apply
 */
export function applyTexture(obj: Object3D, texture: Texture) {
  obj.traverse((node) => {
    if (node instanceof Mesh) {
      node.material = new MeshLambertMaterial({ map: texture })
    }
  })
}

/**
 * Retrieve one of the loaded models with a specific id/type
 *
 * @param id The ID of the model to retrieve
 * @returns The model that was loaded
 */
export function getCharacterModel(id: number) {
  return characterModels[id]
}

/**
 * Initialize the character models. They have been provided by the wonderful KenneyNL
 *
 * https://kenney.nl/assets/mini-characters-1
 */
export async function setupModels() {
  const promises = []

  // load the texture independently as ThreeJS isn't able to find it
  // as a referenced texture
  const texture = await loadTexture(getAssetUrl("models/Textures/colormap.png"))
  for (let i = 0; i < 6; i++) {
    // the models are nicely organized so just look through (thanks Kenney!)
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
