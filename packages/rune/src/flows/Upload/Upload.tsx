import { Box, Text } from "ink"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { useGames } from "../../gql/useGames.js"
import { useMe } from "../../gql/useMe.js"
import { buildOutOfDate } from "../../lib/checkBuildUpToDate.js"
import { CliFlags } from "../../lib/cli.js"
import { getMyGames } from "../../lib/getMyGames.js"

import { ChooseGameStep } from "./ChooseGameStep.js"
import { ConfirmationStep } from "./ConfirmationStep.js"
import { CreateGameStep } from "./CreateGameStep.js"
import { CreateGameVersionStep } from "./CreateGameVersionStep.js"
import { GameDirInputStep } from "./GameDirInputStep.js"
import { ReadyForReleaseStep } from "./ReadyForReleaseStep.js"

export function Upload({ flags }: { flags: CliFlags }) {
  const [gameDir, setGameDir] = useState<string | undefined>()
  const [gameId, setGameId] = useState<number | null | undefined>()
  const [readyForRelease, setReadyForRelease] = useState<boolean | undefined>(
    undefined
  )

  const { me } = useMe()
  const { games } = useGames({ skip: !me })
  const { release: releaseFlag, name, draft: draftFlag } = flags

  const shouldConfirmDiscordPost =
    me?.email?.endsWith("@rune.ai") && readyForRelease
  const [discordPostConfirmed, setDiscordPostConfirmed] = useState<
    boolean | undefined
  >(undefined)

  const { myGames } = useMemo(
    () => getMyGames({ games, devId: me?.devId }),
    [games, me]
  )

  const shouldConfirmUpload = (myGames?.length ?? 0) > 1
  const [uploadConfirmed, setUploadConfirmed] = useState<boolean | undefined>(
    undefined
  )
  const [buildCheckComplete, setBuildCheckComplete] = useState<
    boolean | undefined
  >(undefined)

  // check if the a rebuild might be required, if not then mark that we
  // don't need to display the build check any more - otherwise
  // we're prompt the user
  const buildRequired = useCallback((gameDir: string) => {
    const required = buildOutOfDate(gameDir)

    if (!required) {
      setBuildCheckComplete(true)
    }

    return required
  }, [])

  useEffect(() => {
    if (releaseFlag) {
      setReadyForRelease(true)
    }

    if (draftFlag) {
      setReadyForRelease(false)
    }

    const gameFromInputFlag =
      name &&
      myGames?.filter(
        (game) => game.title.toLowerCase() === name.toLowerCase()
      )[0]

    gameFromInputFlag && setGameId(gameFromInputFlag.id)

    //In case --release or --draft flag is used, automatically confirm to skip interactive step
    if (releaseFlag || draftFlag) {
      setUploadConfirmed(true)
    }
  }, [myGames, name, releaseFlag, draftFlag])

  return (
    <Box flexDirection="column">
      <Text>
        When your game is published, your Rune profile will be shown next to the
        game.
      </Text>
      <GameDirInputStep
        onComplete={({ gameDir }) => {
          setGameDir(gameDir)
        }}
      />
      {gameDir !== undefined && (
        <>
          {readyForRelease === undefined ? (
            <ReadyForReleaseStep onComplete={setReadyForRelease} />
          ) : (
            <>
              {!buildCheckComplete && buildRequired(gameDir) && (
                <ConfirmationStep
                  label={() =>
                    `Your build files seem to be outdated. You might need to build/compile your game before uploading. Are you sure you want to continue?`
                  }
                  gameId={null}
                  gameDir={gameDir}
                  onComplete={setBuildCheckComplete}
                />
              )}

              {buildCheckComplete &&
                (gameId === undefined || gameId === null) && (
                  <ChooseGameStep
                    currentGameId={gameId}
                    onComplete={setGameId}
                  />
                )}
              {gameId === null && <CreateGameStep onComplete={setGameId} />}

              {buildCheckComplete && !!gameId && shouldConfirmDiscordPost && (
                <ConfirmationStep
                  label={() =>
                    "Do you want to post a message about the game upload to Discord?"
                  }
                  gameId={gameId}
                  gameDir={gameDir}
                  onComplete={setDiscordPostConfirmed}
                />
              )}

              {!!gameId &&
                (typeof discordPostConfirmed === "boolean" ||
                  !shouldConfirmDiscordPost) &&
                buildCheckComplete &&
                shouldConfirmUpload && (
                  <ConfirmationStep
                    label={(gameTitle, gameDir) =>
                      `Will upload a new version of "${gameTitle}" from ${gameDir}. Are you sure?`
                    }
                    gameId={gameId}
                    gameDir={gameDir}
                    onComplete={setUploadConfirmed}
                  />
                )}

              {!!gameId &&
                (typeof discordPostConfirmed === "boolean" ||
                  !shouldConfirmDiscordPost) &&
                buildCheckComplete &&
                (uploadConfirmed || !shouldConfirmUpload) && (
                  <CreateGameVersionStep
                    gameId={gameId}
                    gameDir={gameDir}
                    readyForRelease={readyForRelease}
                    shouldPostToDiscord={
                      readyForRelease &&
                      (discordPostConfirmed || !shouldConfirmDiscordPost)
                    }
                  />
                )}
            </>
          )}
        </>
      )}
    </Box>
  )
}
