import React, { useState, useEffect } from "react"

import { Choose } from "../../components/Choose.js"
import { Step } from "../../components/Step.js"
import { useGame } from "../../gql/useGame.js"

export function ConfirmationStep({
  label,
  gameId,
  gameDir,
  onComplete,
}: {
  label: (gameTitle: string, gameDir: string) => string
  gameId: number | null
  gameDir: string
  onComplete: (confirmed: boolean, gameDir: string) => void
}) {
  const { game } = useGame(gameId)
  const [confirmed, setConfirmed] = useState<boolean | undefined>()

  useEffect(() => {
    if (typeof confirmed === "boolean") onComplete(confirmed, gameDir)
  }, [confirmed, onComplete, gameDir])

  return (
    <Step
      status={
        !game && gameId !== null
          ? "waiting"
          : confirmed === undefined
            ? "userInput"
            : confirmed
              ? "success"
              : "error"
      }
      label={
        game || gameId === null
          ? label(game?.title ?? "", gameDir) +
            (typeof confirmed === "boolean"
              ? confirmed
                ? " (Yes)"
                : " (No)"
              : "")
          : "..."
      }
      view={
        confirmed === undefined && (
          <Choose
            options={["No", "Yes"]}
            onSubmit={(response) => setConfirmed(response === "Yes")}
          />
        )
      }
    />
  )
}
