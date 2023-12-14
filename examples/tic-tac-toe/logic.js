function setup(players) {
  return {
    players,
    lastPlayerId: null,
    cells: new Array(9).fill(null),
    winCombo: null,
  }
}

const findWinningCombo = (cells) => {
  const WINNING_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const combo of WINNING_COMBOS) {
    const [i1, i2, i3] = combo
    if (
      cells[i1] !== null &&
      cells[i1] === cells[i2] &&
      cells[i1] === cells[i3]
    ) {
      return combo
    }
  }
  return null
}

function claimCell(cellIndex, { game, playerId }) {
  // Cannot play during someone else's turn or claim existing cells
  if (game.cells[cellIndex] !== null || playerId === game.lastPlayerId) {
    throw Rune.invalidAction()
  }

  game.cells[cellIndex] = playerId
  game.winCombo = findWinningCombo(game.cells)
  game.lastPlayerId = playerId

  if (game.winCombo) {
    Rune.gameOver({
      players: {
        [game.lastPlayerId]: "WON",
        [game.players.find((id) => id !== game.lastPlayerId)]: "LOST",
      },
    })
  }

  // Are there no more available moves? (i.e. it's a draw)
  if (game.cells.findIndex((cell) => cell === null) === -1) {
    Rune.gameOver({
      players: {
        [game.players[0]]: "LOST",
        [game.players[1]]: "LOST",
      },
    })
  }
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup,
  actions: {
    claimCell,
  },
})
