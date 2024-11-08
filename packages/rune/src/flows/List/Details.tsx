import { Text, Box } from "ink"
import React, { useMemo } from "react"

import { GamesQuery, Me } from "../../generated/types.js"
import { gameDevItemLabel } from "../../lib/gameDevItemLabel.js"

export function Details({
  game,
  me,
}: {
  game: NonNullable<GamesQuery["games"]>["nodes"][0]
  me: Me
}) {
  const { gameDevs, gameDevMe } = useMemo(() => {
    const gameDevs = game?.gameDevs.nodes
    const gameDevMe = gameDevs?.find((gameDev) => gameDev.userId === me?.devId)

    return { gameDevs, gameDevMe }
  }, [game, me?.devId])

  const { draftVersion, inReviewVersion, activeVersion } = useMemo(() => {
    // gameVersions are already ordered by most recent first
    // Hence .find will take the most recent per status
    return {
      draftVersion: game.gameVersions.nodes.find((n) => n.status === "DRAFT"),
      inReviewVersion: game.gameVersions.nodes.find(
        (n) => n.status === "IN_REVIEW"
      ),
      activeVersion: game.gameVersions.nodes.find((n) => n.status === "ACTIVE"),
    }
  }, [game.gameVersions.nodes])

  if (!game) return <></>

  return (
    <Box flexDirection="column">
      <Box flexDirection="column" borderStyle="single">
        <Text bold>{game.title}</Text>
      </Box>
      <Box flexDirection="column">
        <DetailsRow name="Description" value={game.description} />
        <DetailsRow
          name="Team"
          value={gameDevs
            ?.map((gameDev) => gameDevItemLabel({ gameDev }))
            .join(", ")}
        />
        <DetailsRow
          name="Your role"
          value={gameDevMe ? gameDevMe.type : "PLAYER"}
        />
        {draftVersion &&
          draftVersion.gameVersionId > (activeVersion?.gameVersionId ?? 0) && (
            <DetailsRow
              name="Draft version"
              value={draftVersion.gameVersionId.toString()}
            />
          )}
        {inReviewVersion &&
          inReviewVersion.gameVersionId >
            (activeVersion?.gameVersionId ?? 0) && (
            <DetailsRow
              name="Review version"
              value={inReviewVersion.gameVersionId.toString()}
            />
          )}
        <DetailsRow
          name="Active version"
          value={activeVersion ? activeVersion.gameVersionId.toString() : "-"}
        />
      </Box>
    </Box>
  )
}

const DetailsRow = ({
  name,
  value,
}: {
  name: string
  value: string | null
}) => (
  <Box flexDirection="row">
    <Text bold>{name}: </Text>
    <Text>{value}</Text>
  </Box>
)
