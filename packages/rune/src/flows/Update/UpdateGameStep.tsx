import { Box } from "ink"
import TextInputImport from "ink-text-input"
import React, { useState, useCallback, useEffect } from "react"

import { Step } from "../../components/Step.js"
import { useGame } from "../../gql/useGame.js"
import { useMe } from "../../gql/useMe.js"
import { useUpdateGame } from "../../gql/useUpdateGame.js"
import { gameDescriptionErrors } from "../../lib/gameDescriptionErrors.js"
import { prepareFileUpload } from "../../lib/prepareFileUpload.js"

// @ts-ignore
const TextInput = TextInputImport.default as typeof TextInputImport

export function UpdateGameStep({ gameId }: { gameId: number }) {
  const { me } = useMe()
  const isAdmin = Boolean(me?.admin)

  const { game } = useGame(gameId)
  const [initialValuesSet, setInitialValuesSet] = useState(false)
  const [title, setTitle] = useState("")
  const [titleSubmitted, setTitleSubmitted] = useState(false)
  const [description, setDescription] = useState("")
  const [descriptionSubmitted, setDescriptionSubmitted] = useState(false)
  const [previewImgPath, setPreviewImgPath] = useState("")
  const [previewImgPathSubmitted, setPreviewImgPathSubmitted] = useState(false)
  const [logoPath, setLogoPath] = useState("")
  const [logoPathSubmitted, setLogoPathSubmitted] = useState(false)
  const { updateGame, updateGameLoading, updateGameError, updatedGame } =
    useUpdateGame()

  const onSubmitTitle = useCallback(() => {
    if (title) setTitleSubmitted(true)
  }, [title])

  const onSubmitDescription = useCallback(() => {
    setDescriptionSubmitted(true)
  }, [])

  const onSubmitPreviewImgPath = useCallback(() => {
    setPreviewImgPathSubmitted(true)
  }, [])

  const onSubmitLogoPath = useCallback(() => {
    setLogoPathSubmitted(true)
  }, [])

  useEffect(() => {
    if (
      titleSubmitted &&
      descriptionSubmitted &&
      previewImgPathSubmitted &&
      // Only allow admin to upload logo
      (!isAdmin || logoPathSubmitted)
    ) {
      updateGame({
        gameId,
        title,
        description,
        ...(previewImgPath && {
          previewImg: prepareFileUpload(previewImgPath),
        }),
        ...(logoPath && { logo: prepareFileUpload(logoPath) }),
      })
    }
  }, [
    isAdmin,
    description,
    descriptionSubmitted,
    gameId,
    previewImgPath,
    previewImgPathSubmitted,
    logoPath,
    logoPathSubmitted,
    title,
    titleSubmitted,
    updateGame,
  ])

  useEffect(() => {
    if (updateGameError) {
      setTitleSubmitted(false)
      setDescriptionSubmitted(false)
      setPreviewImgPathSubmitted(false)
      setLogoPathSubmitted(false)
    }
  }, [updateGameError])

  useEffect(() => {
    if (initialValuesSet) return

    if (game) {
      setTitle(game.title)

      if (game.description) {
        setDescription(game.description)
      }

      setInitialValuesSet(true)
    }
  }, [initialValuesSet, game])

  return (
    <Box flexDirection="column">
      <Step
        status={titleSubmitted ? "success" : "userInput"}
        label={
          titleSubmitted
            ? `Will set the title to ${title}`
            : "Enter the updated game title"
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
                ? "Will set the description"
                : "Will not change the description"
              : "Enter the updated game description"
          }
          view={
            !descriptionSubmitted && (
              <TextInput
                placeholder="My cool game"
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
                ? "Will not update the game preview image"
                : `Will update the preview image to the one from ${previewImgPath}`
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
      {/* Only allow admin to upload logo */}
      {previewImgPathSubmitted && isAdmin && (
        <Step
          status={logoPathSubmitted ? "success" : "userInput"}
          label={
            logoPathSubmitted
              ? logoPath === ""
                ? "Will not update the game logo"
                : `Will update the logo to the one from ${logoPath}`
              : "Admin only step: Provide path to game logo (optional)"
          }
          view={
            !logoPathSubmitted && (
              <TextInput
                placeholder="/path/to/logo.png"
                value={logoPath}
                onChange={setLogoPath}
                onSubmit={onSubmitLogoPath}
              />
            )
          }
        />
      )}
      {(updateGameLoading || updateGameError) && (
        <Step
          status={updateGameLoading ? "waiting" : "error"}
          label={
            updateGameError
              ? gameDescriptionErrors(updateGameError)
              : "Updating the game"
          }
        />
      )}
      {updatedGame && <Step status="success" label="Game updated" />}
    </Box>
  )
}
