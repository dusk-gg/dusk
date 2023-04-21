import React, { useEffect } from "react"
import styled from "styled-components/macro"
import { Board } from "./Board/Board"
import { useAtom } from "jotai"
import { $state } from "../state/state"
import { Digits } from "./Digits/Digits"

export function App() {
  const [state, setState] = useAtom($state)

  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame, players, yourPlayerId, rollbacks }) => {
        if (rollbacks.length) {
          // TODO: handle rollback by showing alert
          console.error(JSON.stringify(rollbacks))
        }
        setState({ game: newGame, players, yourPlayerId })
      },
    })
  }, [setState])

  if (!state?.game) return null

  return (
    <Root>
      {!state.game.sudoku && (
        <div style={{ color: "white", position: "absolute", zIndex: 1 }}>
          <div>choose difficulty</div>
          <div onClick={() => Rune.actions.startGame("easy")}>easy</div>
          <div onClick={() => Rune.actions.startGame("medium")}>medium</div>
          <div onClick={() => Rune.actions.startGame("hard")}>hard</div>
          <div onClick={() => Rune.actions.startGame("expert")}>expert</div>
        </div>
      )}
      <Board />
      <Digits />
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1e2e44 0%, #423e3d 100%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`
