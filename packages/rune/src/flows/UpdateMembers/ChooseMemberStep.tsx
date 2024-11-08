import React, { useState, useMemo, useCallback, useEffect } from "react"

import { Select } from "../../components/Select.js"
import { Step } from "../../components/Step.js"
import { useGame } from "../../gql/useGame.js"
import { useMe } from "../../gql/useMe.js"
import { gameDevItemLabel } from "../../lib/gameDevItemLabel.js"

export function ChooseMemberStep({
  gameId,
  currentMemberId,
  onComplete,
}: {
  gameId: number
  currentMemberId: number | null | undefined
  onComplete: (memberId: number | null) => void
}) {
  const { me, meLoading } = useMe()
  const { game, gameLoading } = useGame(gameId)
  const [memberId, setMemberId] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const { gameDevs, gameDevMe, items } = useMemo(() => {
    const gameDevs = game?.gameDevs.nodes
    const gameDevMe = gameDevs?.find((gameDev) => gameDev.userId === me?.devId)
    const items = [
      { label: "New member", value: null },
      ...(gameDevs ?? [])
        .filter((gameDev) => gameDev.userId !== gameDevMe?.userId)
        .map((gameDev) => ({
          label: gameDevItemLabel({ gameDev }),
          value: gameDev.userId,
        })),
    ]

    return { gameDevs, gameDevMe, items }
  }, [game, me?.devId])

  useEffect(() => {
    if (currentMemberId) setMemberId(currentMemberId)
  }, [currentMemberId])

  const onSubmit = useCallback(() => {
    setSubmitted(true)
    onComplete(memberId)
  }, [memberId, onComplete])

  const chosenMemberLabel = useMemo(() => {
    if (memberId === null) return "New member"

    return (
      gameDevs?.find((gameDev) => gameDev.userId === memberId)?.displayName ??
      "..."
    )
  }, [memberId, gameDevs])

  if (!gameLoading && !meLoading && gameDevMe?.type !== "ADMIN" && !me?.admin) {
    return <Step status="error" label="You are not admin of this game" />
  }

  return (
    <Step
      status={gameLoading ? "waiting" : submitted ? "success" : "userInput"}
      label={
        gameLoading
          ? "Loading a list of members"
          : submitted
            ? chosenMemberLabel
            : "Select a member"
      }
      view={
        !gameLoading &&
        !submitted && (
          <Select
            items={items}
            value={memberId}
            onChange={setMemberId}
            onSubmit={onSubmit}
          />
        )
      }
    />
  )
}
