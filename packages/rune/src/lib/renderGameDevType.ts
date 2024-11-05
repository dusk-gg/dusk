import { GameDevType } from "../generated/types"

export function renderGameDevType(type: GameDevType) {
  return (
    {
      ADMIN: "Admin",
      DEV: "Developer",
      TESTER: "Playtester",
    }[type] ?? type
  )
}
