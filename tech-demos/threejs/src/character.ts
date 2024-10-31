import { AnimationMixer, Object3D } from "three"
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js"
import { getCharacterModel } from "./models"
import { getScene } from "./renderer"
import { Character, Vec3 } from "./logic"

type Anims = "walk" | "idle" | "static" | "jump"

export type Character3D = {
  id: string
  type: number
  model: Object3D
  mixer: AnimationMixer
  targetPosition: Vec3
  targetAngle: number
  speed: number
  anim: Anims
}

const clientSideCharacters: Record<string, Character3D> = {}

export function updateCharacterPerFrame(delta: number) {
  Object.values(clientSideCharacters).forEach((c) => {
    if (c.speed !== 0) {
      playAnimation(c, "walk")
    } else {
      playAnimation(c, "idle")
    }
    c.mixer.update(delta)

    // interpolate the angle and position of the local
    // model to the logic state
    c.model.rotation.y = lerpAngle(delta, c.model.rotation.y, c.targetAngle, 10)

    const dir = getDirection(c.model.rotation.y)
    c.model.position.x = lerp(
      delta * Math.abs(dir.x),
      c.model.position.x,
      c.targetPosition.x,
      c.speed
    )
    c.model.position.z = lerp(
      delta * Math.abs(dir.z),
      c.model.position.z,
      c.targetPosition.z,
      c.speed
    )
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
    speed: 0,
    anim: "static",
  }

  playAnimation(character, "idle")
  clientSideCharacters[data.id] = character

  getScene().add(parent)
  return character
}

export function removeCharacter3D(id: string): void {
  const character = clientSideCharacters[id]
  if (character) {
    character.model.removeFromParent()
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
    char.speed = data.speed
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
