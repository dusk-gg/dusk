import { Box, Text } from "ink"
import TextInputImport from "ink-text-input"
import path from "path"
import React, { useState, useMemo, useCallback, useEffect } from "react"

import { Step } from "../../components/Step.js"
import { ValidationErrors } from "../../components/ValidationErrors.js"
import { cli } from "../../lib/cli.js"
import { findGameDir } from "../../lib/findGameDir.js"
import {
  getGameFiles,
  findShortestPathFileThatEndsWith,
  FileInfo,
} from "../../lib/getGameFiles.js"
import { isDir } from "../../lib/isDir.js"
import { ValidationResult } from "../../lib/validateGameFiles.js"
import { validateGameFilesInCLI } from "../../lib/validateGameFilesInCli.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

export function GameDirInputStep({
  onComplete,
}: {
  onComplete: (args: { gameDir: string }) => void
}) {
  const [gameDir, setGameDir] = useState(() =>
    findGameDir(cli.input[1] ?? path.resolve("."))
  )
  const existsGameDir = useMemo(() => isDir(gameDir), [gameDir])
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
    if (!existsGameDir) return

    getGameFiles(gameDir)
      .then((gameFiles) => {
        setLogicJsFile(findShortestPathFileThatEndsWith(gameFiles, "logic.js"))

        return validateGameFilesInCLI(gameFiles)
      })
      .then(setValidateGameResult)
  }, [existsGameDir, gameDir])

  useEffect(() => {
    if (validateGameResult?.valid) {
      onComplete({ gameDir })
    }
  }, [gameDir, onComplete, validateGameResult?.valid])

  useEffect(() => {
    if (!existsGameDir) {
      setValidateGameResult(null)
    }
  }, [existsGameDir])

  //Skip directory selection step in case a valid directory is provided
  useEffect(() => {
    if (cli.input[1]) {
      onSubmitGameDir()
    }
  }, [onSubmitGameDir])

  return (
    <>
      {(!existsGameDir || !!validateGameResult?.errors.length) && (
        <Step
          status="error"
          label={
            !existsGameDir
              ? "Directory does not exist"
              : "Some issues detected with your game"
          }
          view={
            validateGameResult && (
              <ValidationErrors
                validationResult={validateGameResult}
                logicJsFile={logicJsFile}
              />
            )
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
