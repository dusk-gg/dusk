import { Box, Text } from "ink"
import React, { useState } from "react"

import { ChooseGameStep } from "../Upload/ChooseGameStep.js"

import { UpdateAll } from "./UpdateAll.js"
import { UpdateGameStep } from "./UpdateGameStep.js"

export function Update({ args }: { args: string[] }) {
  const [gameId, setGameId] = useState<number | null | undefined>()

  if (args[0]) {
    if (args[0] === "all") return <UpdateAll args={args} />

    return <Text color="red">Invalid argument `{args[0]}`</Text>
  }

  return (
    <Box flexDirection="column">
      <ChooseGameStep
        currentGameId={gameId}
        onComplete={setGameId}
        onlyExisting
      />
      {gameId && <UpdateGameStep gameId={gameId} />}
    </Box>
  )
}
