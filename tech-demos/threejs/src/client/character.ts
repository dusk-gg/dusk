import {
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

type Anims = "walk" | "idle" | "static" | "jump" | "fall"

export type Character3D = {
  id: string
  type: number
  model: Object3D
  namePlate: Object3D
  mixer: AnimationMixer
  targetPosition: Vec3
  targetAngle: number
  lastMovementSpeed: number
  anim: Anims
  lastVelocityY: number
  velocityY: number
}

const clientSideCharacters: Record<string, Character3D> = {}

export function updateCharacterPerFrame(delta: number) {
  Object.values(clientSideCharacters).forEach((c) => {
    if (c.velocityY > 0) {
      playAnimation(c, "jump")
    } else if (c.velocityY < 0) {
      playAnimation(c, "fall")
    } else if (c.lastMovementSpeed !== 0) {
      playAnimation(c, "walk")
    } else {
      playAnimation(c, "idle")
    }
    c.mixer.update(delta)

    // interpolate the angle and position of the local
    // model to the logic state
    c.model.rotation.y = lerpAngle(
      delta,
      c.model.rotation.y,
      c.targetAngle,
      TURN_SPEED
    )

    const dir = getDirection(c.model.rotation.y)
    c.model.position.x = lerp(
      delta * Math.abs(dir.x),
      c.model.position.x,
      c.targetPosition.x,
      c.lastMovementSpeed
    )
    c.model.position.z = lerp(
      delta * Math.abs(dir.z),
      c.model.position.z,
      c.targetPosition.z,
      c.lastMovementSpeed
    )
    c.model.position.y = lerp(
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

function playAnimation(character: Character3D, name: Anims) {
  if (character.anim !== name) {
    character.anim = name
    character.mixer.stopAllAction()

    const model = getCharacterModel(character.type)
    const action = character.mixer.clipAction(
      model.animations.find((a) => a.name === name)!,
      character.model
    )
    action.play()
  }
}

export function createCharacter3D(data: Character): Character3D {
  const parent = new Object3D()
  const model = getCharacterModel(data.type)
  const modelInstance = SkeletonUtils.clone(model.scene)
  parent.add(modelInstance)

  const character: Character3D = {
    id: data.id,
    type: data.type,
    model: parent,
    mixer: new AnimationMixer(modelInstance),
    targetPosition: data.position,
    targetAngle: data.angle,
    lastMovementSpeed: 0,
    lastVelocityY: 0,
    velocityY: 0,
    anim: "static",
    namePlate: createText(data.id),
  }
  parent.position.set(data.position.x, data.position.y, data.position.z)
  parent.rotation.y = data.angle

  playAnimation(character, "idle")
  clientSideCharacters[data.id] = character

  getScene().add(parent)
  getScene().add(character.namePlate)
  return character
}

export function removeCharacter3D(id: string): void {
  const character = clientSideCharacters[id]
  if (character) {
    character.model.removeFromParent()
    character.namePlate.removeFromParent()
    delete clientSideCharacters[id]
  }
}

export function getCurrentCharacterIds(): string[] {
  return Object.values(clientSideCharacters).map((c) => c.id)
}

export function getCharacter3D(id: string): Character3D | undefined {
  return clientSideCharacters[id]
}

export function updateCharacter3DFromLogic(data: Character): void {
  const char = getCharacter3D(data.id)
  if (char) {
    char.targetAngle = data.angle
    char.targetPosition = data.position
    char.lastMovementSpeed = data.lastMovementSpeed
    char.velocityY = data.velocityY
  }
}

function lerpAngle(
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

function lerp(delta: number, current: number, target: number, speed: number) {
  if (current > target) {
    current = Math.max(target, current - speed * delta)
  }
  if (current < target) {
    current = Math.min(target, current + speed * delta)
  }

  return current
}

function getDirection(angle: number): Vec3 {
  return { x: -Math.sin(angle), y: 0, z: Math.cos(angle) }
}

function createText(playerId: string): Mesh {
  // create a base plane to hide any gaps in the floor
  const geometry = new PlaneGeometry(1, 1)

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

  const material = new MeshBasicMaterial({
    map: new CanvasTexture(canvas),
    transparent: true,
  })
  const textPlane = new Mesh(geometry, material)
  textPlane.position.y = 0.8

  return textPlane
}
