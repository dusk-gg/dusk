import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  UpdateGameSdkDocument,
  UpdateGameSdkInput,
} from "../generated/types.js"

export function useUpdateGameSdk() {
  const [mutate] = useMutation(UpdateGameSdkDocument)

  return {
    updateGameSdk: useCallback(
      (input: UpdateGameSdkInput) =>
        mutate({ variables: { input } }).then(
          (result) => result.data?.updateGameSdk
        ),
      [mutate]
    ),
  }
}

gql`
  mutation UpdateGameSdk($input: UpdateGameSdkInput!) {
    updateGameSdk(input: $input) {
      success
      error
    }
  }
`
