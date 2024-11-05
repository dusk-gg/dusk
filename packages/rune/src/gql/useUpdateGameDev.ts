import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  UpdateGameDevDocument,
  UpdateGameDevInput,
} from "../generated/types.js"

export function useUpdateGameDev() {
  const [mutate, result] = useMutation(UpdateGameDevDocument)

  return {
    updateGameDev: useCallback(
      (input: UpdateGameDevInput) => {
        mutate({ variables: { input } }).catch(() => {})
      },
      [mutate]
    ),
    updateGameDevLoading: result.loading,
    updateGameDevError: result.error,
    isGameDevUpdated: result.data?.updateGameDev.clientMutationId !== undefined,
  }
}

gql`
  mutation UpdateGameDev($input: UpdateGameDevInput!) {
    updateGameDev(input: $input) {
      clientMutationId
    }
  }
`
