import { useMutation, gql } from "@apollo/client/index.js"
import { useCallback } from "react"

import { CreateGameDocument, CreateGameInput } from "../generated/types.js"

export function useCreateGame() {
  const [mutate, result] = useMutation(CreateGameDocument)

  return {
    createGame: useCallback(
      (game: CreateGameInput) => {
        mutate({ variables: { game }, refetchQueries: ["Games"] }).catch(
          () => {}
        )
      },
      [mutate]
    ),
    createGameLoading: result.loading,
    createGameError: result.error,
    createdGameId: result.data?.createGame.game.id,
  }
}

gql`
  mutation CreateGame($game: CreateGameInput!) {
    createGame(input: $game) {
      game {
        id
      }
    }
  }
`
