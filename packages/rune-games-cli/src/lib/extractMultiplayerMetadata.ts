const regexes = {
  minPlayers: /minPlayers\s*:\s*?([0-9]+)/,
  maxPlayers: /maxPlayers\s*:\s*?([0-9]+)/,
  playerJoined: /playerJoined\s*[:(]/,
  playerLeft: /playerLeft\s*[:(]/,
  updatesPerSecond: /updatesPerSecond\s*:\s*?([0-9]+)/,
  inputDelay: /inputDelay\s*:\s*?([0-9]+)/,
}

export function extractMultiplayerMetadata(logicJsContent: string) {
  const minPlayersString = logicJsContent.match(regexes.minPlayers)?.at(1)
  const minPlayers = minPlayersString ? parseInt(minPlayersString) : undefined

  const maxPlayersString = logicJsContent.match(regexes.maxPlayers)?.at(1)
  const maxPlayers = maxPlayersString ? parseInt(maxPlayersString) : undefined

  const updatesPerSecondString = logicJsContent
    .match(regexes.updatesPerSecond)
    ?.at(1)
  const updatesPerSecond = updatesPerSecondString
    ? parseInt(updatesPerSecondString)
    : undefined

  const handlesPlayerJoined = regexes.playerJoined.test(logicJsContent)

  const handlesPlayerLeft = regexes.playerLeft.test(logicJsContent)

  const inputDelayString = logicJsContent.match(regexes.inputDelay)?.at(1)
  const inputDelay = inputDelayString ? parseInt(inputDelayString) : undefined

  return {
    minPlayers,
    maxPlayers,
    handlesPlayerJoined,
    handlesPlayerLeft,
    updatesPerSecond,
    inputDelay,
  }
}
