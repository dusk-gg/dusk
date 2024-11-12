import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import { UpdateGameDocument, UpdateGameInput } from "../generated/types.js"

export function useUpdateGame() {
  const [mutate, result] = useMutation(UpdateGameDocument)

  return {
    updateGame: useCallback(
      (input: UpdateGameInput) => {
        mutate({ variables: { input }, refetchQueries: ["Games"] }).catch(
          () => {}
        )
      },
      [mutate]
    ),
    updateGameLoading: result.loading,
    updateGameError: result.error,
    updatedGame: result.data?.updateGame.game,
  }
}

gql`
  mutation UpdateGame($input: UpdateGameInput!) {
    updateGame(input: $input) {
      game {
        id
        title
      }
    }
  }
`
