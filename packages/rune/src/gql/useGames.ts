import { useQuery, gql } from "@apollo/client/index.js"

import { GamesDocument } from "../generated/types.js"

export function useGames({
  skip,
}: {
  skip?: boolean
} = {}) {
  const { data, ...rest } = useQuery(GamesDocument, {
    skip,
  })

  return {
    games: data?.games?.nodes,
    gamesLoading: rest.loading,
  }
}

gql`
  query Games {
    games {
      nodes {
        id
        title
        description
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
  }
`
