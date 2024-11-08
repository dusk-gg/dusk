import { Text } from "ink"
import React, { useState, useEffect } from "react"

export function DisappearingHint({
  text,
  delay = 4000,
}: {
  text: string
  delay?: number
}) {
  const [hintOpacity, setHintOpacity] = useState<0 | 0.5 | 1>(1)

  useEffect(() => {
    const handle = setTimeout(() => setHintOpacity(0.5), delay / 2)
    const handle2 = setTimeout(() => setHintOpacity(0), delay)

    return () => {
      clearTimeout(handle)
      clearTimeout(handle2)
    }
  }, [delay])

  if (hintOpacity === 0) return null

  return (
    <Text color="yellow" italic dimColor={hintOpacity < 1}>
      {text}
    </Text>
  )
}
