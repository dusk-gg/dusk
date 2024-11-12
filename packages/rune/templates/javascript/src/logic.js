function setup(allPlayerIds) {
  const game = {
    cells: new Array(9).fill(null),
    winCombo: null,
    lastMovePlayerId: null,
    playerIds: allPlayerIds,
  }

  return game
}

function claimCell(cellIndex, { game, playerId }) {
  if (game.cells[cellIndex] !== null || playerId === game.lastMovePlayerId) {
    throw Rune.invalidAction()
  }

  game.cells[cellIndex] = playerId
  game.lastMovePlayerId = playerId
  game.winCombo = findWinningCombo(game.cells)

  if (game.winCombo) {
    Rune.gameOver({
      players: {
        [game.lastMovePlayerId]: "WON",
        [game.playerIds.find((id) => id !== game.lastMovePlayerId)]: "LOST",
      },
    })
  }

  game.freeCells = game.cells.findIndex((cell) => cell === null) !== -1

  if (!game.freeCells) {
    Rune.gameOver({
      players: {
        [game.playerIds[0]]: "LOST",
        [game.playerIds[1]]: "LOST",
      },
    })
  }
}

function findWinningCombo(cells) {
  return (
    [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ].find((combo) =>
      combo.every((i) => cells[i] && cells[i] === cells[combo[0]])
    ) || null
  )
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup,
  actions: { claimCell },
})
