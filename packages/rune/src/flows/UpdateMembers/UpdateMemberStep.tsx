import React, { useEffect } from "react"

import { Step } from "../../components/Step.js"
import { GameDevType } from "../../generated/types.js"
import { useUpdateGameDev } from "../../gql/useUpdateGameDev.js"
import { formatApolloError } from "../../lib/formatApolloError.js"

export function UpdateMemberStep({
  gameId,
  memberId,
  memberType,
}: {
  gameId: number
  memberId: number
  memberType: GameDevType | null
}) {
  const { updateGameDev, updateGameDevLoading, updateGameDevError } =
    useUpdateGameDev()

  useEffect(() => {
    updateGameDev({
      gameId,
      userId: memberId,
      type: memberType,
    })
  }, [gameId, memberId, memberType, updateGameDev])

  return (
    <Step
      status={
        updateGameDevLoading
          ? "waiting"
          : updateGameDevError
            ? "error"
            : "success"
      }
      label={
        updateGameDevLoading
          ? "Updating the member"
          : updateGameDevError
            ? formatApolloError(updateGameDevError, {
                "[tango][GAME_DEV_NO_ACTIVE_ADMIN]":
                  "Failed to update because there would be no active admin for this game",
              })
            : memberType === null
              ? "Member removed"
              : "Member updated"
      }
    />
  )
}
