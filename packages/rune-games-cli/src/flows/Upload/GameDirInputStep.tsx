import { Box, Text } from "ink"
import TextInputImport from "ink-text-input"
import path from "path"
import React, { useState, useMemo, useCallback, useEffect } from "react"

import { Step } from "../../components/Step.js"
import { ValidationErrors } from "../../components/ValidationErrors.js"
import { cli } from "../../lib/cli.js"
import {
  getGameFiles,
  findShortestPathFileThatEndsWith,
  FileInfo,
} from "../../lib/getGameFiles.js"
import {
  validateGameFiles,
  ValidationResult,
} from "../../lib/validateGameFiles.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

export function GameDirInputStep({
  onComplete,
}: {
  onComplete: (args: { gameDir: string; multiplayer: boolean }) => void
}) {
  const [gameDir, setGameDir] = useState(
    () => cli.input[1] ?? path.resolve(".")
  )
  const gameDirFormatted = useMemo(
    () =>
      path.relative(".", gameDir) === ""
        ? "Current directory"
        : path.resolve(gameDir),
    [gameDir]
  )

  const [validateGameResult, setValidateGameResult] =
    useState<ValidationResult | null>(null)

  const [logicJsFile, setLogicJsFile] = useState<FileInfo | undefined>()

  const onSubmitGameDir = useCallback(() => {
    getGameFiles(gameDir)
      .then((gameFiles) => {
        setLogicJsFile(findShortestPathFileThatEndsWith(gameFiles, "logic.js"))

        return validateGameFiles(gameFiles)
      })
      .then(setValidateGameResult)
  }, [gameDir])

  useEffect(() => {
    if (validateGameResult?.valid) {
      onComplete({ gameDir, multiplayer: !!validateGameResult.multiplayer })
    }
  }, [
    gameDir,
    onComplete,
    validateGameResult?.multiplayer,
    validateGameResult?.valid,
  ])

  return (
    <>
      {!!validateGameResult?.errors.length && (
        <Step
          status="error"
          label="Some issues detected with your game"
          view={
            <ValidationErrors
              validationResult={validateGameResult}
              logicJsFile={logicJsFile}
            />
          }
        />
      )}
      <Step
        status={validateGameResult?.valid ? "success" : "userInput"}
        label={
          validateGameResult?.valid
            ? `Using game files from ${gameDirFormatted}`
            : validateGameResult?.valid === false
            ? "Update your game to fix these issues 😄"
            : "Enter the game directory"
        }
        view={(status) => (
          <Box flexDirection="column">
            {(status === "userInput" || status === "error") && (
              <Box>
                <Text>Game directory: </Text>
                <TextInput
                  placeholder="/path/to/game"
                  value={gameDir}
                  onChange={setGameDir}
                  onSubmit={onSubmitGameDir}
                />
              </Box>
            )}
          </Box>
        )}
      />
    </>
  )
}
