import figures from "figures"
import { useInput, Box, Text } from "ink"
import React, { useState } from "react"

import { DisappearingHint } from "./DisappearingHint.js"

export function Choose<T extends string>({
  options,
  onSubmit,
}: {
  options: T[]
  onSubmit: (value: T) => void
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useInput((_, key) => {
    if (key.downArrow || key.rightArrow) {
      setSelectedIndex(
        selectedIndex < options.length - 1 ? selectedIndex + 1 : 0
      )
    } else if (key.upArrow || key.leftArrow) {
      setSelectedIndex(
        selectedIndex > 0 ? selectedIndex - 1 : options.length - 1
      )
    } else if (key.return) {
      onSubmit(options[selectedIndex]!)
    }
  })

  return (
    <Box>
      {options.map((option, i) => (
        <Box key={option} paddingLeft={i > 0 ? 1 : 0}>
          <Text underline={i === selectedIndex} dimColor={i !== selectedIndex}>
            {option}
          </Text>
        </Box>
      ))}

      <Box paddingLeft={4}>
        <DisappearingHint
          text={`Use arrow keys ${figures.arrowLeft}${figures.arrowRight} to choose`}
        />
      </Box>
    </Box>
  )
}
