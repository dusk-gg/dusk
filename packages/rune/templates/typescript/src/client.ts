import "./styles.css"

import { PlayerId } from "rune-sdk"

import selectSoundAudio from "./assets/select.wav"
import { Cells } from "./logic.ts"

const board = document.getElementById("board")!
const playersSection = document.getElementById("playersSection")!

const selectSound = new Audio(selectSoundAudio)

let cellButtons: HTMLButtonElement[], playerContainers: HTMLLIElement[]

function initUI(
  cells: Cells,
  playerIds: PlayerId[],
  yourPlayerId: PlayerId | undefined
) {
  cellButtons = cells.map((_, cellIndex) => {
    const button = document.createElement("button")
    button.addEventListener("click", () => Rune.actions.claimCell(cellIndex))
    board.appendChild(button)

    return button
  })

  playerContainers = playerIds.map((playerId, index) => {
    const player = Rune.getPlayerInfo(playerId)

    const li = document.createElement("li")
    li.setAttribute("player", index.toString())
    li.innerHTML = `<img src="${player.avatarUrl}" />
           <span>${
             player.displayName +
             (player.playerId === yourPlayerId ? "<br>(You)" : "")
           }</span>`
    playersSection.appendChild(li)

    return li
  })
}

Rune.initClient({
  onChange: ({ game, yourPlayerId, action }) => {
    const { cells, playerIds, winCombo, lastMovePlayerId, freeCells } = game

    if (!cellButtons) initUI(cells, playerIds, yourPlayerId)

    if (lastMovePlayerId) board.classList.remove("initial")

    cellButtons.forEach((button, i) => {
      const cellValue = cells[i]

      button.setAttribute(
        "player",
        (cellValue !== null ? playerIds.indexOf(cellValue) : -1).toString()
      )
      button.setAttribute(
        "dim",
        String((winCombo && !winCombo.includes(i)) || (!freeCells && !winCombo))
      )

      if (cells[i] || lastMovePlayerId === yourPlayerId || winCombo) {
        button.setAttribute("disabled", "")
      } else {
        button.removeAttribute("disabled")
      }
    })

    playerContainers.forEach((container, i) => {
      container.setAttribute(
        "your-turn",
        String(playerIds[i] !== lastMovePlayerId && !winCombo && freeCells)
      )
    })

    if (action && action.name === "claimCell") selectSound.play()
  },
})
