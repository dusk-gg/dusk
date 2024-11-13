/**
 * The character itself including movement, models and lerping
 * positions and rotations.
 */
import {
  AnimationAction,
  AnimationMixer,
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
} from "three"
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js"
import { getCharacterModel } from "./models"
import { getScene } from "./renderer"
import { Vec3, Character } from "../shared/types"
import { LOGIC_FPS, TURN_SPEED } from "../shared/constants"
import { getCamera } from "./camera"

// The list of animations the models support
type Anims = "walk" | "idle" | "static" | "jump" | "fall"

/**
 * Data for the character running around in the world, i.e.
 * the 3D representation of our game logic
 */
export type Character3D = {
  // The ID given by the logic for this character - the player ID
  id: string
  // The skin to apply from the list models we have
  type: number
  // The character model in the scene
  model: Object3D
  // The floating name model seperated so we can rotate it to face the camera at all times
  namePlate: Object3D
  // The ThreeJS animation mixer thats responsible for updating the skeletal meshes
  mixer: AnimationMixer
  // The position this model should be moving towards based on the logic update
  targetPosition: Vec3
  // The angle this model should be moving towards based on the logic update
  targetAngle: number
  // The last speed this model was moving on the X/Z plane. Keep a record
  // so we can complete interpolations after the logic has finished its move
  lastMovementSpeed: number
  // The animation currently playing for this model
  anim: Anims
  // The actual ThreeJS animation action being run if any
  animAction?: AnimationAction
  // The velocity this model is moving at on the Y axis (falling and jumping)
  velocityY: number
}

// The collection of 3D characters we have in the world
const clientSideCharacters: Record<string, Character3D> = {}

/**
 * Update the character's in the world on each frame change
 *
 * @param delta The amount of time in seconds thats passed since last update
 */
export function updateCharacterPerFrame(delta: number) {
  // cycle through each of the character
  Object.values(clientSideCharacters).forEach((c) => {
    // if we're going up - then show the jump animation
    if (c.velocityY > 0) {
      playAnimation(c, "jump")
    } else if (c.velocityY < 0) {
      // if we're going down then show the falling animation
      playAnimation(c, "fall")
    } else if (c.lastMovementSpeed !== 0) {
      // if we're moving then show walking
      playAnimation(c, "walk")
    } else {
      // if nothing else then show idle animation
      playAnimation(c, "idle")
    }

    // update the animation on the model
    c.mixer.update(delta)

    // interpolate the angle of the local
    // model to the logic state
    c.model.rotation.y = interpolateAngle(
      delta,
      c.model.rotation.y,
      c.targetAngle,
      TURN_SPEED
    )

    // interpolate the position of the local
    // model to the logic state - we'll do the
    // the axis independently since they may be moving
    // at different speeds
    const dir = getDirectionVectorForAngleY(c.model.rotation.y)
    c.model.position.x = interpolate(
      delta * Math.abs(dir.x),
      c.model.position.x,
      c.targetPosition.x,
      c.lastMovementSpeed
    )
    c.model.position.z = interpolate(
      delta * Math.abs(dir.z),
      c.model.position.z,
      c.targetPosition.z,
      c.lastMovementSpeed
    )
    c.model.position.y = interpolate(
      delta,
      c.model.position.y,
      c.targetPosition.y,
      // we want to make sure even if the velocity has changed then
      // we complete the left
      Math.max(c.velocityY > 0 ? 0 : 3, Math.abs(c.velocityY) * LOGIC_FPS)
    )

    // finally move the name plate to face the camera and be at the player position
    c.namePlate.position.x = c.model.position.x
    c.namePlate.position.y = c.model.position.y + 0.8
    c.namePlate.position.z = c.model.position.z
    c.namePlate.quaternion.copy(getCamera().quaternion)
  })
}

/**
 * Apply an animation to a particular character assuming they're
 * not already running it
 *
 * @param character The character to apply the animation to
 * @param name The name of the animation to be applied
 */
function playAnimation(character: Character3D, name: Anims) {
  // if we're not already running the action
  if (character.anim !== name) {
    character.anim = name

    const model = getCharacterModel(character.type)
    const action = character.mixer.clipAction(
      model.animations.find((a) => a.name === name)!,
      character.model
    )

    // smoothly mix animation
    if (!character.animAction) {
      action.play()
    } else {
      character.animAction.fadeOut(0.25).play()
      action.reset().fadeIn(0.25).play()
    }

    character.animAction = action
  }
}

/**
 * Create a character in the world based on the logic state
 *
 * @param data The logic state of the character
 * @returns The newly created 3D character
 */
