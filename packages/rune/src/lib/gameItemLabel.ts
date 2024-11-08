import { GamesQuery } from "../generated/types.js"

export function gameItemLabel({
  game,
  showGameDevs,
}: {
  game: NonNullable<GamesQuery["games"]>["nodes"][0]
  showGameDevs: boolean
}) {
  const gameDevs = game.gameDevs.nodes
  const gameDevAdmin = gameDevs.find((gameDev) => gameDev.type === "ADMIN") // only first admin
  const latestVersionStatus = game.gameVersions.nodes[0]?.status ?? "NONE"

  // Prepare label parts
  const gameDevsLabel =
    gameDevs.length === 0
      ? "UNKNOWN"
      : gameDevs.length === 1
        ? gameDevAdmin?.displayName
        : `${gameDevAdmin?.displayName} + ${gameDevs.length - 1} others`

  const gameTitle = game.title
  const tag = showGameDevs ? ` [by ${gameDevsLabel}]` : ""

  return `${gameTitle}${tag} (latestVersion: ${latestVersionStatus})`
}
