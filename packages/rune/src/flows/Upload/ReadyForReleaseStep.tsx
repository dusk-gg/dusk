import React, { useState, useEffect, useMemo } from "react"

import { Choose } from "../../components/Choose.js"
import { Step } from "../../components/Step.js"

export function ReadyForReleaseStep({
  onComplete,
}: {
  onComplete: (readyForRelease: boolean) => void
}) {
  const [readyForRelease, setReadyForRelease] = useState<boolean | undefined>()

  useEffect(() => {
    if (readyForRelease !== undefined) onComplete(readyForRelease)
  }, [readyForRelease, onComplete])

  const label = useMemo(() => {
    if (readyForRelease === undefined) return "Is your game ready for release?"

    return readyForRelease
      ? "Game is ready, Rune will review + release it after upload"
      : "Game is not ready, just uploading for playtesting"
  }, [readyForRelease])

  return (
    <Step
      status={readyForRelease !== undefined ? "success" : "userInput"}
      label={label}
      view={
        readyForRelease === undefined && (
          <Choose
            options={["No", "Yes"]}
            onSubmit={(response) => {
              setReadyForRelease(response === "Yes")
            }}
          />
        )
      }
    />
  )
}
