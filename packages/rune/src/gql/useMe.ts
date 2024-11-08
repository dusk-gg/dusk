import { useQuery, gql } from "@apollo/client/index.js"

import { MeDocument } from "../generated/types.js"

export function useMe({ skip }: { skip?: boolean } = {}) {
  const { data, loading, error } = useQuery(MeDocument, { skip })

  return {
    me: data?.me,
    meLoading: loading,
    meError: error,
  }
}

gql`
  query Me {
    me {
      devId
      displayName
      email
      admin
    }
  }
`
