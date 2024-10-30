import { useState, useEffect } from "react"

export function useTimerValue({
  startedAt,
  duration,
}: {
  startedAt?: number
  duration: number
}) {
  const [value, setValue] = useState<number | null>(null)

  useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined

    if (startedAt) {
      const adjustedStartedAt =
        Date.now() - (Rune.gameTime() / 1000 - startedAt) * 1000

      const tick = () => {
        const newValue =
          duration - (Date.now() - adjustedStartedAt) / 1000 - 0.5

        if (newValue <= 0) {
          setValue(0)
        } else {
          setValue((oldValue) =>
            // if we add time, don't go backwards, pause instead
            oldValue !== null && newValue > oldValue ? oldValue : newValue
          )
          handle = requestAnimationFrame(tick)
        }
      }

      tick()
    } else {
      setValue(null)
    }

    return () => {
      if (handle) cancelAnimationFrame(handle)
    }
  }, [duration, startedAt])

  return value
}