export function createCharacter3D(data: Character): Character3D {
  // create a scene graph node and clone the loaded model
  // for the specific type
  const parent = new Object3D()
  const model = getCharacterModel(data.type)
  const modelInstance = SkeletonUtils.clone(model.scene)
  parent.add(modelInstance)

  // initialize our client side character record
  // with empty data
  const character: Character3D = {
    id: data.id,
    type: data.type,
    model: parent,
    mixer: new AnimationMixer(modelInstance),
    targetPosition: data.position,
    targetAngle: data.angle,
    lastMovementSpeed: 0,
    velocityY: 0,
    anim: "static",
    // we create a seperate model for the text above the player's
    // head so it can be rotate to face the camera
    namePlate: createText(data.id),
  }
  // setup the character to be in the logic that the logic provided us
  parent.position.set(data.position.x, data.position.y, data.position.z)
  parent.rotation.y = data.angle

  // setup the default animation and add the character to the world
  playAnimation(character, "idle")
  clientSideCharacters[data.id] = character

  getScene().add(parent)
  getScene().add(character.namePlate)

  return character
}

/**
 * Remove a 3D character from the scene
 *
 * @param id The ID of the character to remove (player ID)
 */
export function removeCharacter3D(id: string): void {
  const character = clientSideCharacters[id]
  if (character) {
    // remove the model and its name plate from the scene
    character.model.removeFromParent()
    character.namePlate.removeFromParent()
    delete clientSideCharacters[id]
  }
}

/**
 * Get a list of all the character IDs in the world. Used to check
 * if the logic state is different from our client state
 *
 * @returns The list of character IDs in the world
 */
export function getCurrentCharacterIds(): string[] {
  return Object.values(clientSideCharacters).map((c) => c.id)
}

/**
 * Get a specific character record on the client side from it's ID
 *
 * @param id The ID of the character to retrieve
 * @returns The character or undefined if no character with that ID exists
 */
export function getCharacter3D(id: string): Character3D | undefined {
  return clientSideCharacters[id]
}

/**
 * Update the local character's target state based on the logic's state
 *
 * @param data The state from the logic side
 */
export function updateCharacter3DFromLogic(data: Character): void {
  const char = getCharacter3D(data.id)
  if (char) {
    char.targetAngle = data.angle
    char.targetPosition = data.position
    char.lastMovementSpeed = data.lastMovementSpeed
    char.velocityY = data.velocityY
  }
}

/**
 * A specific interpolation for angles that copes with looping of angles
 *
 * @param delta The amount of time passed since last update
 * @param current The current angle
 * @param target The target angle
 * @param speed The rate at which to change the angle
 * @returns The newly interpolated value
 */
function interpolateAngle(
  delta: number,
  current: number,
  target: number,
  speed: number
) {
  const change = target - current
  if (Math.abs(change) > Math.PI) {
    current = current + Math.sign(change) * (Math.PI * 2)
  }
  if (current > target) {
    current = Math.max(target, current - speed * delta)
  }
  if (current < target) {
    current = Math.min(target, current + speed * delta)
  }

  return current
}

/**
 * A simple interpolation of a single value based on time and speed
 *
 * @param delta The amount of time thats passed
 * @param current The current value
 * @param target The target value
 * @param speed The speed at which the change should be applied
 * @returns The newly interpolated value
 */
function interpolate(
  delta: number,
  current: number,
  target: number,
  speed: number
) {
  if (current > target) {
    current = Math.max(target, current - speed * delta)
  }
  if (current < target) {
    current = Math.min(target, current + speed * delta)
  }

  return current
}

/**
 * Get the direction vector from an angle
 *
 * @param angle The angle on the Y axis to convert to a vector
 * @returns The vector for the direction at the given Y axis angle
 */
function getDirectionVectorForAngleY(angle: number): Vec3 {
  return { x: -Math.sin(angle), y: 0, z: Math.cos(angle) }
}

/**
 * Create a mesh and texture for a name floating above the
 * player's head
 *
 * @param playerId The ID of the player we're creating the name tag for
 * @returns The newly created name plate mesh
 */
function createText(playerId: string): Mesh {
  // create a base plane to hide any gaps in the floor
  const geometry = new PlaneGeometry(1, 1)

  // draw the text onto a canvas so we can use it as a texture
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")
  if (ctx) {
    const size = 32
    ctx.scale(1, 1)
    ctx.font = size + "px Helvetica"
    ctx.textAlign = "center"
    ctx.fillStyle = "black"
    ctx.fillText(
      Rune.getPlayerInfo(playerId).displayName,
      canvas.width / 2 + 3,
      size * 2 + 3
    )
    ctx.fillStyle = "white"
    ctx.fillText(
      Rune.getPlayerInfo(playerId).displayName,
      canvas.width / 2,
      size * 2
    )
  }

  // create the new mesh with the canvas
  const material = new MeshBasicMaterial({
    map: new CanvasTexture(canvas),
    transparent: true,
  })
  const textPlane = new Mesh(geometry, material)
  textPlane.position.y = 0.8

  return textPlane
}
