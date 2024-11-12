import { Box } from "ink"
import TextInputImport from "ink-text-input"
import React, { useState, useCallback, useEffect } from "react"

import { Step } from "../../components/Step.js"
import { GameType } from "../../generated/types.js"
import { useCreateGame } from "../../gql/useCreateGame.js"
import { gameDescriptionErrors } from "../../lib/gameDescriptionErrors.js"
import { prepareFileUpload } from "../../lib/prepareFileUpload.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

export function CreateGameStep({
  onComplete,
}: {
  onComplete: (newGameId: number) => void
}) {
  const [title, setTitle] = useState("")
  const [titleSubmitted, setTitleSubmitted] = useState(false)
  const [description, setDescription] = useState("")
  const [descriptionSubmitted, setDescriptionSubmitted] = useState(false)
  const [previewImgPath, setPreviewImgPath] = useState("")
  const [previewImgPathSubmitted, setPreviewImgPathSubmitted] = useState(false)
  const { createGame, createGameLoading, createGameError, createdGameId } =
    useCreateGame()

  const onSubmitTitle = useCallback(() => {
    if (title) setTitleSubmitted(true)
  }, [title])

  const onSubmitDescription = useCallback(() => {
    setDescriptionSubmitted(true)
  }, [])

  const onSubmitPreviewImgPath = useCallback(() => {
    setPreviewImgPathSubmitted(true)
  }, [])

  useEffect(() => {
    if (titleSubmitted && descriptionSubmitted && previewImgPathSubmitted) {
      createGame({
        title,
        description,
        ...(previewImgPath && {
          previewImg: prepareFileUpload(previewImgPath),
        }),
        type: GameType.MULTIPLAYER,
      })
    }
  }, [
    createGame,
    description,
    descriptionSubmitted,
    previewImgPath,
    previewImgPathSubmitted,
    title,
    titleSubmitted,
  ])

  useEffect(() => {
    if (createGameError) {
      setTitleSubmitted(false)
      setDescriptionSubmitted(false)
      setPreviewImgPathSubmitted(false)
    }
  }, [createGameError])

  useEffect(() => {
    if (createdGameId) onComplete(createdGameId)
  }, [createdGameId, onComplete])

  return (
    <Box flexDirection="column">
      {createGameError && !createGameLoading && (
        <Step status="error" label={gameDescriptionErrors(createGameError)} />
      )}
      <Step
        status={titleSubmitted ? "success" : "userInput"}
        label={
          titleSubmitted
            ? `Will create a game called ${title}`
            : "Enter new game title"
        }
        view={
          !titleSubmitted && (
            <TextInput
              placeholder="My cool game"
              value={title}
              onChange={setTitle}
              onSubmit={onSubmitTitle}
            />
          )
        }
      />
      {titleSubmitted && (
        <Step
          status={descriptionSubmitted ? "success" : "userInput"}
          label={
            descriptionSubmitted
              ? description
                ? "Description provided"
                : "No description"
              : "Enter new game description"
          }
          view={
            !descriptionSubmitted && (
              <TextInput
                placeholder="My game description"
                value={description}
                onChange={setDescription}
                onSubmit={onSubmitDescription}
              />
            )
          }
        />
      )}
      {descriptionSubmitted && (
        <Step
          status={previewImgPathSubmitted ? "success" : "userInput"}
          label={
            previewImgPathSubmitted
              ? previewImgPath === ""
                ? "Will create a game without a preview image"
                : `Will use the preview image at ${previewImgPath}`
              : "Provide path to game preview image (optional)"
          }
          view={
            !previewImgPathSubmitted && (
              <TextInput
                placeholder="/path/to/preview_img.png"
                value={previewImgPath}
                onChange={setPreviewImgPath}
                onSubmit={onSubmitPreviewImgPath}
              />
            )
          }
        />
      )}
      {createGameLoading && <Step status="waiting" label="Creating the game" />}
    </Box>
  )
}
