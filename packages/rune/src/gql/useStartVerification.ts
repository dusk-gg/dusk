import { useMutation, gql } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  StartVerificationDocument,
  StartVerificationMutationVariables,
} from "../generated/types.js"

export function useStartVerification() {
  const [mutate, result] = useMutation(StartVerificationDocument)

  return {
    startVerification: useCallback(
      (variables: StartVerificationMutationVariables) => {
        mutate({ variables }).catch(() => {})
      },
      [mutate]
    ),
    startVerificationLoading: result.loading,
    startVerificationError: result.error,
    verificationToken: result.data?.startVerification.verificationToken,
  }
}

gql`
  mutation StartVerification($email: String!) {
    startVerification(input: { email: $email }) {
      verificationToken
    }
  }
`
