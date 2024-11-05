import { useMutation, gql } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  CreateGameVersionDocument,
  CreateGameVersionMutationVariables,
} from "../generated/types.js"

export function useCreateGameVersion() {
  const [mutate, result] = useMutation(CreateGameVersionDocument)

  return {
    createGameVersion: useCallback(
      (variables: CreateGameVersionMutationVariables) => {
        mutate({ variables }).catch(() => {})
      },
      [mutate]
    ),
    createGameVersionLoading: result.loading,
    createGameVersionError: result.error,
    newGameVersionId: result.data?.createGameVersion.gameVersion.gameVersionId,
    previewLink: result.data?.createGameVersion.previewLink,
    congratulationMsg: result?.data?.createGameVersion.congratulationMsg,
  }
}

gql`
  mutation CreateGameVersion(
    $gameId: Int!
    $content: Upload!
    $isDraft: Boolean!
    $postToDiscord: Boolean!
  ) {
    createGameVersion(
      input: {
        gameId: $gameId
        content: $content
        isDraft: $isDraft
        postToDiscord: $postToDiscord
      }
    ) {
      previewLink
      congratulationMsg
      gameVersion {
        gameId
        gameVersionId
      }
    }
  }
`
