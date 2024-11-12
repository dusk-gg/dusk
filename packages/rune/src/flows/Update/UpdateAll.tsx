import { ApolloError } from "@apollo/client/errors/index.js"
import { Box, Text } from "ink"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { Step } from "../../components/Step.js"
import { useGames } from "../../gql/useGames.js"
import { useUpdateGameSdk } from "../../gql/useUpdateGameSdk.js"
import { formatApolloError } from "../../lib/formatApolloError.js"

export function UpdateAll({ args }: { args: string[] }) {
  const filteredGameIds = useMemo(() => args.slice(1), [args])

  const { updateGameSdk } = useUpdateGameSdk()

  const { games, gamesLoading } = useGames()

  const gamesWithLatestActiveDraftOrInReviewVersions = useMemo(
    () =>
      games
        ?.filter(
          (g) =>
            filteredGameIds.length === 0 ||
            filteredGameIds.includes(g.id.toString())
        )
        ?.map((g) => ({
          gameId: g.id,
          gameVersionId: g.gameVersions.nodes
            .filter(
              (v) =>
                v.status === "DRAFT" ||
                v.status === "ACTIVE" ||
                v.status === "IN_REVIEW"
            )
            .at(0)?.gameVersionId,
        }))
        .filter(
          (g): g is { gameId: number; gameVersionId: number } =>
            !!g.gameVersionId
        ),
    [games, filteredGameIds]
  )

  const queue = useRef(Promise.resolve())
  const [progressText, setProgressText] = useState("")
  const [successes, setSuccesses] = useState<
    { gameId: number; gameVersionId: number }[]
  >([])
  const [failures, setFailures] = useState<
    { gameId: number; gameVersionId: number; error: string }[]
  >([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!gamesLoading && gamesWithLatestActiveDraftOrInReviewVersions) {
      gamesWithLatestActiveDraftOrInReviewVersions.forEach(
        ({ gameId, gameVersionId }, i) => {
          queue.current = queue.current.then(async () => {
            setProgressText(
              `Updating game ${i + 1} of ${
                gamesWithLatestActiveDraftOrInReviewVersions.length
              }`
            )

            try {
              const result = await updateGameSdk({ gameId })

              if (result?.success) {
                setSuccesses((prev) => [...prev, { gameId, gameVersionId }])
              } else {
                setFailures((prev) => [
                  ...prev,
                  {
                    gameId,
                    gameVersionId,
                    error: result?.error ?? "Unknown error",
                  },
                ])
              }
            } catch (error) {
              setFailures((prev) => [
                ...prev,
                {
                  gameId,
                  gameVersionId,
                  error:
                    error instanceof ApolloError
                      ? formatApolloError(error, {
                          default: error.message,
                        })
                      : JSON.stringify(error),
                },
              ])
            }
          })
        }
      )

      queue.current.then(() => setDone(true))
    }
  }, [
    gamesLoading,
    gamesWithLatestActiveDraftOrInReviewVersions,
    updateGameSdk,
  ])

  return (
    <Step
      status={done ? (failures.length ? "error" : "success") : "waiting"}
      label={
        done
          ? failures.length
            ? successes.length
              ? "Some games failed to update"
              : "All games failed to update"
            : "Finished updating all games"
          : progressText
      }
      view={
        <Box flexDirection="column">
          {!!successes.length && (
            <Box flexDirection="column">
              <Text color="green">Successfully updated games:</Text>
              <Box paddingLeft={1}>
                <Text color="green">
                  {successes
                    .map(
                      ({ gameId, gameVersionId }) =>
                        `#${gameId} (v${gameVersionId})`
                    )
                    .join(", ")}
                </Text>
              </Box>
            </Box>
          )}
          {!!failures.length && (
            <Box flexDirection="column">
              <Text color="red">Failed to update:</Text>
              <Box flexDirection="column" paddingLeft={1}>
                {failures.map(({ gameId, gameVersionId, error }) => (
                  <Text key={`${gameId}-${gameVersionId}`} color="red">
                    #{gameId} (v{gameVersionId}): {error}
                  </Text>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      }
    />
  )
}
