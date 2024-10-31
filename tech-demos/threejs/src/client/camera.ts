import { Euler, PerspectiveCamera, Vector3 } from "three"
import { Character3D } from "./character"

let lookAt: Vector3
let targetAngleY: number = 0
let targetAngleZ: number = Math.PI

const camera: PerspectiveCamera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  150
)

export function setupCamera() {
  camera.position.set(0, 1, 5)
  camera.lookAt(0, 1, 0)
}

export function updateCamera(targetCharacter: Character3D) {
  // the offset from the ground the camera maintains
  const cameraHeight = 2
  // The distance from the target (look at)
  const cameraDistance = 4
  // The speed that the camera lerps at
  const cameraSoftness = 0.2
  const cameraTargetHeight = 1

  const { x, y, z } = targetCharacter.model.position

  const targetPosition = new Vector3(cameraDistance, 0, 0)
  targetPosition.applyEuler(new Euler(0, -targetAngleY, -targetAngleZ))
  targetPosition.add(new Vector3(x, y + cameraHeight, z))
  interpolate(camera.position, targetPosition, cameraSoftness)

  if (lookAt) {
    // softly move the direction we're looking at
    interpolate(
      lookAt,
      new Vector3(x, y + cameraTargetHeight, z),
      cameraSoftness
    )
  } else {
    lookAt = new Vector3(x, y + cameraTargetHeight, z)
  }

  camera.lookAt(lookAt)
}
export function getCamera() {
  return camera
}

export function rotateCameraZ(delta: number): void {
  targetAngleZ += delta
  targetAngleZ = Math.min(Math.max(targetAngleZ, 2.8), 6.7)
  if (targetAngleZ > 4 && targetAngleZ < 4.5) {
    targetAngleZ = 4
  }
  if (targetAngleZ > 5.2 && targetAngleZ < 5.5) {
    targetAngleZ = 5.5
  }
}

export function rotateCameraY(delta: number): void {
  targetAngleY += delta
}

export function getCameraAngle(): number {
  const dir = new Vector3()
  camera.getWorldDirection(dir)
  const angle = Math.atan2(-dir.x, dir.z)
  return angle
}

function interpolate(current: Vector3, to: Vector3, amount: number): void {
  current.x = interpolateValue(current.x, to.x, amount)
  current.y = interpolateValue(current.y, to.y, amount)
  current.z = interpolateValue(current.z, to.z, amount)

  current.lerp(to, amount)
}

function interpolateValue(
  current: number,
  target: number,
  speed: number
): number {
  const delta = 0.1
  if (current > target) {
    current = Math.max(target, current - speed * delta)
  }
  if (current < target) {
    current = Math.min(target, current + speed * delta)
  }
  if (Math.abs(current - target) < 0.001) {
    current = target
  }

  return current
}