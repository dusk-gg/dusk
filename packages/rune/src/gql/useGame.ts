import { gql, useQuery } from "@apollo/client/index.js"

import { GameDocument } from "../generated/types.js"

export function useGame(id: number | null | undefined) {
  const { data, ...rest } = useQuery(GameDocument, {
    skip: !id,
    ...(id && { variables: { id } }),
  })

  return {
    game: data?.gameById,
    gameLoading: rest.loading,
  }
}

gql`
  query Game($id: Int!) {
    gameById(id: $id) {
      id
      title
      description
      createdAt
      gameDevs {
        nodes {
          userId
          displayName
          type
        }
      }
      gameVersions(orderBy: [PRIMARY_KEY_DESC]) {
        nodes {
          gameId
          gameVersionId
          status
        }
      }
    }
  }
`
