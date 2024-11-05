import { Box, Text } from "ink"
import TextInputImport from "ink-text-input"
import React, { useState, useCallback } from "react"

import { Step } from "../../components/Step.js"
import { GameDevType } from "../../generated/types.js"
import { useInviteGameDev } from "../../gql/useInviteGameDev.js"
import { formatApolloError } from "../../lib/formatApolloError.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

export function InviteMemberStep({
  gameId,
  memberType,
}: {
  gameId: number
  memberType: GameDevType
}) {
  const [userTag, setUserTag] = useState<string>("")
  const {
    inviteGameDev,
    inviteGameDevLoading,
    inviteGameDevError,
    isGameDevInvited,
  } = useInviteGameDev()

  const onSubmituserTag = useCallback(() => {
    if (!userTag) return

    inviteGameDev({
      gameId,
      userTag,
      type: memberType,
    })
  }, [gameId, userTag, memberType, inviteGameDev])

  return (
    <Step
      status={
        inviteGameDevLoading
          ? "waiting"
          : inviteGameDevError
            ? "error"
            : isGameDevInvited
              ? "success"
              : "userInput"
      }
      label={
        inviteGameDevLoading
          ? "Inviting new member"
          : inviteGameDevError
            ? formatApolloError(inviteGameDevError, {
                "[tango][INVITE_GAME_DEV_FAILED_INVALID_USER_TAG]":
                  "Rune Tag is invalid. Verify Rune Tag and try again",
                "[tango][INVITE_GAME_DEV_FAILED_NO_EMAIL]":
                  "Invitee does not have an email",
                "[tango][INVITE_GAME_DEV_FAILED_BLOCKED_EMAIL]":
                  "Invitee's email is blocked",
                "[tango][INVITE_GAME_DEV_FAILED_ALREADY_INVITED]":
                  "Member was already invited",
              })
            : isGameDevInvited
              ? "New member invited"
              : "Enter Rune Tag (it's on their profile)"
      }
      view={(status) => (
        <Box flexDirection="column">
          {(status === "userInput" || status === "error") && (
            <Box>
              <Text>Rune Tag: </Text>
              <TextInput
                value={userTag}
                onChange={setUserTag}
                onSubmit={onSubmituserTag}
              />
            </Box>
          )}
        </Box>
      )}
    />
  )
}
