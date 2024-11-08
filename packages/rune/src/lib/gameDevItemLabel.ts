import { GameQuery } from "../generated/types.js"

import { renderGameDevType } from "./renderGameDevType.js"

export function gameDevItemLabel({
  gameDev,
}: {
  gameDev: NonNullable<GameQuery["gameById"]>["gameDevs"]["nodes"][0]
}) {
  return `${gameDev.displayName} (role: ${renderGameDevType(gameDev.type)})`
}
