import { Cell } from "./types/GameState"
import { cellPointer } from "./cellPointer"

export function findDuplicates(board: Cell[]) {
  const result: (
    | { row: number; value: number }
    | { col: number; value: number }
    | { sector: number; value: number }
  )[] = []

  for (let row = 0; row < 9; row++) {
    const numbers: number[] = []

    for (let col = 0; col < 9; col++) {
      const { value } = board[cellPointer({ row, col })]

      if (value) {
        if (numbers.includes(value)) result.push({ row, value })
        else numbers.push(value)
      }
    }
  }

  for (let col = 0; col < 9; col++) {
    const numbers: number[] = []

    for (let row = 0; row < 9; row++) {
      const { value } = board[cellPointer({ row, col })]

      if (value) {
        if (numbers.includes(value)) result.push({ col, value })
        else numbers.push(value)
      }
    }
  }

  for (let sector = 0; sector < 9; sector++) {
    const numbers: number[] = []

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const { value } =
          board[
            cellPointer({
              row: row + Math.floor(sector / 3) * 3,
              col: col + (sector % 3) * 3,
            })
          ]

        if (value) {
          if (numbers.includes(value)) result.push({ sector, value })
          else numbers.push(value)
        }
      }
    }
  }

  return result
}
