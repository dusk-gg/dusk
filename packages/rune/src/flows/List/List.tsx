import { Text, Box } from "ink"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { Select } from "../../components/Select.js"
import { Step } from "../../components/Step.js"
import { useGames } from "../../gql/useGames.js"
import { useMe } from "../../gql/useMe.js"
import { gameItemLabel } from "../../lib/gameItemLabel.js"
import { getMyGames } from "../../lib/getMyGames.js"

import { Details } from "./Details.js"

export function List() {
  const { me } = useMe()
  const { games, gamesLoading } = useGames({ skip: !me })
  const [gameId, setGameId] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = useCallback(() => setSubmitted(true), [])

  const items = useMemo(() => {
    const { myGames, otherGames } = getMyGames({ games, devId: me?.devId })

    return [
      ...(myGames ?? []).map((game) => ({
        label: gameItemLabel({ game, showGameDevs: false }),
        value: game.id,
      })),
      ...(me?.admin
        ? (otherGames ?? []).map((game) => ({
            label: gameItemLabel({ game, showGameDevs: true }),
            value: game.id,
          }))
        : []),
    ]
  }, [games, me])

  const game = useMemo(
    () => games?.find((g) => g.id === gameId),
    [games, gameId]
  )

  useEffect(() => {
    if (items.length && !gameId) setGameId(items[0]!.value)
  }, [gameId, items])

  if (!me) return <></>

  if (submitted && game) {
    return <Details game={game} me={me} />
  }

  return (
    <Box flexDirection="column">
      {gamesLoading ? (
        <Step status="waiting" label="Loading games" />
      ) : items.length > 0 ? (
        <Select
          items={items}
          value={gameId}
          onChange={setGameId}
          onSubmit={onSubmit}
        />
      ) : (
        <Text dimColor>You have not uploaded any games yet</Text>
      )}
    </Box>
  )
}
