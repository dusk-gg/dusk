import React, { useState, useCallback, useEffect, useMemo } from "react"

import { Select } from "../../components/Select.js"
import { Step } from "../../components/Step.js"
import { GameDevType } from "../../generated/types.js"
import { renderGameDevType } from "../../lib/renderGameDevType.js"

export function ChooseMemberTypeStep({
  currentMemberType,
  onComplete,
  showRemove,
}: {
  currentMemberType: GameDevType | null | undefined
  onComplete: (memberType: GameDevType | null) => void
  showRemove: boolean
}) {
  const [memberType, setMemberType] = useState<GameDevType | null>(
    GameDevType.TESTER
  )
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (currentMemberType) setMemberType(currentMemberType)
  }, [currentMemberType])

  const items = useMemo(
    () => [
      ...(showRemove
        ? [
            {
              label: "REMOVE MEMBER",
              value: null,
            },
          ]
        : []),
      ...Object.values(GameDevType)
        .map((value) => ({
          label: renderGameDevType(value),
          value,
        }))
        .sort((i1, i2) => i1.label.localeCompare(i2.value)),
    ],
    [showRemove]
  )

  const onSubmit = useCallback(() => {
    setSubmitted(true)
    onComplete(memberType)
  }, [memberType, onComplete])

  const chosenMemberTypeLabel = useMemo(() => {
    if (memberType === null) return "REMOVE MEMBER"

    return renderGameDevType(memberType)
  }, [memberType])

  return (
    <Step
      status={submitted ? "success" : "userInput"}
      label={submitted ? chosenMemberTypeLabel : "Select a role"}
      view={
        !submitted && (
          <Select
            items={items}
            value={memberType}
            onChange={setMemberType}
            onSubmit={onSubmit}
          />
        )
      }
    />
  )
}
