import figures from "figures"
import { useInput, Box, Text } from "ink"
import React, { useMemo } from "react"

export function Select<T>({
  items,
  value,
  onChange,
  onSubmit,
}: {
  items: { label: string; value: T; disabled?: boolean }[]
  value: T
  onChange: (value: T) => void
  onSubmit: () => void
}) {
  const currentIndex = useMemo(
    () => items.findIndex((item) => item.value === value),
    [items, value]
  )

  useInput((_, key) => {
    const firstItem = items.at(0)
    const lastItem = items.at(-1)
    const nextItem = items[currentIndex + 1]
    const prevItem = items[currentIndex - 1]

    if (key.downArrow) {
      if (nextItem) onChange(nextItem.value)
      else if (firstItem) onChange(firstItem.value)
    } else if (key.upArrow) {
      if (prevItem) onChange(prevItem.value)
      else if (lastItem) onChange(lastItem.value)
    } else if (key.return) {
      if (items.find((item) => item.value === value)?.disabled) return
      onSubmit()
    }
  })

  const { window, beforeCount, afterCount } = useMemo(
    () => getWindow(items, currentIndex, 7),
    [currentIndex, items]
  )

  return (
    <Box flexDirection="column">
      {beforeCount > 0 && (
        <Text dimColor italic>
          &nbsp;&nbsp;... {beforeCount} more
        </Text>
      )}
      {window.map((item, i) => (
        <Text
          key={i}
          dimColor={value !== item.value}
          color={item.disabled ? "red" : undefined}
        >
          {value === item.value
            ? item.disabled
              ? figures.cross
              : figures.pointer
            : " "}{" "}
          <Text underline={value === item.value}>{item.label}</Text>
        </Text>
      ))}
      {afterCount > 0 && (
        <Text dimColor italic>
          &nbsp;&nbsp;... {afterCount} more
        </Text>
      )}
    </Box>
  )
}

function getWindow<T>(list: T[], index: number, windowSize: number) {
  let windowSizeRemains = windowSize

  const window = []

  for (let i = 0; i < list.length * 2; i++) {
    if (windowSizeRemains === 0) break

    const item = list[index + Math.floor(i % 2 === 0 ? i / 2 : -i / 2)]

    if (item) {
      if (i % 2 === 0) window.push(item)
      else window.unshift(item)
      windowSizeRemains--
    }
  }

  const windowHead = window.at(0)
  const windowTail = window.at(-1)

  return {
    window,
    beforeCount: windowHead ? list.indexOf(windowHead) : 0,
    afterCount: windowTail ? list.length - 1 - list.indexOf(windowTail) : 0,
  }
}
