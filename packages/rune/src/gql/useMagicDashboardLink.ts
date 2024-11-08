import { gql, useMutation } from "@apollo/client/index.js"
import { useCallback } from "react"

import {
  DashboardMagicLinkInput,
  CreateDashboardMagicLinkDocument,
} from "../generated/types.js"

export function useDashboardMagicLink() {
  const [mutate, result] = useMutation(CreateDashboardMagicLinkDocument)

  return {
    createDashboardMagicLink: useCallback(
      (input: DashboardMagicLinkInput) => {
        mutate({ variables: { input } }).catch(() => {})
      },
      [mutate]
    ),
    loading: result.loading,
    error: result.error,
    dashboardMagicLink:
      result.data?.createDashboardMagicLink.dashboardMagicLink,
  }
}

gql`
  mutation createDashboardMagicLink($input: DashboardMagicLinkInput!) {
    createDashboardMagicLink(input: $input) {
      clientMutationId
      dashboardMagicLink
    }
  }
`
