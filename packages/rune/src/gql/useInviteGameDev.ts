import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  InviteGameDevDocument,
  InviteGameDevInput,
} from "../generated/types.js"

export function useInviteGameDev() {
  const [mutate, result] = useMutation(InviteGameDevDocument)

  return {
    inviteGameDev: useCallback(
      (input: InviteGameDevInput) => {
        mutate({ variables: { input } }).catch(() => {})
      },
      [mutate]
    ),
    inviteGameDevLoading: result.loading,
    inviteGameDevError: result.error,
    isGameDevInvited: result.data?.inviteGameDev.clientMutationId !== undefined,
  }
}

gql`
  mutation InviteGameDev($input: InviteGameDevInput!) {
    inviteGameDev(input: $input) {
      clientMutationId
    }
  }
`
