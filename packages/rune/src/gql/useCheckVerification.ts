import { useMutation, gql } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  CheckVerificationDocument,
  CheckVerificationMutationVariables,
} from "../generated/types.js"

export function useCheckVerification() {
  const [mutate, result] = useMutation(CheckVerificationDocument)

  return {
    checkVerification: useCallback(
      (variables: CheckVerificationMutationVariables) => {
        mutate({ variables }).catch(() => {})
      },
      [mutate]
    ),
    checkVerificationLoading: result.loading,
    checkVerificationError: result.error,
    authToken: result.data?.checkVerification.authToken,
  }
}

gql`
  mutation CheckVerification($verificationToken: String!) {
    checkVerification(input: { verificationToken: $verificationToken }) {
      authToken
    }
  }
`
